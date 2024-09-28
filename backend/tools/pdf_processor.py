import os
import PyPDF2
from langchain_community.vectorstores import MongoDBAtlasVectorSearch

def extract_text_from_pdf(file_path):
    with open(file_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    return text

def store_pdf_text(text, filename, vector_store):
    vector_store.add_texts([text], metadatas=[{"source": filename}])

def process_local_pdfs(directory, vector_store):
    processed_files = []
    for filename in os.listdir(directory):
        if filename.endswith('.pdf'):
            file_path = os.path.join(directory, filename)
            text = extract_text_from_pdf(file_path)
            store_pdf_text(text, filename, vector_store)
            processed_files.append(filename)
    return processed_files