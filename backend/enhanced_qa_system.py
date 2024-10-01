# enhanced_qa_system.py

from typing import List, Dict, Any
from langchain.schema import Document
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain.prompts import PromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from tools.pdf_processor import extract_text_from_pdf
from crewai import Agent, Task, Crew
from crewai_tools import SerperDevTool, WebsiteSearchTool
import os

class EnhancedQASystem:
    def __init__(self, vector_store, llm, local_pdf_directory):
        self.vector_store = vector_store
        self.llm = llm
        self.local_pdf_directory = local_pdf_directory
        self.search_tool = SerperDevTool()
        self.web_rag_tool = WebsiteSearchTool()

    def combined_retriever(self, query):
        vector_results = self.vector_store.similarity_search(query, k=5)
        local_results = []
        for filename in os.listdir(self.local_pdf_directory):
            if filename.endswith('.pdf'):
                file_path = os.path.join(self.local_pdf_directory, filename)
                text = extract_text_from_pdf(file_path)
                local_results.append(Document(page_content=text, metadata={"source": filename}))
        combined_results = vector_results + local_results
        return combined_results

    def web_search(self, query: str) -> List[Dict[str, Any]]:
        researcher = Agent(
            role='Web Researcher',
            goal='Find relevant information on the web',
            backstory='An expert at finding and summarizing web content.',
            tools=[self.search_tool, self.web_rag_tool],
            verbose=True
        )

        research_task = Task(
            description=f'Research the following query and provide a summary: {query}',
            agent=researcher
        )

        crew = Crew(
            agents=[researcher],
            tasks=[research_task],
            verbose=True
        )

        result = crew.kickoff()
        return [Document(page_content=result, metadata={"source": "Web Search"})]

    def evaluate_relevance(self, query: str, document: Document) -> float:
        try:
            prompt = PromptTemplate(
                input_variables=["query", "document"],
                template="On a scale of 0 to 1, how relevant is the following document to the query? Provide only the numeric score.\nQuery: {query}\nDocument: {document}\nRelevance score:"
            )
            chain = prompt | self.llm | (lambda x: float(str(x).strip()))
            return chain.invoke({"query": query, "document": document.page_content[:500]})  # Limit input length
        except Exception as e:
            print(f"Error evaluating relevance: {e}")
            return 0.0

    def refine_knowledge(self, documents: List[Document]) -> str:
        try:
            combined_content = "\n".join([doc.page_content[:500] for doc in documents])  # Limit input length
            prompt = PromptTemplate(
                input_variables=["content"],
                template="Summarize the key points from the following content:\n{content}\nKey points:"
            )
            chain = prompt | self.llm
            return str(chain.invoke({"content": combined_content}))
        except Exception as e:
            print(f"Error refining knowledge: {e}")
            return "Unable to refine knowledge due to an error."

    def answer_question(self, question: str) -> Dict[str, Any]:
        try:
            local_docs = self.combined_retriever(question)
            
            relevance_scores = [self.evaluate_relevance(question, doc) for doc in local_docs]
            max_relevance = max(relevance_scores) if relevance_scores else 0

            if max_relevance > 0.7:
                knowledge = local_docs[relevance_scores.index(max_relevance)].page_content
                sources = [local_docs[relevance_scores.index(max_relevance)].metadata.get("source", "Local PDF")]
            elif max_relevance < 0.3:
                web_results = self.web_search(question)
                knowledge = self.refine_knowledge(web_results)
                sources = [doc.metadata.get("source", "Web Search") for doc in web_results]
            else:
                web_results = self.web_search(question)
                all_results = local_docs + web_results
                knowledge = self.refine_knowledge(all_results)
                sources = [doc.metadata.get("source", "Unknown") for doc in all_results]
            
            response = str(self.llm.invoke(question + "\n\nContext: " + knowledge))
            
            return {
                "answer": response,
                "sources": sources
            }
        except Exception as e:
            print(f"Error answering question: {e}")
            return {
                "answer": "I'm sorry, but I encountered an error while trying to answer your question. Please try again later.",
                "sources": []
            }