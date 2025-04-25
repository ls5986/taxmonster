'use client';

import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    const newMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, newMessage]);
    setMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...chatHistory, newMessage] })
      });

      const data = await response.json();
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white p-4">
      <div className="max-w-4xl mx-auto pt-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-teal-600 mb-4">Got Tax Problems?</h1>
          <h2 className="text-4xl font-bold text-teal-500 mb-6">Let the Tax Monster Help.</h2>
          <p className="text-xl text-gray-600">
            Your friendly AI tax assistant is here to answer questions and guide you through your tax concerns.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-6">
          <div className="h-[400px] overflow-y-auto mb-6 p-4 bg-gray-50 rounded-lg">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  msg.role === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block p-4 rounded-lg max-w-[80%] ${
                    msg.role === 'user'
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-center text-gray-500 animate-pulse">
                Tax Monster is thinking...
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me about taxes..."
              className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 text-lg"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 disabled:opacity-50 text-lg font-semibold transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 