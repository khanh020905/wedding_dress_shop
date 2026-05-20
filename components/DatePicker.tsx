"use client";

import { useState, useRef, useEffect } from "react";

interface DatePickerProps {
  name: string;
  required?: boolean;
}

export function DatePicker({ name, required = false }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Close calendar popover on click outside
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

  // Today's date with time set to midnight for clean comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth(); // 0-indexed

  // Vietnamese month names
  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  // Helper to format date as DD/MM/YYYY for display
  const formatDateDisplay = (date: Date | null) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Helper to format date as YYYY-MM-DD for standard form submission
  const formatDateValue = (date: Date | null) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // Navigate to previous month
  const prevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  // Navigate to next month
  const nextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Generate days in calendar grid (Sunday-first to match standard Windows/Chrome picker)
  const getDaysInMonth = () => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // Index of 1st day of month (0 = Sun, 1 = Mon...)
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate(); // Total days in current month

    const days: Array<{ date: Date; isCurrentMonth: boolean; isDisabled: boolean }> = [];

    // Fill previous month offset days
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1, prevMonthDays - i);
      d.setHours(0, 0, 0, 0);
      days.push({
        date: d,
        isCurrentMonth: false,
        isDisabled: d < today,
      });
    }

    // Fill current month days
    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(currentYear, currentMonth, i);
      d.setHours(0, 0, 0, 0);
      days.push({
        date: d,
        isCurrentMonth: true,
        isDisabled: d < today,
      });
    }

    // Fill next month offset days to make grid complete (multiple of 7, usually 42 cells)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const d = new Date(currentYear, currentMonth + 1, i);
      d.setHours(0, 0, 0, 0);
      days.push({
        date: d,
        isCurrentMonth: false,
        isDisabled: d < today,
      });
    }

    return days;
  };

  const handleSelectDay = (date: Date, isDisabled: boolean) => {
    if (isDisabled) return;
    setSelectedDate(date);
    setIsOpen(false);
  };

  const daysGrid = getDaysInMonth();
  const weekHeaders = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Hidden input to pass date to the parent Form native element */}
      <input
        type="hidden"
        name={name}
        required={required}
        value={formatDateValue(selectedDate)}
      />

      {/* Visible Input Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="mt-2 flex h-11 w-full items-center justify-between rounded-[7px] border border-[#e1d3be] bg-white px-3.5 text-left text-[13px] font-medium text-[#3a332d] outline-none transition hover:border-[#c9ad82] focus:border-[#b58c56] focus:ring-1 focus:ring-[#b58c56]"
      >
        <span className={selectedDate ? "text-[#3a332d]" : "text-[#b0a392] font-normal"}>
          {selectedDate ? formatDateDisplay(selectedDate) : "Chọn ngày hẹn..."}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="size-[17px] text-[#8c7458]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
          />
        </svg>
      </button>

      {/* Premium Floating Calendar Popover */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-2.5 rounded-[10px] border border-[#e8dfd1] bg-[#fffaf2] p-4 text-[#2f2924] shadow-[0_20px_50px_rgba(73,49,28,0.18)] backdrop-blur-[4px] animate-in fade-in slide-in-from-top-2 duration-200 sm:w-[310px]">
          {/* Calendar Navigation Header */}
          <div className="flex items-center justify-between border-b border-[#ebdcb9]/40 pb-3">
            <button
              onClick={prevMonth}
              className="flex size-7 items-center justify-center rounded-full bg-white ring-1 ring-[#e1d3be] transition hover:bg-[#f1dfc3] hover:text-[#b58c56]"
              aria-label="Tháng trước"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="size-3.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#735d46]">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button
              onClick={nextMonth}
              className="flex size-7 items-center justify-center rounded-full bg-white ring-1 ring-[#e1d3be] transition hover:bg-[#f1dfc3] hover:text-[#b58c56]"
              aria-label="Tháng sau"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="size-3.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

          {/* Week Headers Grid */}
          <div className="mt-3 grid grid-cols-7 text-center">
            {weekHeaders.map((day, idx) => (
              <span
                key={day}
                className={`text-[11px] font-semibold tracking-[0.08em] ${
                  idx === 0 ? "text-[#b24032]" : "text-[#8c7458]"
                }`}
              >
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="mt-1.5 grid grid-cols-7 gap-y-1 text-center">
            {daysGrid.map(({ date, isCurrentMonth, isDisabled }, index) => {
              const isSelected =
                selectedDate &&
                selectedDate.getDate() === date.getDate() &&
                selectedDate.getMonth() === date.getMonth() &&
                selectedDate.getFullYear() === date.getFullYear();

              const isToday =
                today.getDate() === date.getDate() &&
                today.getMonth() === date.getMonth() &&
                today.getFullYear() === date.getFullYear();

              return (
                <button
                  key={index}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleSelectDay(date, isDisabled)}
                  className={`mx-auto flex size-8 items-center justify-center rounded-full text-[12px] font-semibold transition-all duration-150 ${
                    !isCurrentMonth ? "text-[#b8ab9a]/60" : "text-[#3a332d]"
                  } ${
                    isSelected
                      ? "bg-[#b58c56] text-white shadow-md shadow-[#b58c56]/20 scale-105"
                      : isToday
                      ? "border border-[#b58c56] text-[#b58c56] bg-white"
                      : "hover:bg-[#f3e6d3] hover:text-[#8f6a3c]"
                  } ${
                    isDisabled
                      ? "cursor-not-allowed opacity-25 hover:bg-transparent hover:text-[#b8ab9a]/60"
                      : ""
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
