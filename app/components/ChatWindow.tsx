import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import lottie from 'lottie-web';
import { Message } from '../types/chat';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  input: string;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onQuickQuestionClick: (question: string) => void;
}

const QUICK_QUESTIONS = [
  "I owe back taxes",
  "How do I talk to the IRS?",
  "Can I settle my tax debt?"
];

const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  onClose,
  messages,
  input,
  isLoading,
  onInputChange,
  onSubmit,
  onQuickQuestionClick,
}) => {
  const animationContainer = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animationContainer.current) return;

    const anim = lottie.loadAnimation({
      container: animationContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/tax-monster-moving.json'
    });

    return () => anim.destroy();
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 right-4 w-[400px] h-[600px] bg-white rounded-lg shadow-xl 
                 flex flex-col overflow-hidden z-40"
    >
      {/* Header */}
      <div className="bg-teal-600 p-4 flex items-center justify-between text-white">
        <h3 className="font-semibold">Tax Monster</h3>
        <button 
          onClick={onClose}
          className="hover:opacity-75 transition-opacity"
        >
          ✕
        </button>
      </div>

      {/* Monster Animation */}
      <div className="h-[200px] bg-[#E6FFF4] relative">
        <div ref={animationContainer} className="absolute inset-0" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="space-y-2">
            {QUICK_QUESTIONS.map((question) => (
              <button
                key={question}
                onClick={() => onQuickQuestionClick(question)}
                className="w-full p-3 text-left text-teal-600 bg-white border-2 
                         border-teal-600 rounded-lg hover:bg-teal-50 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={onSubmit} className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={onInputChange}
            placeholder="Ask me about taxes..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ChatWindow; 