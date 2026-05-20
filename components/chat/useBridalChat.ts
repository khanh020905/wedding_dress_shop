"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BRIDAL_GREETING } from "./quickActions";
import type { BridalChatMessage, ChatRequestMessage } from "./types";

const STORAGE_KEY = "dreamdress:bridal-support-chat";

function createMessage(role: BridalChatMessage["role"], content: string): BridalChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

function createInitialMessages() {
  return [createMessage("assistant", BRIDAL_GREETING)];
}

function normalizeStoredMessages(value: unknown): BridalChatMessage[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const messages = value.filter((message): message is BridalChatMessage => {
    return (
      typeof message === "object" &&
      message !== null &&
      "id" in message &&
      "role" in message &&
      "content" in message &&
      "createdAt" in message &&
      typeof message.id === "string" &&
      (message.role === "assistant" || message.role === "user") &&
      typeof message.content === "string" &&
      typeof message.createdAt === "string"
    );
  });

  return messages.length > 0 ? messages : null;
}

export function useBridalChat() {
  const [messages, setMessages] = useState<BridalChatMessage[]>(() => {
    if (typeof window === "undefined") {
      return createInitialMessages();
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return createInitialMessages();
      }

      return normalizeStoredMessages(JSON.parse(raw)) ?? createInitialMessages();
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      return createInitialMessages();
    }
  });
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const requestMessages = useMemo<ChatRequestMessage[]>(() => {
    return messages
      .filter((message) => message.content.trim())
      .slice(-12)
      .map(({ role, content }) => ({ role, content }));
  }, [messages]);

  const clearChat = useCallback(() => {
    setError(null);
    setMessages(createInitialMessages());
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isStreaming) {
        return;
      }

      const userMessage = createMessage("user", trimmed);
      const assistantMessage = createMessage("assistant", "");
      const outgoingMessages = [...requestMessages, { role: "user" as const, content: trimmed }];

      setError(null);
      setIsStreaming(true);
      setMessages((current) => [...current, userMessage, assistantMessage]);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: outgoingMessages }),
        });

        if (!response.ok || !response.body) {
          let message = "Hiện em chưa kết nối được hệ thống tư vấn. Chị thử lại giúp em sau ít phút nhé.";

          try {
            const data = (await response.json()) as { error?: string };
            if (data.error) {
              message = data.error;
            }
          } catch {
            // Keep the default support-style message.
          }

          throw new Error(message);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantMessage.id
                ? { ...message, content: message.content + chunk }
                : message
            )
          );
        }
      } catch (caught) {
        const message =
          caught instanceof Error
            ? caught.message
            : "Có lỗi nhỏ khi gửi tin nhắn. Chị thử lại giúp em nhé.";

        setError(message);
        setMessages((current) =>
          current.map((item) =>
            item.id === assistantMessage.id
              ? {
                  ...item,
                  content:
                    "Em xin lỗi chị, hiện kết nối tư vấn đang bị gián đoạn. Chị có thể để lại nhu cầu về dáng váy, ngân sách và ngày cưới, em sẽ hỗ trợ lại ngay khi kết nối ổn định ạ.",
                }
              : item
          )
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [isStreaming, requestMessages]
  );

  return {
    messages,
    isStreaming,
    error,
    sendMessage,
    clearChat,
  };
}
