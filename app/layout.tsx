import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sms.deevishub.com"),
  title: {
    default: "Deevishub | Enterprise DLT SMS & Bulk Messaging",
    template: "%s | Deevishub",
  },
  description:
    "Deevishub provides enterprise DLT SMS, bulk messaging, and campaign delivery tools with reliable routing, compliance support, and developer-friendly APIs.",
  viewport: "width=device-width, initial-scale=1",
  keywords: [
    "DLT messaging",
    "bulk SMS",
    "enterprise SMS",
    "OTP SMS",
    "transactional SMS",
    "SMS API",
    "SMS gateway",
    "DLT compliance",
    "message delivery",
  ],
  authors: [{ name: "Deevishub", url: "https://sms.deevishub.com" }],
  openGraph: {
    title: "Deevishub | Enterprise DLT SMS & Bulk Messaging",
    description:
      "Enterprise DLT SMS and bulk messaging services with reliable routing, delivery visibility, and compliance support.",
    type: "website",
    url: "https://sms.deevishub.com",
    siteName: "Deevishub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deevishub | Enterprise DLT SMS & Bulk Messaging",
    description:
      "Enterprise DLT SMS and bulk messaging services with reliable routing, delivery visibility, and compliance support.",
    site: "@deevishub",
    creator: "@deevishub",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-slate-900">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
