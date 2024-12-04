import { useState, useCallback } from 'react';
import axios from 'axios';

interface ChatCompletionOptions {
  agentId: string;
  agentAlias: string;
  apiEndpoint: string;
  apiKey?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const sendWithRetry = async (
  fn: () => Promise<any>,
  retries: number = 3,
  delay: number = 1000
): Promise<any> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return sendWithRetry(fn, retries - 1, delay * 1.5);
    }
    throw error;
  }
};

export const useChatCompletion = ({
  agentId,
  agentAlias,
  apiEndpoint,
  apiKey
}: ChatCompletionOptions) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>(() => {
    return sessionStorage.getItem('conversationId') || 
      `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  });

  // Initialize conversation ID
  useState(() => {
    sessionStorage.setItem('conversationId', conversationId);
  });

  const sendMessage = useCallback(async (userMessage: string, context: string = '') => {
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (apiKey) {
        headers['x-api-key'] = apiKey;
      }

      const response = await sendWithRetry(async () => {
        return axios.post(
          apiEndpoint,
          {
            agentId,
            agentAlias,
            message: userMessage,
            context: context,
            conversationId
          },
          { headers }
        );
      });

      const assistantMessage = { 
        role: 'assistant' as const, 
        content: response.data.completion || 'No response received'
      };
      
      setMessages(prev => {
        const combined = [...prev, assistantMessage];
        return combined.slice(-50); // Keep last 50 messages
      });
      return assistantMessage;
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        role: 'assistant' as const, 
        content: 'Sorry, I encountered an error. Please try again.' 
      };
      setMessages(prev => [...prev, errorMessage]);
      return errorMessage;
    } finally {
      setIsLoading(false);
    }
  }, [agentId, agentAlias, apiEndpoint, apiKey, conversationId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    // Generate new conversation ID when clearing
    const newId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('conversationId', newId);
    setConversationId(newId);
  }, []);

  const addSystemMessage = useCallback((content: string) => {
    setMessages(prev => [...prev, { role: 'assistant', content }]);
  }, []);

  return {
    messages,
    setMessages,
    isLoading,
    sendMessage,
    clearMessages,
    conversationId,
    addSystemMessage
  };
};