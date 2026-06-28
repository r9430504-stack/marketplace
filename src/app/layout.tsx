import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "StoreBuilder — создай интернет-магазин за 5 минут",
    template: "%s — StoreBuilder",
  },
  description:
    "StoreBuilder — бесплатный конструктор интернет-магазинов. Выберите дизайн, добавьте товары с фото и видео, укажите цены и получите готовый сайт-магазин за 5 минут.",
  keywords: ["конструктор магазинов", "создать интернет-магазин", "онлайн магазин", "storebuilder", "сайт магазин бесплатно"],
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "StoreBuilder — создай интернет-магазин за 5 минут",
    description: "Бесплатный конструктор интернет-магазинов: дизайн, товары, фото и видео — готовый сайт за 5 минут.",
    url: SITE_URL,
    siteName: "StoreBuilder",
    type: "website",
    locale: "ru_RU",
  },
  robots: { index: true, follow: true },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
  },
};

// Ставит тему до отрисовки страницы, чтобы не было вспышки светлого фона.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${geistSans.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-[#0b0f17]">{children}</body>
    </html>
  );
}
