export type ChatRole = "assistant" | "user";

export interface BridalChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface ChatRequestMessage {
  role: ChatRole;
  content: string;
}

