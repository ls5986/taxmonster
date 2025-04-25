'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ChatWindow from './components/ChatWindow';
import ChatIcon from './components/ChatIcon';
import { Message } from './types/chat';

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
    <main className="min-h-screen bg-white">
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-[#E6FFF4] to-white">
        <div className="text-center px-6 max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-teal-600 mb-6"
          >
            Got Tax Problems?
            <br />
            Let the Tax Monster Help.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-8"
          >
            Your friendly AI tax assistant is here to answer questions and guide you through your tax concerns.
          </motion.p>
        </div>
      </section>

      <ChatIcon isOpen={isChatOpen} onClick={() => setIsChatOpen(true)} />
      
      <ChatWindow
        isOpen={isChatOpen}
        onClose={handleClose}
        messages={messages}
        input={input}
        isLoading={isLoading}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onQuickQuestionClick={handleQuickQuestion}
      />
    </main>
  );
} 