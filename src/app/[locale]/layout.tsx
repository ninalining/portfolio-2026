import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { defaultLocale, isSupportedLocale, locales, ogLocaleMap } from "@/i18n/routing";
import type { LocaleLayoutProps } from "@/types/locale";
import { Navigation } from "@/components/layout/Navigation";
import "../globals.css";

export function generateStaticParams(): { locale: string }[] {
  return locales.map((locale) => ({ locale }));
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "Nina Li — Full-Stack Engineer",
    template: "%s | Nina Li",
  },
  description:
    "Portfolio of Nina Li — Full-Stack Engineer specialising in Next.js, TypeScript, and performance-driven web development.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: ogLocaleMap[defaultLocale],
    url: siteUrl,
    siteName: "Nina Li",
    title: "Nina Li — Full-Stack Engineer",
    description:
      "Full-Stack Engineer specialising in Next.js, TypeScript, and performance-driven web development.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nina Li — Full-Stack Engineer",
    description:
      "Full-Stack Engineer specialising in Next.js, TypeScript, and performance-driven web development.",
  },
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
            <Navigation />
            {children}
          </NextIntlClientProvider>
      </body>
    </html>
  );
}
