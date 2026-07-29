import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: {
    default: "SunX PV Technology | Solar Inverters & Lithium Batteries",
    template: "%s | SunX PV Technology",
  },
  description:
    "SunX PV Technology provides high-quality solar inverters and lithium batteries for homes, businesses, and industries across Pakistan.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/images/sunx-logo.png",
    shortcut: "/images/sunx-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
