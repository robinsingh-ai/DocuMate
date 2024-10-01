"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Paperclip, X, File, AlertCircle, Check, Loader } from 'lucide-react';

interface PDFChatProps {
  darkMode: boolean;
}

interface ChatMessage {
  type: 'user' | 'bot' | 'error';
  content: string;
}

interface AttachedFile {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
}

const PDFChat: React.FC<PDFChatProps> = ({ darkMode }) => {
  const [question, setQuestion] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSessionId(`session_${Date.now()}`);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    const newMessage: ChatMessage = {
      type: 'user',
      content: question,
    };

    setChatHistory(prev => [...prev, newMessage]);
    setQuestion('');

    try {
      const response = await axios.post('http://localhost:3001/api/chat_pdf', {
        question,
        session_id: sessionId,
      });
      setChatHistory(prev => [...prev, { type: 'bot', content: response.data.answer }]);
    } catch (error) {
      console.error('Error asking question:', error);
      setChatHistory(prev => [...prev, { type: 'error', content: 'Sorry, I encountered an error while processing your question.' }]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files).map(file => ({ file, status: 'pending' as const }));
      setAttachedFiles(prevFiles => [...prevFiles, ...newFiles]);
      newFiles.forEach(uploadFile);
    }
  };

  const uploadFile = async (attachedFile: AttachedFile) => {
    const formData = new FormData();
    formData.append('file', attachedFile.file);

    setAttachedFiles(prev => prev.map(f => f.file === attachedFile.file ? { ...f, status: 'uploading' } : f));

    try {
      const response = await axios.post('http://localhost:3001/api/upload_pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAttachedFiles(prev => prev.map(f => f.file === attachedFile.file ? { ...f, status: 'success' } : f));
    } catch (error) {
      console.error('Error uploading file:', error);
      setAttachedFiles(prev => prev.map(f => f.file === attachedFile.file ? { ...f, status: 'error' } : f));
    }
  };

  const removeFile = (fileToRemove: File) => {
    setAttachedFiles(prevFiles => prevFiles.filter(f => f.file !== fileToRemove));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto mb-4 space-y-4 p-4">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-3 rounded-lg ${
              msg.type === 'user' 
                ? `bg-blue-500 text-white`
                : msg.type === 'error'
                ? `bg-red-500 text-white`
                : `${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`
            }`}>
              {msg.type === 'error' && <AlertCircle className="inline-block mr-2" size={16} />}
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="flex flex-col p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        {attachedFiles.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachedFiles.map((attachedFile, index) => (
              <div key={index} className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                <File size={14} className="mr-1" />
                {attachedFile.file.name}
                {attachedFile.status === 'uploading' && <Loader size={14} className="ml-1 animate-spin" />}
                {attachedFile.status === 'success' && <Check size={14} className="ml-1 text-green-500" />}
                {attachedFile.status === 'error' && <AlertCircle size={14} className="ml-1 text-red-500" />}
                <button onClick={() => removeFile(attachedFile.file)} className="ml-1 text-blue-600 hover:text-blue-800">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center">
          <input
            type="text"
            value={question}
            onChange={handleQuestionChange}
            placeholder="Ask a question about the PDFs"
            className="flex-grow p-2 mr-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            multiple
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 mr-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <Paperclip size={20} />
          </button>
          <button
            onClick={handleAskQuestion}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFChat;