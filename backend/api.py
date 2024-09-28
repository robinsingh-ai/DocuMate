from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from uuid import uuid4
from threading import Thread
from crews import TechnologyResearchCrew
from log_manager import append_event, outputs, outputs_lock, Event
from tools.pdf_processor import process_local_pdfs, extract_text_from_pdf
from tools.youtube_search_tools import YoutubeVideoSearchTool
from langchain_mongodb import MongoDBAtlasVectorSearch, MongoDBChatMessageHistory
from langchain.schema import Document
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.retrievers import MultiQueryRetriever
from pymongo import MongoClient
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import os
import json
from datetime import datetime
from langchain.retrievers import MultiQueryRetriever
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.output_parsers import CommaSeparatedListOutputParser

print("Starting application...")
load_dotenv()
print("Environment variables loaded.")

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

LOCAL_PDF_DIRECTORY = 'local_pdfs'
print(f"PDF directory set to: {LOCAL_PDF_DIRECTORY}")
if not os.path.exists(LOCAL_PDF_DIRECTORY):
    os.makedirs(LOCAL_PDF_DIRECTORY)
    print(f"Created PDF directory: {LOCAL_PDF_DIRECTORY}")

# MongoDB setup
try:
    client = MongoClient(os.getenv('MONGODB_URI'))
    db = client['pdf_database']
    pdf_collection = db['pdf_documents']
    vector_collection = db['vector_store']
    chat_history_collection = db['chat_history']
    print("MongoDB connection established successfully.")
except Exception as e:
    print(f"Error connecting to MongoDB: {str(e)}")
    raise

# Vector store setup
try:
    embeddings = OpenAIEmbeddings()
    vector_store = MongoDBAtlasVectorSearch(
        collection=vector_collection,
        embedding=embeddings,
        index_name="default"
    )
    print("Vector store initialized successfully.")
except Exception as e:
    print(f"Error initializing vector store: {str(e)}")
    raise

llm = ChatOpenAI(temperature=0, model='gpt-4-1106-preview')
print("Language model initialized.")

youtube_search_tool = YoutubeVideoSearchTool()
print("YouTube search tool initialized.")

def combined_retriever(query):
    vector_results = vector_store.similarity_search(query, k=5)
    
    local_results = []
    for filename in os.listdir(LOCAL_PDF_DIRECTORY):
        if filename.endswith('.pdf'):
            file_path = os.path.join(LOCAL_PDF_DIRECTORY, filename)
            text = extract_text_from_pdf(file_path)
            local_results.append(Document(page_content=text, metadata={"source": filename}))
    
    combined_results = vector_results + local_results
    return combined_results

@app.route('/api/upload_pdf', methods=['POST'])
def upload_pdf():
    print("PDF upload requested")
    if 'file' not in request.files:
        print("No file part in the request")
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        print("No selected file")
        return jsonify({"error": "No selected file"}), 400
    if file and file.filename.endswith('.pdf'):
        filename = secure_filename(file.filename)
        file_path = os.path.join(LOCAL_PDF_DIRECTORY, filename)
        try:
            file.save(file_path)
            print(f"File saved: {file_path}")
            text = extract_text_from_pdf(file_path)
            vector_store.add_texts([text], metadatas=[{"source": filename}])
            print(f"PDF processed and added to vector store: {filename}")
            return jsonify({"message": "File uploaded and processed successfully"}), 200
        except Exception as e:
            print(f"Error saving or processing file: {str(e)}")
            return jsonify({"error": str(e)}), 500
    else:
        print("Invalid file type")
        return jsonify({"error": "Invalid file type"}), 400

@app.route('/api/chat_pdf', methods=['POST'])
def chat_pdf():
    data = request.json
    question = data.get('question')
    session_id = data.get('session_id')
    if not question or not session_id:
        print("Missing question or session_id in chat_pdf request")
        return jsonify({"error": "Missing question or session_id"}), 400
    try:
        print(f"Setting up QA chain for session: {session_id}")
        qa_chain = setup_qa_chain(session_id)
        print(f"Invoking QA chain with question: {question}")
        response = qa_chain.invoke({"question": question})
        print("QA chain response received")
        return jsonify({
            "answer": response['answer'],
            "sources": [doc.page_content for doc in response['source_documents']]
        }), 200
    except Exception as e:
        print(f"Error in chat_pdf: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/search_youtube', methods=['POST'])
def search_youtube():
    data = request.json
    keyword = data.get('keyword')
    max_results = data.get('max_results', 10)
    if not keyword:
        print("Missing keyword in search_youtube request")
        return jsonify({"error": "Missing keyword"}), 400
    try:
        print(f"Searching YouTube for: {keyword}")
        results = youtube_search_tool._run(keyword, max_results)
        print(f"YouTube search results: {len(results)} videos found")
        return jsonify({"results": [result.dict() for result in results]}), 200
    except Exception as e:
        print(f"Error in YouTube search: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/multiagent', methods=['POST'])
def run_crew():
    data = request.json
    if not data or 'technologies' not in data or 'businessareas' not in data:
        print("Invalid request data in run_crew")
        abort(400, description="Invalid request with missing data.")
    input_id = str(uuid4())
    technologies = data['technologies']
    businessareas = data['businessareas']
    print(f"Starting crew for input_id: {input_id}")
    print(f"Technologies: {technologies}")
    print(f"Business areas: {businessareas}")
    thread = Thread(target=kickoff_crew, args=(input_id, technologies, businessareas))
    thread.start()
    return jsonify({"input_id": input_id}), 200

@app.route('/api/multiagent/<input_id>', methods=['GET'])
def get_status(input_id):
    print(f"Checking status for input_id: {input_id}")
    with outputs_lock:
        output = outputs.get(input_id)
        if output is None:
            print(f"Output not found for input_id: {input_id}")
            abort(404, description="Output not found")
        try:
            if isinstance(output.result, dict):
                result_json = output.result
            elif isinstance(output.result, str):
                try:
                    result_json = json.loads(output.result)
                except json.JSONDecodeError:
                    result_json = {"raw_result": output.result}
            else:
                result_json = {"raw_result": str(output.result)}
            print(f"Status for input_id {input_id}: {output.status}")
            return jsonify({
                "input_id": input_id,
                "status": output.status,
                "result": result_json,
                "events": [{"timestamp": event.timestamp.isoformat(), "data": event.data} for event in output.events]
            })
        except Exception as e:
            print(f"Error processing result for input_id: {input_id}. Error: {str(e)}")
            return jsonify({
                "input_id": input_id,
                "status": output.status,
                "result": {"error": str(e), "raw_result": str(output.result)},
                "events": [{"timestamp": event.timestamp.isoformat(), "data": event.data} for event in output.events]
            })

def setup_qa_chain(session_id):
    print(f"Setting up QA chain for session: {session_id}")
    try:
        message_history = MongoDBChatMessageHistory(
            connection_string=os.getenv('MONGODB_URI'),
            session_id=session_id,
            database_name="pdf_database",
            collection_name="chat_history"
        )
        print("MongoDB chat history initialized")
        
        memory = ConversationBufferMemory(
            memory_key="chat_history",
            chat_memory=message_history,
            return_messages=True,
            output_key="answer"
        )
        print("Conversation memory initialized")

        # Set up the base retriever
        base_retriever = vector_store.as_retriever()
        print("Base retriever initialized")

        # Set up the prompt for query generation
        query_prompt = PromptTemplate(
            input_variables=["question"],
            template="Generate three different ways to rephrase the following question:\n{question}\n\nRephrased questions:"
        )

        # Set up the LLM chain for query generation
        llm_chain = LLMChain(
            llm=llm,
            prompt=query_prompt,
            output_parser=CommaSeparatedListOutputParser()
        )

        # Initialize the MultiQueryRetriever
        retriever = MultiQueryRetriever(
            retriever=base_retriever, 
            llm_chain=llm_chain,
            parser_key="text"  # This should match the output key of your LLMChain
        )
        print("MultiQueryRetriever initialized")

        qa_chain = ConversationalRetrievalChain.from_llm(
            llm=llm,
            retriever=retriever,
            memory=memory,
            return_source_documents=True
        )
        print("QA chain created successfully")
        return qa_chain
    except Exception as e:
        print(f"Error setting up QA chain: {str(e)}")
        raise

def kickoff_crew(input_id, technologies, businessareas):
    print(f"Starting crew for input_id: {input_id}")
    print(f"Technologies: {technologies}")
    print(f"Business areas: {businessareas}")
    results = None
    try:
        company_research_crew = TechnologyResearchCrew(input_id)
        company_research_crew.setup_crew(technologies, businessareas)
        print("Crew setup complete, starting kickoff...")
        results = company_research_crew.kickoff()
        print(f"Crew kickoff complete. Results: {results}")
        if hasattr(results, 'dict'):
            results = results.dict()
        elif not isinstance(results, (dict, list, str, int, float, bool, type(None))):
            results = str(results)
    except Exception as e:
        print(f"CREW FAILED for input_id {input_id}: {str(e)}")
        append_event(input_id, f"CREW FAILED: {str(e)}")
        with outputs_lock:
            outputs[input_id].status = 'ERROR'
            outputs[input_id].result = str(e)
    else:
        with outputs_lock:
            outputs[input_id].status = 'COMPLETE'
            outputs[input_id].result = results
            outputs[input_id].events.append(Event(timestamp=datetime.now(), data="Crew complete"))
    print(f"Crew process finished for input_id: {input_id}")

if __name__ == '__main__':
    print("Starting Flask application...")
    app.run(debug=True, port=3001)