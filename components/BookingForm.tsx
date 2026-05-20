"use client";

import { useState } from "react";
import { trackFormSubmit } from "@/lib/analytics";
import { DatePicker } from "./DatePicker";
import { CustomSelect } from "./CustomSelect";

const experienceOptions = [
  {
    value: "collection",
    title: "Xem bộ sưu tập",
    description: "Khám phá bộ sưu tập mới nhất",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="size-4.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 0a3 3 0 00-3 3v.75m3-3.75a3 3 0 013 3v.75M9 9.3v.75m6-.75v.75M2.25 15.75l9.75-6.75 9.75 6.75A1.5 1.5 0 0120.25 18H3.75a1.5 1.5 0 01-1.5-2.25z" />
      </svg>
    ),
  },
  {
    value: "styling",
    title: "Tư vấn phong cách",
    description: "Cùng stylist tìm hướng riêng",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="size-4.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l5.104-.813a3 3 0 001.917-.924l6.06-6.058a1.795 1.795 0 00-2.538-2.538L13.48 16.73a3 3 0 00-.924 1.917zM14.25 15.25l2.5 2.5M21 3h-1.5M16.5 4.5h-1.5M21 7.5H19.5" />
      </svg>
    ),
  },
  {
    value: "custom",
    title: "May theo yêu cầu",
    description: "Thiết kế riêng cho bạn",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="size-4.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 8.967a2.25 2.25 0 113.582-2.53M4.94 4.053a2.25 2.25 0 101.957 3.87m2.228-2.336L20.25 18M7.864 15.033a2.25 2.25 0 103.582 2.53M4.94 19.947a2.25 2.25 0 111.957-3.87m2.228 2.336L20.25 6" />
      </svg>
    ),
  },
  {
    value: "photoshoot",
    title: "Chụp thử cùng váy",
    description: "Lưu giữ khoảnh khắc đặc biệt",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="size-4.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316A2.192 2.192 0 0014.502 4h-5c-.7 0-1.343.372-1.688 1.054l-.822 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
      </svg>
    ),
  },
];

const guestOptions = [
  "Chỉ mình tôi",
  "2 người",
  "3 người",
  "4 người",
  "Nhóm 5+ người",
];

type SubmitStatus = "idle" | "success" | "error";

export function BookingForm() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "Không thể gửi thông tin đặt lịch.");
      }

      trackFormSubmit("booking", true);
      setStatus("success");
      setMessage(result.message || "Đã gửi thông tin đặt lịch. Chúng tôi sẽ liên hệ lại sớm.");
      form.reset();
    } catch (error) {
      trackFormSubmit("booking", false);
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Không thể gửi thông tin đặt lịch.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full rounded-[10px] bg-[#fffaf2]/96 p-5 font-sans text-[#2f2924] shadow-[0_28px_80px_rgba(73,49,28,0.22)] ring-1 ring-[#d9c7aa] backdrop-blur-[2px] md:p-6">
      <fieldset className="border-0 p-0">
        <legend className="mb-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#8c7458]">
          Bạn muốn trải nghiệm gì?
        </legend>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {experienceOptions.map((option, index) => (
            <label
              key={option.value}
              className="group grid min-h-[74px] cursor-pointer grid-cols-[38px_1fr] items-center gap-3.5 rounded-[9px] border border-[#e5d8c5] bg-white px-3.5 py-3 shadow-[0_2px_4px_rgba(73,49,28,0.02)] transition duration-200 hover:-translate-y-0.5 hover:border-[#c9ad82] hover:bg-[#fff7ec] hover:shadow-[0_4px_12px_rgba(73,49,28,0.06)] has-[:checked]:border-[#b58c56] has-[:checked]:bg-[#f1dfc3] has-[:checked]:text-[#2f2924] has-[:checked]:shadow-[0_4px_16px_rgba(181,140,86,0.12)]"
            >
              <input
                type="radio"
                name="experience"
                value={option.title}
                defaultChecked={index === 0}
                className="sr-only"
              />
              <span className="grid size-9 place-items-center rounded-full bg-[#f0e4d2] text-[#8f6a3c] ring-1 ring-[#dec9aa] transition duration-200 group-hover:scale-105 group-has-[:checked]:bg-[#b58c56] group-has-[:checked]:text-white">
                {option.icon}
              </span>
              <span>
                <span className="block text-[13px] font-semibold leading-tight">{option.title}</span>
                <span className="mt-1 block text-[11px] font-medium leading-snug text-[#8a7a6a] group-has-[:checked]:text-[#6f5638]">{option.description}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="my-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
        <span className="h-px bg-[#dfcfb8]" />
        <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#8c7458]">Chọn ngày & giờ</span>
        <span className="h-px bg-[#dfcfb8]" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1.1fr_1.8fr] lg:items-end">
        <div className="block">
          <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8c7458]">Ngày hẹn</span>
          <DatePicker name="appointmentDate" required />
        </div>
        <div className="block">
          <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8c7458]">Số người đi cùng</span>
          <CustomSelect name="guests" options={guestOptions} defaultValue={guestOptions[0]} />
        </div>
        <label className="block">
          <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8c7458]">
            Khung giờ mong muốn
          </span>
          <input
            required
            type="text"
            name="appointmentTime"
            placeholder="Ví dụ: 10:30, 3h chiều..."
            className="mt-2 h-11 w-full rounded-[7px] border border-[#e1d3be] bg-white px-3.5 text-[13px] font-medium text-[#3a332d] outline-none transition placeholder:font-normal placeholder:text-[#b0a392] focus:border-[#b58c56] focus:ring-1 focus:ring-[#b58c56]"
          />
        </label>
      </div>

      <div className="my-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
        <span className="h-px bg-[#dfcfb8]" />
        <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#8c7458]">Thông tin liên hệ</span>
        <span className="h-px bg-[#dfcfb8]" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1.35fr] lg:items-start">
        <label className="block">
          <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8c7458]">Họ và tên</span>
          <input
            required
            type="text"
            name="fullName"
            placeholder="Nguyễn Thị Lan"
            className="mt-2 h-11 w-full rounded-[7px] border border-[#e1d3be] bg-white px-3.5 text-[13px] font-medium text-[#3a332d] outline-none transition placeholder:font-normal placeholder:text-[#b0a392] focus:border-[#b58c56] focus:ring-1 focus:ring-[#b58c56]"
          />
        </label>
        <label className="block">
          <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8c7458]">Số điện thoại</span>
          <input
            required
            type="tel"
            name="phone"
            placeholder="0901234567"
            className="mt-2 h-11 w-full rounded-[7px] border border-[#e1d3be] bg-white px-3.5 text-[13px] font-medium text-[#3a332d] outline-none transition placeholder:font-normal placeholder:text-[#b0a392] focus:border-[#b58c56] focus:ring-1 focus:ring-[#b58c56]"
          />
        </label>
        <label className="block">
          <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8c7458]">
            Ghi chú thêm <span className="normal-case text-[#a2917d]">(tùy chọn)</span>
          </span>
          <textarea
            name="note"
            rows={1}
            placeholder="Phong cách yêu thích, màu sắc mong muốn..."
            className="mt-2 h-11 w-full resize-none rounded-[7px] border border-[#e1d3be] bg-white px-3.5 py-3 text-[13px] font-medium text-[#3a332d] outline-none transition placeholder:font-normal placeholder:text-[#b0a392] focus:border-[#b58c56] focus:ring-1 focus:ring-[#b58c56]"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-[7px] bg-[#2f2924] px-5 text-[13px] font-semibold uppercase tracking-[0.12em] text-white shadow-sm transition hover:bg-[#b58c56] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Đang gửi..." : "Xác nhận đặt lịch →"}
      </button>

      {message && (
        <p className={`mt-3 text-center text-[13px] font-semibold ${status === "success" ? "text-[#7b633f]" : "text-[#b24032]"}`}>
          {message}
        </p>
      )}
    </form>
  );
}

export default BookingForm;
