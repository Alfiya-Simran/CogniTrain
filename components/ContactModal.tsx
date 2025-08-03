import React, { useState, useEffect, useRef } from 'react';
import { User, Message } from '../types';
import { XIcon, PhoneIcon, VideoCameraIcon, UserCircleIcon } from './icons';

interface ContactModalProps {
  isOpen: boolean;
  currentUser: User;
  contactUser: User | null;
  onClose: () => void;
  history: Message[];
  onSendMessage: (text: string) => void;
  isAiTyping: boolean;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, currentUser, contactUser, onClose, history, onSendMessage, isAiTyping }) => {
  const [message, setMessage] = useState('');
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever history changes or AI starts typing
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [history, isAiTyping]);

  if (!isOpen || !contactUser) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center z-50 animate-fade-in-fast sm:p-4">
      <div 
        className="bg-white rounded-none sm:rounded-2xl shadow-2xl w-full h-full sm:max-w-lg sm:h-auto sm:max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
             <UserCircleIcon className="h-10 w-10 text-slate-500"/>
             <div>
                <h2 className="text-xl font-bold text-slate-800">{contactUser.name}</h2>
                <p className="text-sm text-green-500">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button className="p-2 rounded-full text-slate-400 hover:bg-slate-100 transition-colors" title="Voice Call (Coming Soon)" disabled>
              <PhoneIcon className="h-6 w-6" />
            </button>
             <button className="p-2 rounded-full text-slate-400 hover:bg-slate-100 transition-colors" title="Video Call (Coming Soon)" disabled>
              <VideoCameraIcon className="h-6 w-6" />
            </button>
            <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors" title="Close">
              <XIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Chat Body */}
        <div ref={chatBodyRef} className="flex-grow p-4 sm:p-6 space-y-4 bg-slate-50 overflow-y-auto">
            <div className="flex justify-center">
                <span className="bg-slate-200 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full">
                    This is the beginning of your conversation
                </span>
            </div>
            {history.map((msg, index) => (
                <div key={index} className={`flex items-end ${msg.senderId === currentUser.id ? 'justify-end' : ''}`}>
                    <div className={`p-3 rounded-lg max-w-[80%] sm:max-w-[70%] ${
                        msg.senderId === currentUser.id 
                        ? 'bg-blue-500 text-white rounded-br-none' 
                        : 'bg-slate-200 text-slate-800 rounded-bl-none'
                    }`}>
                        <p className="text-sm">{msg.text}</p>
                    </div>
                </div>
            ))}
            {isAiTyping && (
                 <div className="flex items-end">
                    <div className="bg-slate-200 p-3 rounded-lg rounded-bl-none">
                        <div className="flex items-center space-x-1">
                           <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce-1"></span>
                           <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce-2"></span>
                           <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce-3"></span>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Footer Input */}
        <div className="flex-shrink-0 p-4 bg-white border-t border-slate-200">
          <form onSubmit={handleSubmit} className="relative">
            <input 
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-100 border-slate-200 rounded-full py-3 pl-5 pr-20 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <button 
                type="submit"
                disabled={!message.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 text-white font-semibold rounded-full px-4 py-2 text-sm transition-colors hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
                Send
            </button>
          </form>
        </div>
      </div>
      <style>{`
          .animate-fade-in-fast { animation: fadeIn 0.2s ease-in-out; }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          .animate-bounce-1 { animation: bounce 1s infinite; animation-delay: 0s; }
          .animate-bounce-2 { animation: bounce 1s infinite; animation-delay: 0.2s; }
          .animate-bounce-3 { animation: bounce 1s infinite; animation-delay: 0.4s; }
          @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-4px); }
          }
      `}</style>
    </div>
  );
};

export default ContactModal;
