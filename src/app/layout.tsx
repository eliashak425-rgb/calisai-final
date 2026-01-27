import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "CalisAI - AI Calisthenics Coach",
  description: "Master your bodyweight with AI. Get personalized calisthenics workout plans, track your progress on advanced skills like muscle-ups, handstands, and levers. Your AI coach adapts to your goals and recovery.",
  keywords: ["calisthenics", "workout", "AI coach", "muscle up", "handstand", "planche", "bodyweight training", "fitness app"],
  authors: [{ name: "CalisAI" }],
  creator: "CalisAI",
  metadataBase: new URL("https://calisai.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://calisai.com",
    siteName: "CalisAI",
    title: "CalisAI - AI Calisthenics Coach",
    description: "Master your bodyweight with AI. Get personalized calisthenics workout plans and track advanced skills.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CalisAI - AI Calisthenics Coach",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CalisAI - AI Calisthenics Coach",
    description: "Master your bodyweight with AI. Get personalized calisthenics workout plans.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${outfit.variable} ${syne.variable} font-sans`}>
        <SessionProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
