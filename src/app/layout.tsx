import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION, ADSENSE_CLIENT } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import RevealInit from "@/components/RevealInit";
import SiteJsonLd from "@/components/SiteJsonLd";
import Consultant from "@/components/Consultant";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import { getConsultPhones } from "@/lib/consult";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Samsung Galaxy history",
    "Samsung specifications",
    "Galaxy S",
    "Galaxy Note",
    "Galaxy Z Fold",
    "Galaxy Z Flip",
    "all Samsung phones",
    "Samsung models by year",
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        {/* Apply the saved (or system) theme before first paint — no flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia&&matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
        {/* No JS — show content immediately, without the reveal/fade animations */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}.img-fade{opacity:1 !important}`}</style>
        </noscript>
        {ADSENSE_CLIENT && (
          <>
            {/* Warm up the ad host early so the async script resolves faster */}
            <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
            <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
              crossOrigin="anonymous"
            />
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col bg-white">
        <SiteJsonLd />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Consultant phones={getConsultPhones()} />
        <WelcomeOverlay />
        <RevealInit />
      </body>
    </html>
  );
}
