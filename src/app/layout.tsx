import type { Metadata, Viewport } from "next";
import "./globals.css";
import RootLayoutClient from "@/components/layout/RootLayoutClient";

export const viewport: Viewport = {
  themeColor: "#91D2BC",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "777 Retro Arcade — Premium Free-to-Play Arcade Gaming",
  description:
    "Explore the world of arcade entertainment. Play Big Bass Splash, Legacy of Dead, Sugar Rush, Aviator Crash, European Roulette and classic arcade games with virtual FreePlay points. 100% free, no real-money gambling.",
  keywords: [
    "Retro Arcade",
    "777 Arcade",
    "Free-to-Play Games",
    "Arcade Slots",
    "Big Bass Splash",
    "Sugar Rush",
    "Virtual Points Gaming",
    "Retro Gaming Platform",
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Bungee&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#C4E4CB] text-[#40243B] min-h-screen antialiased selection:bg-[#C33355] selection:text-white">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
