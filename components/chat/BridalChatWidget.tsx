"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarHeart,
  ChevronDown,
  MessageCircleHeart,
  PhoneCall,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BridalChatInput } from "./BridalChatInput";
import { BridalMessageBubble } from "./BridalMessageBubble";
import { QUICK_ACTIONS } from "./quickActions";
import { TypingIndicator } from "./TypingIndicator";
import { useBridalChat } from "./useBridalChat";

export default function BridalChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { messages, isStreaming, error, sendMessage, clearChat } = useBridalChat();

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [isOpen, messages, isStreaming]);

  function handleQuickAction(message: string) {
    sendMessage(message);
  }

  function openBooking() {
    setIsOpen(false);
    window.history.pushState(null, "", "#booking");
    document.querySelector("#booking")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            key="bridal-chat-panel"
            initial={{ opacity: 0, y: 22, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className={cn(
              "mb-4 flex h-[min(680px,calc(100vh-104px))] w-[min(calc(100vw-32px),410px)] flex-col overflow-hidden rounded-[28px]",
              "bg-[#fbf8f5] shadow-[0_24px_80px_rgba(53,37,30,0.22)] ring-1 ring-[#ead9cf]"
            )}
            aria-label="Bridal Support chat"
          >
            <header className="relative overflow-hidden bg-[linear-gradient(135deg,#fff8f6_0%,#f3d7d2_48%,#d6aa96_100%)] px-4 py-4 text-[#231d19]">
              <div className="absolute inset-x-0 bottom-0 h-px bg-white/70" />
              <div className="flex items-center gap-3">
                <div className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-[linear-gradient(145deg,#fff4f1,#e9bfb4)] text-[24px] shadow-md ring-2 ring-white/80">
                  <span aria-hidden="true">👩🏻‍💼</span>
                  <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-[#67b783]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate font-serif text-[19px] font-semibold text-[#211b18]">
                      Bridal Support
                    </h2>
                    <Sparkles className="size-4 text-[#9f7463]" />
                  </div>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[12px] font-medium text-[#6e5a50]">
                    <span className="size-1.5 rounded-full bg-[#4ca76d]" />
                    Đang hoạt động
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearChat}
                  className="grid size-9 place-items-center rounded-full bg-white/45 text-[#5f4a42] transition hover:bg-white/75"
                  aria-label="Xóa lịch sử chat"
                >
                  <RotateCcw className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="grid size-9 place-items-center rounded-full bg-white/45 text-[#5f4a42] transition hover:bg-white/75"
                  aria-label="Đóng chat"
                >
                  <X className="size-4" />
                </button>
              </div>
            </header>

            <div className="bridal-chat-scrollbar flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-3">
                {messages.map((message) => (
                  <BridalMessageBubble key={message.id} message={message} />
                ))}

                {messages.length === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.14 }}
                    className="grid gap-2 pt-1"
                  >
                    {QUICK_ACTIONS.map((action) => (
                      <button
                        key={action.label}
                        type="button"
                        onClick={() => handleQuickAction(action.message)}
                        className="rounded-full border border-[#e6d4ca] bg-white px-4 py-2.5 text-left text-[12px] font-semibold text-[#5b4a42] shadow-sm transition hover:border-[#d3a196] hover:bg-[#fff8f6] hover:text-[#1f1a17]"
                      >
                        {action.label}
                      </button>
                    ))}
                  </motion.div>
                )}

                {isStreaming && <TypingIndicator />}

                {error && (
                  <div className="rounded-[18px] border border-[#f0c7bf] bg-[#fff6f4] px-4 py-3 text-[12px] leading-5 text-[#8c4d43]">
                    {error}
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-[#eadfd5] bg-[#fffaf8] px-3 py-3">
              <button
                type="button"
                onClick={openBooking}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#1f1a17] px-3 text-[12px] font-semibold text-white transition hover:bg-[#3a302a]"
              >
                <CalendarHeart className="size-4" />
                Đặt lịch
              </button>
              <a
                href="tel:0901234567"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-white px-3 text-[12px] font-semibold text-[#4c403a] ring-1 ring-[#eadfd5] transition hover:bg-[#f8f2ef]"
              >
                <PhoneCall className="size-4" />
                Gọi studio
              </a>
            </div>

            <BridalChatInput disabled={isStreaming} onSend={sendMessage} />
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "group flex h-16 items-center gap-3 rounded-full bg-[#1f1a17] py-2 pl-3 pr-5 text-white",
          "shadow-[0_16px_46px_rgba(31,26,23,0.28)] ring-1 ring-white/30 transition hover:bg-[#342b26]"
        )}
        aria-label={isOpen ? "Thu gọn Bridal Support" : "Mở Bridal Support"}
      >
        <span className="relative grid size-11 place-items-center rounded-full bg-[linear-gradient(135deg,#f8d8d2,#d5a08d)] text-[#221b17] shadow-inner">
          {isOpen ? (
            <ChevronDown className="size-5" />
          ) : (
            <MessageCircleHeart className="size-5" />
          )}
          {!isOpen && (
            <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full border-2 border-[#1f1a17] bg-[#67b783]" />
          )}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-[12px] font-semibold uppercase tracking-[0.14em] text-[#f1d9d3]">
            Bridal Support
          </span>
          <span className="block text-[13px] text-white/82">Tư vấn váy cưới</span>
        </span>
      </motion.button>
    </div>
  );
}
