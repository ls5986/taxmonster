import React from 'react';
import { motion } from 'framer-motion';

interface ChatIconProps {
  onClick: () => void;
  isOpen: boolean;
}

const ChatIcon: React.FC<ChatIconProps> = ({ onClick, isOpen }) => {
  if (isOpen) return null;

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      onClick={onClick}
      className="fixed bottom-4 right-4 w-16 h-16 bg-teal-600 rounded-full shadow-lg 
                 flex items-center justify-center hover:bg-teal-700 transition-colors z-50"
    >
      <div className="relative w-10 h-10">
        {/* Tax Monster Icon - Simplified Face */}
        <div className="absolute inset-0 bg-white rounded-full scale-[0.85]" />
        <div 
          className="absolute inset-0 bg-[#00FF9D] rounded-full scale-[0.6]"
          style={{
            clipPath: "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)"
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-white rounded-full" />
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export default ChatIcon; 