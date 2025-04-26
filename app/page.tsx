'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { FC } from 'react';
import type { Props as LottieProps } from 'react-lottie-player';

// Import Lottie dynamically to avoid SSR issues
const Lottie = dynamic(() => import('react-lottie-player'), {
  ssr: false,
  loading: () => <div className="w-32 h-32 bg-teal-500 rounded-full animate-pulse" />
}) as any; // Type assertion needed due to Next.js dynamic import limitations

export default function Home() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [animation, setAnimation] = useState(null);

  // Load the animation JSON
  useEffect(() => {
    fetch('/tax monster moving.json')
      .then(response => response.json())
      .then(data => setAnimation(data))
      .catch(error => console.error('Error loading animation:', error));
  }, []);

  // Auto welcome message after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChatOpen(true);
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

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

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

  return (
    <>
      <nav className="bg-teal-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="/" className="text-2xl font-bold">Tax Monster</a>
          <div className="flex gap-6">
            <a href="/dashboard" className="hover:text-teal-200">Dashboard</a>
            <a href="/documents" className="hover:text-teal-200">Documents</a>
            <a href="/calendar" className="hover:text-teal-200">Calendar</a>
            <a href="/calculator" className="hover:text-teal-200">Calculator</a>
          </div>
        </div>
      </nav>

      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white relative">
        <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-teal-600 mb-4">Got Tax Problems?</h1>
            <h2 className="text-4xl font-bold text-teal-500 mb-4">Let the Tax Monster Help.</h2>
            <p className="text-xl text-gray-600">
              Your friendly AI tax assistant is here to answer questions and guide you through your tax concerns.
            </p>
          </div>

          {/* Chat Interface */}
          {isChatOpen && (
            <div className="fixed bottom-8 right-8 w-96 bg-white rounded-xl shadow-2xl p-6 z-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-teal-600">Chat with Tax Monster</h3>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Tax Monster Character at top of chat */}
              <div className="w-32 h-32 mx-auto mb-4">
                {animation && (
                  <Lottie
                    animationData={animation}
                    play
                    loop
                    style={{ width: '100%', height: '100%' }}
                  />
                )}
              </div>

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
          )}

          {/* Click area to open chat */}
          {!isChatOpen && (
            <div 
              className="fixed bottom-8 right-8 w-32 h-32 cursor-pointer"
              onClick={() => setIsChatOpen(true)}
            >
              {animation && (
                <Lottie
                  animationData={animation}
                  play
                  loop
                  style={{ width: '100%', height: '100%' }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
} 