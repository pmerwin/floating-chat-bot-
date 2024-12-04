export interface ChatRequest {
  agentId: string;
  agentAlias: string;
  message: string;
  context: string;
  conversationId: string;
}

export interface ChatResponse {
  completion: string;
}