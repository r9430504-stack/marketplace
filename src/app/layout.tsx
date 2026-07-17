import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import TabBar from "@/components/TabBar";
import RevealInit from "@/components/RevealInit";
import MotionInit from "@/components/MotionInit";
import SiteJsonLd from "@/components/SiteJsonLd";
import Consultant from "@/components/Consultant";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import Providers from "@/components/Providers";
import FavoritesSync from "@/components/FavoritesSync";
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
  // Let content extend under the notch / home indicator so env(safe-area-*) works.
  viewportFit: "cover",
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
          <style>{`.reveal,.reveal-up{opacity:1 !important;transform:none !important}.img-fade{opacity:1 !important}.img-skeleton{display:none !important}`}</style>
        </noscript>
      </head>
      {/* Extra bottom space on phones so content clears the bottom tab bar. */}
      <body className="min-h-full flex flex-col pb-[calc(3.75rem+env(safe-area-inset-bottom))] md:pb-0">
        <Providers>
          <MotionInit />
          <SiteJsonLd />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <TabBar />
          <Consultant phones={getConsultPhones()} />
          <WelcomeOverlay />
          <RevealInit />
          <FavoritesSync />
        </Providers>
      </body>
    </html>
  );
}
