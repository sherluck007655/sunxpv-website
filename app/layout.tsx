import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sunxpv.com"),
  title: {
    default: "SunX PV Technology | Solar Inverters & Lithium Batteries",
    template: "%s | SunX PV Technology",
  },
  description:
    "SunX PV Technology provides high-quality solar inverters and lithium batteries for homes, businesses, and industries across Pakistan.",
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "SunX PV Technology",
    locale: "en_PK",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
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
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SunX PV Technology",
    url: "https://sunxpv.com",
    logo: "https://sunxpv.com/images/sunx-logo.png",
    email: "info@sunxpv.com",
    telephone: "+92-342-9470099",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Office 15, Peshawar Business Center, Ring Road",
      addressLocality: "Peshawar",
      addressRegion: "Khyber Pakhtunkhwa",
      addressCountry: "PK",
    },
  };
  return (
    <html lang="en">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </body>
    </html>
  );
}
