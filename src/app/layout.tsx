import type { Metadata, Viewport } from "next";
import { Inter, Bungee, Playfair_Display } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "@/components/layout/RootLayoutClient";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const bungee = Bungee({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-retro",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

export const viewport: Viewport = {
  themeColor: "#120B10",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "777 Casino & Sportsbook — Premier Online Gaming & Prediction",
  description:
    "Professional online casino and sportsbook. Play Aviator Crash, Carrom Board Pro, European Roulette 3D, and predict live IPL & UEFA matches with instant bKash, Nagad & Rocket payouts.",
  keywords: [
    "777 Casino",
    "Sportsbook",
    "Aviator Crash",
    "European Roulette 3D",
    "Carrom Board Betting",
    "Cricket Score Prediction",
    "Football Odds",
    "bKash Casino",
    "Nagad Betting",
    "Rocket Casino",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${bungee.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#120B10] text-[#F8F4EE] min-h-screen antialiased selection:bg-[#BA2649] selection:text-[#FFDE59]">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
