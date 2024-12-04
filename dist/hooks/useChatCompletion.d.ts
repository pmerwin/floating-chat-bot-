/// <reference types="react" />
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
export declare const useChatCompletion: ({ agentId, agentAlias, apiEndpoint, apiKey }: ChatCompletionOptions) => {
    messages: Message[];
    setMessages: import("react").Dispatch<import("react").SetStateAction<Message[]>>;
    isLoading: boolean;
    sendMessage: (userMessage: string, context?: string) => Promise<{
        role: "assistant";
        content: any;
    }>;
    clearMessages: () => void;
    conversationId: string;
    addSystemMessage: (content: string) => void;
};
export {};
