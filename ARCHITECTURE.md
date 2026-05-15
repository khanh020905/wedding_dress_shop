# ARCHITECTURE.md

Tài liệu kiến trúc kỹ thuật chuẩn

*Next.js · TypeScript · Tailwind CSS*

Version 1.0 | Phiên bản nội bộ | **Bắt buộc tuân thủ cho mọi landing page**

## 0. Mục tiêu tài liệu

Tài liệu này định nghĩa cấu trúc dự án, quy ước đặt tên, tech stack, và workflow bắt buộc cho toàn bộ landing page được ship bởi team.

| Mục tiêu | Chi tiết |
| :-- | :-- |
| Thống nhất codebase | Mọi LP có cùng cấu trúc thư mục, cùng naming convention. |
| Tăng tốc onboarding | Intern mới có thể clone template và ship LP trong ngày đầu. |
| Giảm bug sau deploy | Checklist rõ ràng, chuẩn hóa component, không tái phát lỗi cũ. |
| Đo được output | Mỗi LP có tracking chuẩn ngay từ template. |

## 1. Tech Stack chính thức

- Next.js App Router
- TypeScript strict mode
- Tailwind CSS utilities trong `globals.css`
- React UI components
- GTM/GA4 tracking helpers trong `lib/analytics.ts`

## 2. Cấu trúc thư mục chuẩn

```text
app/
components/
  ui/
  sections/
  forms/
  layout/
lib/
hooks/
types/
public/
content/
```

## 3. Naming Convention

- Component files: `PascalCase.tsx`
- Utility/hook files: `camelCase.ts`
- Route slug: `kebab-case`
- Component function: `PascalCase`
- Props interface: `PascalCaseProps`
- Constants: `SCREAMING_SNAKE_CASE`
- Public env variables: `NEXT_PUBLIC_` prefix

## 4. Component Pattern chuẩn

- Không dùng `any`
- Props destructure ngay parameter
- Server Component mặc định
- Chỉ thêm `use client` khi cần browser API/event handler
- Không inline style trừ dynamic CSS variable hạn chế
- Export named và default với section component
- Text đưa vào props/content khi mở rộng thành multi-LP

## 5. Landing Page Template chuẩn

Landing page dùng App Router, có SEO metadata, semantic HTML, một H1, CTA tracking, responsive layout, image alt text và không dùng `href="#"`.

## 6. Environment Variables

Xem `.env.example`. Không commit `.env.local`.

## 7. QA Checklist trước khi Deploy

1. Đúng brief, đủ section, không placeholder.
2. Responsive tại 375px, 768px, 1280px.
3. Lighthouse Performance ≥ 80, Accessibility ≥ 90, Best Practices ≥ 90.
4. Form/CTA links hoạt động.
5. GTM/GA4 inject đúng.
6. CTA/Form events gửi đúng.
7. SEO title, description, H1, og:image, canonical đúng.
8. Mọi ảnh có alt text.
9. Không có console error.
10. `npm run build` pass.

## 8. Git Workflow

- `main`: production
- `develop`: integration
- `feature/LP-[slug]`: từng landing page
- Commit format: `type(scope): mô tả ngắn gọn`

## 9. Performance Standards

- Lighthouse Performance ≥ 80
- LCP ≤ 2.5s
- CLS ≤ 0.1
- First Load JS ≤ 150KB mục tiêu
- Dùng WebP/AVIF khi có ảnh thật
- Dùng `next/image`, width/height, priority cho hero image

## 10. Daily Async Format

```text
✅ Hôm qua: [LP-slug] ...
🔨 Hôm nay: [LP-slug] ...
🔗 Link đang làm: ...
⏰ ETA deploy: ...
🚧 Blocker: Không có blocker.
```

## 11. Glossary

LP, DoD, GTM, Brief, Slug, Component, Section, Server Component, Client Component, WIP.

**Mọi exception phải có phê duyệt bằng văn bản từ CTO trước khi áp dụng.**
