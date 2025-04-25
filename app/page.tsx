'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ChatWindow from './components/ChatWindow';
import ChatIcon from './components/ChatIcon';
import { Message } from './types/chat';
import Image from 'next/image';

const QUICK_QUESTIONS = [
  "I owe back taxes",
  "How do I talk to the IRS?",
  "Can I settle my tax debt?"
];

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Auto-popup after 3 seconds if no interaction
    const timer = setTimeout(() => {
      if (!hasInteracted) {
        setIsChatOpen(true);
        // Just set the welcome message, don't send to API
        setMessages([{
          role: 'assistant',
          content: "Hey there! I'm Tax Monster. Ready to tackle your IRS problems?"
        }]);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [hasInteracted]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setHasInteracted(true);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    handleSubmit(new Event('submit') as any);
    setHasInteracted(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setHasInteracted(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', content: data.message };
      setMessages(prev => [...prev, assistantMessage]);

      if (data.audio) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
        await audio.play();
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsChatOpen(false);
    setHasInteracted(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-teal-600 mb-4">Got Tax Problems?</h1>
          <h2 className="text-3xl font-bold text-teal-500 mb-4">Let the Tax Monster Help.</h2>
          <p className="text-gray-600 text-lg">
            Your friendly AI tax assistant is here to answer questions and guide you through your tax concerns.
          </p>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="h-[400px] overflow-y-auto mb-4 p-4 bg-gray-50 rounded">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  msg.role === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
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
              <div className="text-center text-gray-500">
                Tax Monster is thinking...
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me about taxes..."
              className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 