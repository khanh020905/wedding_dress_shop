"use client";

import { useState, useRef, useEffect } from "react";

interface CustomSelectProps {
  name: string;
  options: string[];
  defaultValue: string;
}

export function CustomSelect({ name, options, defaultValue }: CustomSelectProps) {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectOption = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Hidden input to pass value to the parent Form native element */}
      <input type="hidden" name={name} value={selectedValue} />

      {/* Visible Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="mt-2 flex h-11 w-full items-center justify-between rounded-[7px] border border-[#e1d3be] bg-white px-3.5 text-left text-[13px] font-medium text-[#3a332d] outline-none transition hover:border-[#c9ad82] focus:border-[#b58c56] focus:ring-1 focus:ring-[#b58c56]"
      >
        <span>{selectedValue}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.2}
          stroke="currentColor"
          className={`size-3.5 text-[#8c7458] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Premium Floating Options Menu */}
      {isOpen && (
        <ul className="absolute left-0 right-0 z-50 mt-2 max-h-60 overflow-y-auto rounded-[8px] border border-[#e8dfd1] bg-white py-1.5 shadow-[0_12px_36px_rgba(73,49,28,0.15)] outline-none animate-in fade-in slide-in-from-top-1.5 duration-150">
          {options.map((option) => {
            const isSelected = option === selectedValue;
            return (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-[13px] font-medium transition-colors duration-100 ${
                    isSelected
                      ? "bg-[#f1dfc3] text-[#2f2924]"
                      : "text-[#4a3f35] hover:bg-[#fff7ec] hover:text-[#b58c56]"
                  }`}
                >
                  <span>{option}</span>
                  {isSelected && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="size-4 text-[#b58c56]"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
