"use client";

import { FormEvent, KeyboardEvent, useState } from "react";
import { ImagePlus, Send, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

interface BridalChatInputProps {
  disabled?: boolean;
  onSend: (message: string) => void;
}

export function BridalChatInput({ disabled, onSend }: BridalChatInputProps) {
  const [value, setValue] = useState("");

  function submit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const trimmed = value.trim();

    if (!trimmed || disabled) {
      return;
    }

    onSend(trimmed);
    setValue("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <form onSubmit={submit} className="border-t border-[#eadfd5] bg-white/92 p-3">
      <div className="flex items-center gap-2 rounded-full bg-[#f8f2ef] px-2 py-2 ring-1 ring-[#eadfd5] transition focus-within:bg-white focus-within:ring-[#d8a39a]">
        <button
          type="button"
          className="grid size-9 shrink-0 place-items-center rounded-full text-[#b88678] transition hover:bg-white hover:text-[#1f1a17]"
          aria-label="Chọn emoji"
        >
          <Smile className="size-4" />
        </button>
        <button
          type="button"
          className="grid size-9 shrink-0 place-items-center rounded-full text-[#b88678] transition hover:bg-white hover:text-[#1f1a17]"
          aria-label="Tải ảnh mẫu váy"
        >
          <ImagePlus className="size-4" />
        </button>
        <input
          value={value}
          disabled={disabled}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tin nhắn của chị..."
          className="min-w-0 flex-1 bg-transparent text-[13px] text-[#2d2824] placeholder:text-[#a89991] focus:outline-none disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-full bg-[#1f1a17] text-white shadow-sm transition",
            "hover:bg-[#3a302a] disabled:cursor-not-allowed disabled:bg-[#d8c9c0]"
          )}
          aria-label="Gửi tin nhắn"
        >
          <Send className="size-4" />
        </button>
      </div>
    </form>
  );
}

