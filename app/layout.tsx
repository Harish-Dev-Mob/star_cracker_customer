import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/ui/Toast";
import AgeGate from "@/components/ui/AgeGate";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "StarCracker — Premium Fireworks & Sparklers",
    template: "%s | StarCracker",
  },
  description:
    "Shop premium quality firecrackers, sparklers, rockets, and combo packs for every festival. Safe, vibrant, and delivered to your door.",
  keywords: ["firecrackers", "sparklers", "fireworks", "diwali", "rockets", "fountains", "buy online"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://star-cracker-customer.onrender.com",
    siteName: "StarCracker",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
          <SessionProvider>
            <AgeGate />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <ToastProvider />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
