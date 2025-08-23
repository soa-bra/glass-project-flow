import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollaborationStore } from '../../../store/collaboration.store';

export const CollaborationChat: React.FC = () => {
  const { 
    chatMessages, 
    connectedUsers, 
    currentUserId, 
    sendMessage 
  } = useCollaborationStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    if (!isOpen && chatMessages.length > 0) {
      const lastMessage = chatMessages[chatMessages.length - 1];
      if (lastMessage.senderId !== currentUserId) {
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [chatMessages, isOpen, currentUserId]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    sendMessage(inputValue.trim());
    setInputValue('');
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserName = (userId: string) => {
    const user = connectedUsers.get(userId) as any;
    return user?.displayName || 'مستخدم مجهول';
  };

  const getUserAvatar = (userId: string) => {
    const user = connectedUsers.get(userId) as any;
    return user?.avatar;
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-20 left-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-40 ${
          isOpen 
            ? 'bg-accent-blue text-white' 
            : 'bg-white/90 backdrop-blur-sm text-black border border-black/10'
        }`}
        title="محادثة المتعاونين"
      >
        <span className="text-xl">💬</span>
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent-red text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -300, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-4 left-4 w-80 h-96 bg-white/90 backdrop-blur-lg rounded-2xl border border-black/10 shadow-xl z-30 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-black/10">
              <h3 className="text-sm font-bold text-black">محادثة المتعاونين</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-black/60">
                  {connectedUsers.size} متصلين
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {chatMessages.length === 0 ? (
                <div className="text-center text-black/60 mt-8">
                  <div className="text-2xl mb-2">💬</div>
                  <p className="text-xs">ابدأ محادثة مع المتعاونين</p>
                </div>
              ) : (
                chatMessages.map((message) => {
                  const isOwn = message.senderId === currentUserId;
                  const avatar = getUserAvatar(message.senderId);
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      {!isOwn && (
                        <div className="flex-shrink-0">
                          {avatar ? (
                            <img
                              src={avatar}
                              alt={message.senderName}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-gradient-to-br from-accent-blue to-accent-green rounded-full flex items-center justify-center text-white text-xs">
                              {message.senderName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Message bubble */}
                      <div className={`flex-1 max-w-[80%] ${isOwn ? 'text-right' : 'text-left'}`}>
                        {!isOwn && (
                          <div className="text-xs font-medium text-black/60 mb-1">
                            {message.senderName}
                          </div>
                        )}
                        
                        <div
                          className={`inline-block p-2 rounded-2xl text-sm ${
                            isOwn
                              ? 'bg-accent-blue text-white'
                              : 'bg-gray-100 text-black'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-black/60'}`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-black/10">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="اكتب رسالة..."
                  className="flex-1 px-3 py-2 text-sm bg-transparent border border-black/10 rounded-xl focus:outline-none focus:border-accent-blue"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="px-3 py-2 bg-accent-blue text-white text-sm rounded-xl hover:bg-accent-blue/80 transition-colors disabled:opacity-50"
                >
                  📤
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};