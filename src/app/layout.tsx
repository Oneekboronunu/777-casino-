import type { Metadata } from "next";
import "./globals.css";
import RootLayoutClient from "@/components/layout/RootLayoutClient";

export const metadata: Metadata = {
  title: "Aura Casino & Sportsbook — Premier Online Betting & Prediction",
  description:
    "Professional online casino and sportsbook. Play Aviator Crash, Carrom Board Pro, European Roulette, and predict live IPL & UEFA Champions League matches.",
  keywords: [
    "Aura Casino",
    "Sportsbook",
    "Aviator Crash",
    "Carrom Board Betting",
    "Cricket Score Prediction",
    "Football Odds",
    "bKash Casino",
    "Nagad Betting",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0B0F1A] text-[#F3F4F6] min-h-screen">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
