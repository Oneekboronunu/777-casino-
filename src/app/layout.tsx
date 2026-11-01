import type { Metadata, Viewport } from "next";
import "./globals.css";
import RootLayoutClient from "@/components/layout/RootLayoutClient";

export const viewport: Viewport = {
  themeColor: "#090D12",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "bet777 — Online Sports Betting, Live Odds & Casino Games",
  description:
    "Official bet777 Sportsbook and Casino. Bet on Cricket, Football, Basketball, Tennis with live in-play odds, plus Casino Originals including Spin to Win, 24 Goti, and Aviator Crash with instant bKash, Nagad & Rocket payouts.",
  keywords: [
    "bet777",
    "777 Sportsbook",
    "Cricket Betting",
    "Live Odds",
    "Spin to Win",
    "Aviator Crash",
    "24 Goti",
    "European Roulette",
    "bKash Sports Betting",
    "Nagad Casino",
  ],
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#090D12] text-[#E2E8F0] min-h-screen antialiased selection:bg-[#95D600] selection:text-black">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
