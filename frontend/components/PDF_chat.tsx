import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PDFChat: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [sources, setSources] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'bot', content: string}>>([]);

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
      setAnswer(response.data.answer);
      setSources(response.data.sources);
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
            <div className={`max-w-3/4 p-3 rounded-lg ${msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
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
          className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
        />
        <button
          onClick={handleAskQuestion}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r-lg transition duration-300 ease-in-out"
        >
          Ask
        </button>
      </div>
    </div>
  );
};

export default PDFChat;