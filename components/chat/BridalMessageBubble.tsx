"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { BridalChatMessage } from "./types";

function formatTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function BridalMessageBubble({ message }: { message: BridalChatMessage }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[82%] rounded-[22px] px-4 py-3 text-[13px] leading-6 shadow-sm sm:max-w-[78%]",
          isUser
            ? "rounded-br-[8px] bg-[#1f1a17] text-white shadow-[#1f1a17]/10"
            : "rounded-bl-[8px] bg-white text-[#3d332c] ring-1 ring-[#eadfd5]"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p
          className={cn(
            "mt-1.5 text-[10px]",
            isUser ? "text-white/55" : "text-[#9b8b80]"
          )}
        >
          {formatTime(message.createdAt)}
        </p>
      </div>
    </motion.div>
  );
}

