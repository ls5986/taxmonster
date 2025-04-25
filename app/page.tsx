'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Auto welcome message after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChat(true);
      setChatHistory([{
        role: 'assistant',
        content: "Hi! I'm Tax Monster. How can I help with your tax questions today?"
      }]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    const userMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...chatHistory, userMessage] })
      });

      const data = await response.json();
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error:', error);
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting. Please try again or reach out to a live representative."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick questions
  const quickQuestions = [
    "I owe back taxes",
    "How do I set up a payment plan?",
    "What tax forms do I need?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white relative">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-teal-600 mb-4">Got Tax Problems?</h1>
          <h2 className="text-4xl font-bold text-teal-500 mb-4">Let the Tax Monster Help.</h2>
          <p className="text-xl text-gray-600">
            Your friendly AI tax assistant is here to answer questions and guide you through your tax concerns.
          </p>
        </div>

        {/* Tax Monster Character */}
        <div className="absolute right-4 top-4 w-32 h-32">
          <img
            src="/taxmonster/images/tax-monster.svg"
            alt="Tax Monster Character"
            className="w-full h-full animate-bounce"
          />
        </div>

        {/* Chat Interface */}
        <div className={`transform transition-all duration-500 ${showChat ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
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
    </div>
  );
} 