import Image from "next/image";
import Link from "next/link";
import { TrackingLink } from "@/components/TrackingLink";

const navigationItems = [
  { label: "Trang chủ", href: "#home" },
  { label: "Váy cưới", href: "#collection" },
  { label: "Bảng giá", href: "#pricing" },
  { label: "Blog", href: "#faq" },
  { label: "Về chúng tôi", href: "#about" },
  { label: "Liên hệ", href: "#booking" },
];

const heroFeatures = [
  { icon: "♕", title: "Hàng trăm", text: "mẫu váy cao cấp" },
  { icon: "⌁", title: "Đa dạng phong cách", text: "từ Classic đến Trendy" },
  { icon: "♢", title: "Vệ sinh & bảo quản", text: "chuẩn cao cấp" },
  { icon: "♡", title: "Tư vấn tận tâm", text: "miễn phí" },
];

const benefits = [
  { icon: "♙", title: "Váy cao cấp", text: "Nhập khẩu & thiết kế độc quyền, luôn cập nhật xu hướng mới nhất." },
  { icon: "◇", title: "Giá hợp lý", text: "Chi phí thuê tiết kiệm so với mua mới." },
  { icon: "♢", title: "Dịch vụ chuyên nghiệp", text: "Tư vấn tận tâm, hỗ trợ trọn gói cho ngày cưới." },
  { icon: "▣", title: "Miễn phí thử váy", text: "Trải nghiệm trực tiếp tại showroom sang trọng." },
  { icon: "♡", title: "Sạch sẽ & an toàn", text: "Váy được vệ sinh, bảo quản đạt chuẩn cao cấp." },
];

const testimonials = [
  {
    quote: "Váy đẹp xuất sắc, vừa vặn và sang trọng. Mình nhận được rất nhiều lời khen trong ngày cưới.",
    name: "Thu Hương",
  },
  {
    quote: "Dịch vụ tư vấn rất nhiệt tình, giúp mình chọn được chiếc váy trong mơ với mức giá cực kỳ hợp lý.",
    name: "Minh Anh",
  },
  {
    quote: "Showroom rộng rãi, váy đa dạng. Mình thử 3 chiếc và chiếc nào cũng ưng hết.",
    name: "Lan Phương",
  },
];

const collectionItems = [
  {
    name: "Celeste Lace",
    style: "Ren Pháp cổ điển",
    tag: "Best Fit",
    description: "Phom xòe mềm, lưng ren tinh tế cho vẻ đẹp thanh lịch vượt thời gian.",
    image: "/images/collection-lace-a-line.png",
    objectPosition: "center center",
    imageClass: "[transform:scale(1.01)] group-hover:[transform:scale(1.04)] brightness-[1.03] contrast-[0.98]",
  },
  {
    name: "Aurelia Gown",
    style: "Xòe hoàng gia",
    tag: "Signature",
    description: "Tùng váy lớn bắt sáng nhẹ, phù hợp sảnh cưới sang trọng và ảnh cưới studio.",
    image: "/images/collection-satin-minimal.png",
    objectPosition: "center center",
    imageClass: "[transform:scale(1.01)] group-hover:[transform:scale(1.04)] brightness-[1.02] saturate-[0.96]",
  },
  {
    name: "Pearl Whisper",
    style: "Corset đính ngọc",
    tag: "New",
    description: "Đường corset ôm eo, chi tiết ngọc nhỏ tạo điểm nhấn trong ánh sáng ấm.",
    image: "/images/collection-off-shoulder-ballgown.png",
    objectPosition: "center center",
    imageClass: "[transform:scale(1.01)] group-hover:[transform:scale(1.04)] brightness-[1.07] contrast-[0.96]",
  },
  {
    name: "Ivory Muse",
    style: "Hoa ren nổi",
    tag: "Luxury",
    description: "Lớp ren nổi mềm mại trên nền ivory, tạo cảm giác nữ tính và cao cấp.",
    image: "/images/collection-long-sleeve-lace.png",
    objectPosition: "center center",
    imageClass: "[transform:scale(1.01)] group-hover:[transform:scale(1.04)] brightness-[1.04] contrast-[0.97]",
  },
  {
    name: "Lumiere Satin",
    style: "Satin tối giản",
    tag: "Modern",
    description: "Tinh giản đường nét, tập trung vào độ rủ và ánh vải sang nhẹ.",
    image: "/images/collection-pearl-corset.png",
    objectPosition: "center center",
    imageClass: "[transform:scale(1.01)] group-hover:[transform:scale(1.04)] brightness-[1.05] saturate-[0.93]",
  },
  {
    name: "Rosé Garden",
    style: "Tùng hoa mềm",
    tag: "Curve",
    description: "Cảm hứng garden wedding với lớp váy bung nhẹ, ngọt ngào nhưng vẫn hiện đại.",
    image: "/images/collection-mermaid-lace.png",
    objectPosition: "center center",
    imageClass: "[transform:scale(1.01)] group-hover:[transform:scale(1.04)] brightness-[1.06] contrast-[0.95]",
  },
];

const pricingPlans = [
  {
    name: "Gói Basic",
    subtitle: "Simple & Elegant",
    price: "2.500.000đ",
    tag: "",
    image: "/images/pricing-basic.png",
    imagePosition: "50% 44%",
    features: ["Váy cưới cao cấp", "Phụ kiện cơ bản", "Thử váy 1 lần"],
  },
  {
    name: "Gói Premium",
    subtitle: "Classic & Luxury",
    price: "4.500.000đ",
    tag: "Phổ biến nhất",
    image: "/images/pricing-premium.png",
    imagePosition: "50% 43%",
    features: ["Váy cưới cao cấp", "Phụ kiện đi kèm", "Thử váy 2 lần", "Hỗ trợ chỉnh sửa"],
  },
  {
    name: "Gói VIP",
    subtitle: "Designer Collection",
    price: "7.500.000đ",
    tag: "",
    image: "/images/pricing-vip.png",
    imagePosition: "50% 43%",
    features: ["Váy thiết kế độc quyền", "Phụ kiện cao cấp", "Thử váy không giới hạn", "Ưu tiên đặt lịch"],
  },
];

const faqs = [
  "Tôi cần đặt lịch trước bao lâu?",
  "Giá thuê đã bao gồm những gì?",
  "Tôi có thể thử váy bao nhiêu lần?",
  "Thời gian thuê váy là bao lâu?",
  "Nếu làm hư váy thì sao?",
  "Các bạn có hỗ trợ ship váy không?",
];

const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    label: "F",
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    label: "IG",
  },
  {
    name: "TikTok",
    href: "https://tiktok.com",
    label: "\u266A",
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    label: "\u25B6",
  },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-8 text-center">
      <h2 className="font-serif text-[22px] font-semibold uppercase tracking-[0.08em] text-[#1f1a17]">
        {children}
      </h2>
      <div className="mx-auto mt-3 h-px w-14 bg-[#b58c56]" />
      <div className="mx-auto -mt-[3px] h-1.5 w-1.5 rotate-45 bg-[#b58c56]" />
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#1f1a17]">
      <section id="home" className="hero">
        <div className="hero-image-wrapper">
          <Image
            src="/images/anhbia.png"
            alt="Cô dâu mặc váy cưới ren trong showroom Dream & Dress"
            fill
            priority
            sizes="100vw"
            className="hero-image"
          />
        </div>
        <div className="hero-shell">
          <header className="relative z-10 bg-transparent px-4 lg:pl-9 lg:pr-3">
            <div className="flex h-[58px] w-full items-center justify-between gap-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#241f1b]">
              <Link href="/" className="flex min-w-fit items-center gap-2 tracking-normal md:min-w-[190px] md:gap-3">
                <span className="grid size-9 place-items-center rounded-full border border-[#d8c4a5] font-serif text-lg italic text-[#b58c56] md:size-10 md:text-xl">
                  D
                </span>
                <span className="leading-tight">
                  <span className="block font-serif text-[14px] tracking-[0.12em] text-[#2a211d] md:text-[17px]">Dream & Dress</span>
                  <span className="block text-[8px] tracking-[0.2em] text-[#8f806b] md:text-[10px]">Wedding Rental</span>
                </span>
              </Link>
              <nav className="hidden flex-1 items-center justify-center gap-9 lg:flex">
                {navigationItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex h-[58px] items-center justify-center whitespace-nowrap border-b border-transparent pt-px transition hover:border-[#b58c56] hover:text-[#b58c56]"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <TrackingLink
                href="#booking"
                label="Đặt lịch thử váy"
                location="header"
                className="hidden h-9 min-w-[158px] items-center justify-center gap-2 rounded-full bg-white px-4 text-[10px] font-bold uppercase tracking-[0.1em] text-[#2f2924] shadow-sm ring-1 ring-[#eee3d3] transition hover:bg-[#b58c56] hover:text-white lg:inline-flex"
              >
                Đặt lịch thử váy
                <span aria-hidden="true" className="text-[12px] leading-none">↗</span>
              </TrackingLink>
              <details className="group lg:hidden">
                <summary className="grid size-10 cursor-pointer list-none place-items-center rounded-full bg-white/86 text-lg font-bold text-[#2f2924] shadow-sm ring-1 ring-[#eee3d3] transition group-open:bg-[#b58c56] group-open:text-white">
                  <span className="group-open:hidden" aria-hidden="true">☰</span>
                  <span className="hidden group-open:inline" aria-hidden="true">×</span>
                  <span className="sr-only">Mở menu</span>
                </summary>
                <div className="absolute left-4 right-4 top-[64px] overflow-hidden rounded-[6px] bg-white shadow-xl ring-1 ring-[#eadfce]">
                  <nav className="grid divide-y divide-[#f0e7da] text-[12px] font-bold uppercase tracking-[0.12em] text-[#2f2924]">
                    {navigationItems.map((item) => (
                      <a key={item.href} href={item.href} className="px-5 py-4 transition hover:bg-[#fbfaf7] hover:text-[#b58c56]">
                        {item.label}
                      </a>
                    ))}
                    <a href="#booking" className="bg-[#b58c56] px-5 py-4 text-white transition hover:bg-[#9b7445]">
                      Đặt lịch thử váy
                    </a>
                  </nav>
                </div>
              </details>
            </div>
          </header>

          <div className="hero-content-row mx-auto flex w-full max-w-7xl px-5 py-10 sm:px-6 lg:px-10 lg:py-8">
            <div className="hero-content max-w-[610px] lg:max-w-[560px]">
              <p className="mb-5 font-serif text-[26px] italic leading-none text-[#b58c56] md:mb-6 md:text-[38px] lg:mb-5 lg:text-[34px]">
                Tỏa sáng trong ngày trọng đại
              </p>
              <h1 className="font-serif text-[52px] font-semibold uppercase leading-[0.98] tracking-[0.01em] text-[#191714] sm:text-[64px] md:text-[92px] lg:text-[96px] xl:text-[108px]">
                Váy cưới
                <br />
                cho thuê
              </h1>
              <p className="mt-5 text-[16px] font-medium leading-7 tracking-[0.06em] text-[#2f2a26] md:mt-6 md:text-[20px] md:tracking-[0.08em] lg:mt-5 lg:text-[18px]">
                Đẹp như mơ - Giá cả hợp lý - Dịch vụ tận tâm
              </p>
              <div className="mt-7 grid max-w-[560px] grid-cols-2 gap-4 md:mt-8 md:grid-cols-4 md:gap-5 lg:mt-6 lg:gap-4">
                {heroFeatures.map((feature) => (
                  <div key={feature.title} className="text-center text-[#5d5144]">
                    <div className="mx-auto mb-2 grid size-9 place-items-center text-2xl text-[#aa936d] md:mb-3 md:size-10 md:text-3xl">
                      {feature.icon}
                    </div>
                    <p className="text-[12px] font-semibold">{feature.title}</p>
                    <p className="mt-1 text-[11px] leading-relaxed">{feature.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row lg:mt-7">
                <TrackingLink
                  href="#pricing"
                  label="Xem bộ sưu tập"
                  location="hero"
                  className="inline-flex h-[52px] w-full items-center justify-center rounded-[3px] bg-[#b58c56] px-7 text-[12px] font-bold uppercase tracking-[0.12em] text-white shadow-sm transition hover:bg-[#9b7445] sm:h-14 sm:w-auto sm:px-9 sm:text-[13px]"
                >
                  Xem bộ sưu tập
                </TrackingLink>
                <TrackingLink
                  href="#booking"
                  label="Đặt lịch thử váy"
                  location="hero"
                  className="inline-flex h-[52px] w-full items-center justify-center rounded-[3px] border border-[#b58c56] bg-white/70 px-7 text-[12px] font-bold uppercase tracking-[0.12em] text-[#6d573a] transition hover:bg-white sm:h-14 sm:w-auto sm:px-9 sm:text-[13px]"
                >
                  Đặt lịch thử váy
                </TrackingLink>
              </div>
            </div>
          </div>
          <div className="absolute bottom-9 right-8 hidden size-36 flex-col items-center justify-center rounded-full bg-white/88 text-center shadow-xl ring-1 ring-[#e5d8c5] lg:flex">
            <span className="text-[13px] font-bold uppercase tracking-[0.14em]">Hơn</span>
            <span className="font-serif text-[44px] font-semibold leading-none text-[#a98450]">1000+</span>
            <span className="text-[13px] font-bold uppercase leading-tight">cô dâu<br />tin chọn</span>
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-16 bg-white py-14">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle>Vì sao chọn chúng tôi?</SectionTitle>
          <div className="grid grid-cols-1 divide-y divide-[#eee8dd] md:grid-cols-5 md:divide-x md:divide-y-0">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="px-7 py-5 text-center">
                <div className="mx-auto mb-4 grid size-14 place-items-center text-5xl text-[#aa936d]">{benefit.icon}</div>
                <h3 className="text-[13px] font-bold uppercase tracking-[0.1em]">{benefit.title}</h3>
                <p className="mt-3 text-[13px] leading-6 text-[#6f665c]">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="collection" className="scroll-mt-16 bg-[#f7f5f0] py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <SectionTitle>Bộ sưu tập váy cưới</SectionTitle>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collectionItems.map((item) => (
              <article
                key={item.name}
                className="group overflow-hidden rounded-[8px] bg-white shadow-[0_10px_30px_rgba(64,45,27,0.06)] ring-1 ring-[#e8dfd1] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_46px_rgba(64,45,27,0.13)]"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#eee5d8]">
                  <Image
                    src={item.image}
                    alt={`${item.name} - ${item.style}`}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className={`object-cover transition duration-700 ease-out ${item.imageClass}`}
                    style={{ objectPosition: item.objectPosition }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-[#3c2a18]/[0.03]" />
                  <span className="absolute left-3 top-3 rounded-[4px] bg-white/92 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8f6a3c] shadow-sm ring-1 ring-[#eadfce] backdrop-blur-sm">
                    {item.tag}
                  </span>
                </div>
                <div className="p-5 md:p-6">
                  <p className="font-serif text-[25px] font-semibold leading-none text-[#1f1a17]">{item.name}</p>
                  <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#9b7445]">{item.style}</p>
                  <p className="mt-4 min-h-14 text-[13px] leading-6 text-[#6f665c]">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-[14px] leading-7 text-[#6f665c]">
            Chọn mẫu váy phù hợp phong cách của bạn, sau đó đặt lịch thử trực tiếp tại showroom.
          </p>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-6">
          <SectionTitle>Khách hàng nói gì về chúng tôi?</SectionTitle>
          <div className="grid gap-7 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="rounded-[8px] bg-[#fbfaf7] p-7 shadow-sm ring-1 ring-[#ece4d8]">
                <p className="font-serif text-3xl text-[#b58c56]">“</p>
                <p className="-mt-3 min-h-20 text-[15px] leading-7 text-[#4f4740]">{testimonial.quote}</p>
                <div className="mt-4 text-[#b58c56]">★ ★ ★ ★ ★</div>
                <div className="mt-5 flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-full bg-[#eadfce] font-serif text-lg text-[#8f6a3c]">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[14px] font-bold">{testimonial.name}</p>
                    <p className="text-[12px] text-[#8c8073]">Cô dâu</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-16 bg-white py-14">
        <div className="mx-auto max-w-6xl px-6">
          <SectionTitle>Bảng giá thuê váy cưới</SectionTitle>
          <div className="grid gap-7 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <article key={plan.name} className="relative grid overflow-hidden rounded-[4px] bg-[#fbfaf7] shadow-sm ring-1 ring-[#e8dfd1] sm:grid-cols-[42%_1fr]">
                {plan.tag && (
                  <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 rounded-b-[3px] bg-[#b58c56] px-6 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-white">
                    {plan.tag}
                  </div>
                )}
                <div className="relative min-h-64">
                  <Image
                    src={plan.image}
                    alt={`Mẫu váy cưới trong ${plan.name}`}
                    fill
                    sizes="(min-width: 1024px) 180px, 45vw"
                    className="object-cover"
                    style={{ objectPosition: plan.imagePosition }}
                  />
                </div>
                <div className="flex flex-col justify-center p-7">
                  <h3 className="font-serif text-[24px] font-semibold uppercase">{plan.name}</h3>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8c8073]">{plan.subtitle}</p>
                  <ul className="mt-5 space-y-2 text-[14px] text-[#5f564d]">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <span className="text-[#b58c56]">◎</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 font-serif text-[26px] font-semibold text-[#a98450]">{plan.price}</p>
                  <TrackingLink
                    href="#booking"
                    label={`Chọn ${plan.name}`}
                    location="pricing"
                    className="mt-3 inline-flex h-10 w-36 items-center justify-center rounded-[3px] bg-[#b58c56] text-[12px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#9b7445]"
                  >
                    Chọn gói
                  </TrackingLink>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-5 text-center text-[13px] text-[#766b61]">
            * Giá thuê đã bao gồm vệ sinh & bảo quản. Không phát sinh chi phí ẩn.
          </p>
        </div>
      </section>

      <section id="faq" className="scroll-mt-16 bg-[#fbfaf7] py-14">
        <div className="mx-auto max-w-6xl px-6">
          <SectionTitle>Câu hỏi thường gặp</SectionTitle>
          <div className="grid items-center gap-10 lg:grid-cols-[44%_1fr]">
            <div className="relative min-h-72 overflow-hidden rounded-[4px] shadow-sm">
              <Image
                src="/images/bridal-showroom.png"
                alt="Không gian showroom váy cưới sang trọng"
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <details key={faq} className="group rounded-[3px] bg-white px-5 py-4 shadow-sm ring-1 ring-[#eee5d8]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] font-semibold">
                    <span>{index + 1}. {faq}</span>
                    <span className="text-xl text-[#8f6a3c] group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-[13px] leading-6 text-[#6f665c]">
                    Dream & Dress sẽ tư vấn chi tiết theo ngày cưới, dáng người và gói thuê bạn chọn.
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="booking" className="font-booking scroll-mt-16 relative overflow-hidden py-12 text-white">
        <Image
          src="/images/anhbia.png"
          alt="Váy cưới trắng làm nền cho lời kêu gọi đặt lịch"
          fill
          sizes="100vw"
          className="object-cover object-[70%_70%]"
        />
        <div className="absolute inset-0 bg-[#6b4a28]/62" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-between gap-7 px-6 md:flex-row md:items-center">
          <div>
            <h2 className="max-w-2xl text-[44px] font-semibold leading-[1.02] tracking-[0.01em] md:text-[58px]">
              Sẵn sàng tìm chiếc váy dành riêng cho bạn?
            </h2>
            <p className="mt-5 max-w-xl text-[18px] font-medium leading-7 tracking-[0.01em] text-white/92">
              Đặt lịch thử váy miễn phí ngay hôm nay!
            </p>
          </div>
          <TrackingLink
            href="tel:0900225067"
            label="Đặt lịch ngay"
            location="footer_cta"
            className="inline-flex h-14 items-center justify-center rounded-[4px] bg-[#bf9155] px-9 text-[13px] font-bold uppercase tracking-[0.14em] text-white shadow-sm transition hover:bg-[#a77a42]"
          >
            Đặt lịch ngay →
          </TrackingLink>
        </div>
      </section>

      <footer className="bg-white py-10">
        <div className="mx-auto grid max-w-6xl gap-9 px-6 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full border border-[#d8c4a5] font-serif text-xl italic text-[#b58c56]">
                D
              </span>
              <span>
                <span className="block font-serif text-[17px] uppercase tracking-[0.12em]">Dream & Dress</span>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-[#8f806b]">Wedding Rental</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-[14px] leading-6 text-[#6f665c]">
              Địa chỉ cho thuê váy cưới tin cậy, mang đến cho cô dâu những chiếc váy đẹp nhất trong ngày trọng đại.
            </p>
            <div className="mt-5 flex items-center gap-3.5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  target="_blank"
                  rel="noreferrer"
                  className="grid size-10 place-items-center rounded-full border border-[#d8c4a5] bg-white text-[12px] font-bold uppercase tracking-normal text-[#8f6a3c] transition hover:border-[#b58c56] hover:bg-[#b58c56] hover:text-white"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.12em]">Liên kết nhanh</h3>
            <ul className="mt-4 space-y-2 text-[14px] text-[#6f665c]">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="transition hover:text-[#b58c56]">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.12em]">Dịch vụ</h3>
            <ul className="mt-4 space-y-2 text-[14px] text-[#6f665c]">
              <li>Thuê váy cưới</li>
              <li>Thuê vest</li>
              <li>Phụ kiện cưới</li>
              <li>Makeup cô dâu</li>
              <li>Chụp ảnh cưới</li>
            </ul>
          </div>
          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.12em]">Thông tin liên hệ</h3>
            <ul className="mt-4 space-y-2 text-[14px] text-[#6f665c]">
              <li>123 Nguyễn Trãi, Quận 1, TP.HCM</li>
              <li>0901 234 567</li>
              <li>hello@dreamdress.vn</li>
              <li>09:00 - 21:00 (T2 - CN)</li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
}
