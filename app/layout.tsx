import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Providers from "./providers";
import { Toaster } from "sonner";
import Head from "next/head";

const outfits = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const siteUrl = "https://nuvylux.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nuvylux — Beauty, Fashion & Innovation",
    template: "%s | Nuvylux",
  },
  description:
    "Nuvylux is a visionary platform blending artistry, culture, and technology. Book verified beauty professionals, shop curated fashion, and explore AI-powered consultations.",
  keywords: [
    "beauty booking",
    "fashion marketplace",
    "lash technicians",
    "nail artists",
    "hair stylists",
    "makeup artists",
    "AI skin analysis",
    "luxury beauty",
    "Nuvylux",
  ],
  authors: [{ name: "Nuvylux", url: siteUrl }],
  creator: "Nuvylux",
  publisher: "Nuvylux",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Nuvylux",
    title: "Nuvylux — Beauty, Fashion & Innovation",
    description:
      "Book verified beauty professionals, shop curated fashion, and explore AI-powered consultations on Nuvylux.",
    images: [
      {
        url: "/assets/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nuvylux — Redefining Beauty, Fashion & Innovation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nuvylux — Beauty, Fashion & Innovation",
    description:
      "Book verified beauty professionals, shop curated fashion, and explore AI-powered consultations on Nuvylux.",
    images: ["/assets/images/og-image.jpg"],
    creator: "@nuvylux",
  },
  icons: {
    icon: "/assets/images/favicon.ico",
    shortcut: "/assets/images/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta property="og:image" content="/assets/images/og-image.jpg" />
        <meta property="og:image" content="/assets/images/og-image.jpg" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        />
        <meta
          data-n-head="ssr"
          data-hid="viewport"
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1"
        />
      </Head>
      <body className={`${outfits.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
            <Toaster position="bottom-center" />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
