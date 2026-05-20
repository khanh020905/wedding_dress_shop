"use client";

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-white px-4 py-3 shadow-sm ring-1 ring-[#eadfd5]">
      <span className="sr-only">Bridal Support đang nhập</span>
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="size-1.5 animate-bounce rounded-full bg-[#c69082]"
          style={{ animationDelay: `${index * 120}ms` }}
        />
      ))}
    </div>
  );
}

