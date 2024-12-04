import React from 'react';
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
declare const FloatingChatBot: React.FC<FloatingChatBotProps>;
export default FloatingChatBot;
