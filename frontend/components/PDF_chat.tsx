import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface PDFChatProps {
  darkMode: boolean;
}

const PDFChat: React.FC<PDFChatProps> = ({ darkMode }) => {
  const [question, setQuestion] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'bot', content: string}>>([]);
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    setSessionId(`session_${Date.now()}`);
  }, []);

  const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setChatHistory(prev => [...prev, {type: 'user', content: question}]);
    setQuestion('');

    try {
      const response = await axios.post('http://localhost:3001/api/chat_pdf', {
        question,
        session_id: sessionId,
      });
      setChatHistory(prev => [...prev, {type: 'bot', content: response.data.answer}]);
    } catch (error) {
      console.error('Error asking question:', error);
      setChatHistory(prev => [...prev, {type: 'bot', content: 'Sorry, I encountered an error.'}]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto mb-4 space-y-4">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3/4 p-3 rounded-lg ${
              msg.type === 'user' 
                ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`
                : `${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={question}
          onChange={handleQuestionChange}
          placeholder="Ask a question about the PDFs"
          className={`flex-grow p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-800'} rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
          onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
        />
        <button
          onClick={handleAskQuestion}
          className={`${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold py-2 px-4 rounded-r-lg transition duration-300 ease-in-out`}
        >
          Ask
        </button>
      </div>
    </div>
  );
};

export default PDFChat;