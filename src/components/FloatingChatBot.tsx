import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, X, Send, Trash2 } from 'lucide-react';
import Draggable from 'react-draggable';
import { useChatCompletion } from '../hooks/useChatCompletion';
import { sanitizeText, scrapeDomForContext } from '../utils/domScraper';

interface FloatingChatBotProps {
  agentId: string;
  agentAlias: string;
  apiEndpoint: string;
  apiKey?: string;
  position?: 'bottom-right' | 'bottom-left';
  theme?: {
    primary: string;
    background: string;
    text: string;
  };
}

const defaultTheme = {
  primary: 'bg-blue-600',
  background: 'bg-white',
  text: 'text-gray-900'
};

const CONFIG = {
  MAX_MESSAGES: 50,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  MAX_CONTEXT_LENGTH: 5000
};

const FloatingChatBot: React.FC<FloatingChatBotProps> = ({
  agentId,
  agentAlias,
  apiEndpoint,
  apiKey,
  position = 'bottom-right',
  theme = defaultTheme
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const dragNodeRef = useRef<HTMLDivElement>(null);
  const [isFloating, setIsFloating] = useState(true);
  
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    clearMessages,
    conversationId,
    addSystemMessage
  } = useChatCompletion({
    agentId,
    agentAlias,
    apiEndpoint,
    apiKey
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFloating(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeout);
  }, [messages, scrollToBottom]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    // Sanitize user input
    const { text: sanitizedMessage, sanitized: isMessageSanitized } = sanitizeText(userMessage);

    if (isMessageSanitized) {
      console.log('PII detected in user message. Message sanitized.');
      addSystemMessage('Please note: Your message contained sensitive information that was removed for your security.');
      return;
    }

    try {
      // Get page context
      const domContent = scrapeDomForContext();
      if (domContent.error) {
        console.error('Error scraping DOM:', domContent.error);
        return;
      }

      // Send message with context
      await sendMessage(sanitizedMessage, domContent.content);
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear this conversation?')) {
      clearMessages();
    }
  };

  // Minimized chat button
  if (!isOpen) {
    return (
      <div className={`fixed bottom-4 ${position === 'bottom-right' ? 'right-4' : 'left-4'} z-[1000]`}>
        <button
          onClick={() => setIsOpen(true)}
          className={`${theme.primary} rounded-full p-4 text-white shadow-lg hover:opacity-90 transition-opacity`}
          aria-label="Open chat"
        >
          <MessageSquare />
        </button>
      </div>
    );
  }

  // Open chat window
  return (
    <div className="fixed bottom-0 right-0 z-[1000] w-screen h-screen pointer-events-none">
      <Draggable 
        handle=".drag-handle" 
        bounds="parent"
        nodeRef={dragNodeRef}
      >
        <div 
          ref={dragNodeRef}
          className="absolute bottom-4 right-4 pointer-events-auto"
        >
          <div 
            ref={chatContainerRef}
            className={`${theme.background} w-96 h-[500px] rounded-lg shadow-xl flex flex-col`}
          >
            <div 
              className={`${theme.primary} p-4 rounded-t-lg flex justify-between items-center cursor-move drag-handle`}
            >
              <h3 className="text-white font-medium select-none">Chat Assistant</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleClearChat}
                  className="text-white hover:opacity-90 transition-opacity p-1"
                  aria-label="Clear chat"
                >
                  <Trash2 size={18} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:opacity-90 transition-opacity p-1"
                  aria-label="Close chat"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-none px-4 py-2 text-xs text-gray-500">
              Conversation ID: {conversationId}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`${
                    message.role === 'user' 
                      ? 'ml-auto bg-blue-100' 
                      : 'mr-auto bg-gray-100'
                  } p-3 rounded-lg max-w-[80%] ${theme.text}`}
                >
                  {message.content}
                </div>
              ))}
              {isLoading && (
                <div className="mr-auto bg-gray-100 p-3 rounded-lg animate-pulse">
                  Thinking...
                </div>
              )}
            </div>

            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className={`${theme.primary} p-2 rounded-lg text-white hover:opacity-90 transition-opacity disabled:opacity-50`}
                  aria-label="Send message"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default FloatingChatBot;