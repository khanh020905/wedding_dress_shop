import type { Metadata } from "next";
import { Montserrat, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Dream & Dress",
    default: "Dream & Dress | Tiệm váy cưới cao cấp",
  },
  description:
    "Dịch vụ cho thuê váy cưới cao cấp, giá hợp lý, tư vấn tận tâm và đặt lịch thử váy miễn phí tại Dream & Dress.",
  keywords: ["váy cưới", "thuê váy cưới", "váy cưới cao cấp", "chụp ảnh cưới", "dream dress", "wedding rental"],
  authors: [{ name: "Dream & Dress Team" }],
  creator: "Dream & Dress",
  openGraph: {
    title: "Dream & Dress | Tiệm váy cưới cao cấp",
    description: "Bộ sưu tập váy cưới sang trọng, thanh lịch. Đặt lịch thử váy ngay hôm nay.",
    url: "https://dream-dress.vn",
    siteName: "Dream & Dress",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dream & Dress - Váy cưới cao cấp",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dream & Dress | Tiệm váy cưới cao cấp",
    description: "Bộ sưu tập váy cưới sang trọng, thanh lịch. Đặt lịch thử váy ngay hôm nay.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${montserrat.variable} ${playfairDisplay.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

