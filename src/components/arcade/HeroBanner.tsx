"use client";

import React, { useState, useEffect } from "react";
import { Play, Sparkles, ChevronLeft, ChevronRight, Info, Check, Copy } from "lucide-react";
import confetti from "canvas-confetti";
import { useUserStore } from "@/lib/store/useUserStore";
import { useArcadeStore } from "@/lib/store/useArcadeStore";
import sound from "@/lib/sound";

interface HeroBannerProps {
  onPlayClick?: () => void;
}

export default function HeroBanner({ onPlayClick }: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { openAuthModal, showNotification } = useUserStore();
  const { addFreePlayPoints, setIsHelpModalOpen } = useArcadeStore();
  const [copiedCode, setCopiedCode] = useState(false);

  // 2 slides matching the exact 2 screenshots provided
  const totalSlides = 2;

  // Auto advance every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 7000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const prevSlide = () => {
    sound.playChipClick();
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const nextSlide = () => {
    sound.playChipClick();
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handleJoinNow = () => {
    sound.playWin();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#C33355", "#FFE066", "#0D9488", "#FFFFFF"],
      });
    } catch {}
    addFreePlayPoints(5000);
    openAuthModal("REGISTER");
    showNotification("Welcome777 Promocode Applied! +5,000 Bonus Points Granted", "SUCCESS");
  };

  const handleCopyPromo = () => {
    sound.playChipClick();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText("Welcome777");
    }
    setCopiedCode(true);
    showNotification("Copied promocode: Welcome777", "INFO");
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 pb-2 select-none">
      {/* Outer Banner Frame */}
      <div className="relative w-full h-[280px] sm:h-[310px] md:h-[320px] rounded-3xl overflow-hidden shadow-xl border border-[#91D2BC] flex select-none">
        
        {/* ========================================================
            SLIDE 0: "ENTER THE WORLD OF ARCADE" (Screenshot 1)
            ======================================================== */}
        <div
          className={`absolute inset-0 w-full h-full flex flex-col md:flex-row transition-opacity duration-700 ${
            currentSlide === 0 ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          {/* Left Column (~56%): Charcoal Background */}
          <div className="relative z-10 w-full md:w-[56%] h-full p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-[#303030]">
            <div className="space-y-1.5 max-w-lg">
              <h1 className="text-2xl sm:text-4xl md:text-[44px] font-black tracking-tight leading-none text-[#FFE58B] drop-shadow-[2px_3px_0px_#141414]">
                ENTER THE WORLD
              </h1>
              <h2 className="text-xl sm:text-3xl md:text-[34px] font-black tracking-tight leading-none text-[#C33355]">
                OF ARCADE
              </h2>
              <p className="text-xs text-gray-400 font-medium pt-1 hidden sm:block">
                100% Free-to-play retro slots, crash flights & casino table hits.
              </p>
            </div>

            {/* Pink PLAY Pill Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  sound.playWin();
                  if (onPlayClick) onPlayClick();
                }}
                className="px-8 sm:px-10 py-2 sm:py-2.5 rounded-full bg-[#C33355] hover:bg-[#AA2443] text-white font-black text-xs uppercase tracking-widest transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-[0_4px_12px_rgba(195,51,85,0.4)] flex items-center space-x-1.5"
              >
                <span>PLAY</span>
              </button>
            </div>
          </div>

          {/* Organic Curved Divider between Charcoal and Green */}
          <div className="hidden md:block absolute top-0 bottom-0 left-[52%] w-16 z-10 pointer-events-none">
            <svg
              className="w-full h-full text-[#303030] fill-current"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path d="M0,0 L100,0 C60,40 60,60 100,100 L0,100 Z" />
            </svg>
          </div>

          {/* Right Column (~48%): Green Cosmic Arcade Scene */}
          <div className="relative w-full md:w-[48%] md:-ml-[4%] h-full bg-gradient-to-tr from-[#14532D] via-[#15803D] to-[#22C55E] overflow-hidden flex items-center justify-center p-4">
            {/* Ambient Lighting & Sparks */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.2),transparent_70%)] pointer-events-none" />

            {/* Floating Lightning and Speedboats in Background */}
            <div className="absolute top-2 left-6 text-yellow-300 opacity-90 animate-pulse text-lg">
              ⚡
            </div>
            <div className="absolute top-2 right-8 text-white/90 text-sm font-black">
              🚤 💨
            </div>
            <div className="absolute bottom-5 right-8 text-emerald-200 opacity-80 text-xl animate-bounce">
              ⚡
            </div>

            {/* Circular Preview Portals (Aviator, Big Bass Crash, High Flyer) */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* 1. Left Portal: Aviator */}
              <div className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 w-28 sm:w-36 h-28 sm:h-36 rounded-full bg-gradient-to-br from-red-600 via-rose-700 to-red-950 border-3 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.6)] flex flex-col items-center justify-center overflow-hidden transform -rotate-6 hover:scale-105 transition">
                <span className="text-3xl sm:text-4xl">✈️</span>
                <span className="text-[10px] sm:text-xs font-black tracking-wider text-white uppercase mt-1 drop-shadow">
                  Aviator
                </span>
              </div>

              {/* 2. Center Portal: Big Bass Crash Fisherman */}
              <div className="relative z-20 w-36 sm:w-48 h-36 sm:h-48 rounded-full bg-gradient-to-tr from-cyan-700 via-teal-600 to-emerald-500 border-4 border-yellow-300 shadow-[0_0_25px_rgba(253,224,71,0.7)] flex flex-col items-center justify-center overflow-hidden hover:scale-105 transition">
                <div className="relative flex flex-col items-center justify-center">
                  <span className="text-4xl sm:text-5xl">🤠</span>
                  <span className="text-[11px] sm:text-sm font-black text-yellow-200 tracking-wider uppercase text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mt-0.5">
                    BIG BASS
                  </span>
                  <span className="text-[9px] font-black text-white bg-red-600 px-2 py-0.2 rounded-full uppercase tracking-widest">
                    CRASH
                  </span>
                </div>
              </div>

              {/* 3. Right Portal: High Flyer */}
              <div className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 w-28 sm:w-36 h-28 sm:h-36 rounded-full bg-gradient-to-br from-indigo-800 via-purple-700 to-amber-700 border-3 border-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.6)] flex flex-col items-center justify-center overflow-hidden transform rotate-6 hover:scale-105 transition">
                <span className="text-3xl sm:text-4xl">🛩️</span>
                <span className="text-[10px] sm:text-xs font-black tracking-wider text-yellow-300 uppercase mt-1 drop-shadow">
                  HIGH FLYER
                </span>
              </div>

              {/* Jumping Bass Fish */}
              <div className="absolute bottom-1 left-20 z-30 animate-pulse">
                <span className="text-2xl sm:text-3xl drop-shadow">🐟</span>
              </div>
              <div className="absolute top-2 right-20 z-30 animate-bounce">
                <span className="text-xl sm:text-2xl drop-shadow">🎣</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            SLIDE 1: "DEPOSIT $20 & GET A WELCOME BONUS" (Screenshot 2)
            With Glorious GLOWING "JOIN NOW" Button
            ======================================================== */}
        <div
          className={`absolute inset-0 w-full h-full flex flex-col md:flex-row transition-opacity duration-700 ${
            currentSlide === 1 ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          {/* Desert Road & Vegas Landscape Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7EACD] via-[#EEDBB5] to-[#F1DFC0] overflow-hidden">
            {/* Distant desert haze / sunburst */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_rgba(255,255,255,0.7),transparent_70%)] pointer-events-none" />

            {/* Straight Desert Road Perspective stretching into horizon */}
            <div className="absolute bottom-0 left-[35%] sm:left-[45%] w-24 sm:w-36 h-36 border-x-4 border-dashed border-[#D2BF9C]/50 [clip-path:polygon(40%_0%,60%_0%,100%_100%,0%_100%)] bg-[#D6C4A3]/40 flex flex-col items-center justify-end pb-2">
              {/* White/Pink Convertible Retro Car driving into the desert */}
              <div className="text-3xl sm:text-4xl transform -translate-y-1 animate-pulse">
                🚗
              </div>
            </div>

            {/* Las Vegas Welcome Sign Silhouette in distance */}
            <div className="absolute top-6 left-[42%] sm:left-[47%] transform -translate-x-1/2 flex flex-col items-center opacity-85">
              <div className="px-2 py-0.5 rounded-md bg-[#FFF6D4] border border-[#DECF9E] shadow-xs text-[8px] font-black text-[#C33355] uppercase tracking-wider text-center">
                ★ LAS VEGAS ★
              </div>
              <div className="w-0.5 h-6 bg-[#C0B08E]" />
            </div>
          </div>

          {/* Left Text Content & Glowing JOIN NOW Button */}
          <div className="relative z-10 w-full md:w-[55%] h-full p-6 sm:p-8 md:p-10 flex flex-col justify-between">
            {/* Headings with 3D Gold Styling matching screenshot */}
            <div className="space-y-1 max-w-lg">
              <h2 className="text-xl sm:text-3xl md:text-[36px] font-black tracking-tight leading-tight text-gold-3d font-sans">
                Deposit $20 & Get A Welcome Bonus
              </h2>
              <h3 className="text-base sm:text-2xl font-black text-[#40243B] tracking-tight">
                Of Up To $200
              </h3>
            </div>

            {/* Glowing Action Console */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center space-x-3">
                {/* 🌟 GLOWING JOIN NOW BUTTON 🌟 */}
                <button
                  onClick={handleJoinNow}
                  className="glow-join-now relative px-7 sm:px-9 py-2.5 rounded-full bg-[#C33355] hover:bg-[#AA2443] text-white font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center space-x-1.5 active:scale-95"
                >
                  <span>JOIN NOW</span>
                </button>

                {/* [ i ] Info Box with Teal Outline */}
                <button
                  onClick={() => setIsHelpModalOpen(true)}
                  className="w-7 h-7 rounded-lg border-1.5 border-[#0D9488] bg-white/70 hover:bg-white text-[#0D9488] flex items-center justify-center font-bold text-xs shadow-xs transition"
                  title="Terms & Conditions"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>

                <span className="text-[10px] font-bold text-[#40243B]/80">
                  T&C Apply
                </span>
              </div>

              {/* Promocode Underline Link */}
              <div className="pt-1">
                <button
                  onClick={handleCopyPromo}
                  className="text-xs font-black text-[#C33355] hover:underline flex items-center space-x-1"
                >
                  <span>Promocode: </span>
                  <span className="underline font-mono">Welcome777</span>
                  {copiedCode ? (
                    <Check className="w-3 h-3 text-emerald-600 inline ml-1" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-500 inline ml-1" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Vintage Vegas Casino Pinup Girl & Roulette Art */}
          <div className="relative z-10 w-full md:w-[45%] h-full flex items-center justify-end pr-4 sm:pr-8 overflow-hidden pointer-events-none">
            {/* Spinning Golden Roulette Wheel & Marquee 7 */}
            <div className="relative flex items-center justify-center">
              {/* Roulette Wheel */}
              <div className="relative w-36 sm:w-48 h-36 sm:h-48 rounded-full border-4 border-amber-600 bg-gradient-to-tr from-amber-900 via-stone-800 to-amber-700 shadow-2xl flex items-center justify-center animate-[spin_20s_linear_infinite]">
                <div className="w-28 sm:w-36 h-28 sm:h-36 rounded-full border-2 border-dashed border-yellow-400/80 flex items-center justify-center">
                  <span className="text-4xl sm:text-5xl">🎡</span>
                </div>
              </div>

              {/* Glowing Marquee Neon 7 */}
              <div className="absolute -top-3 left-0 z-20 px-3 py-1 rounded-xl bg-gradient-to-b from-amber-400 to-yellow-600 border-2 border-yellow-200 shadow-[0_0_20px_rgba(250,204,21,0.8)] font-black text-2xl text-white">
                7
              </div>

              {/* Vintage Pinup Casino Girl Silhouette Motif */}
              <div className="absolute -bottom-2 right-2 z-20 flex flex-col items-center">
                <span className="text-5xl sm:text-7xl filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                  💃
                </span>
              </div>

              {/* Red Casino Dice with White Dots & Cherries */}
              <div className="absolute -bottom-2 left-6 z-30 flex items-center space-x-1 animate-bounce">
                <span className="text-3xl filter drop-shadow">🎲</span>
                <span className="text-2xl filter drop-shadow">🍒</span>
              </div>

              {/* Floating Golden Coin Shower */}
              <div className="absolute top-2 right-8 z-30 text-yellow-500 text-xl animate-pulse">
                ✨ 🪙
              </div>

              {/* Retro 3D White "Casino" Typography Script */}
              <div className="absolute bottom-2 -left-4 z-30 rotate-[-12deg]">
                <span className="font-serif italic font-black text-3xl sm:text-4xl text-white drop-shadow-[2px_3px_0px_#C33355]">
                  Casino
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            FAR LEFT & FAR RIGHT CAROUSEL NAVIGATION ARROWS (< and >)
            Matching the edge buttons in the screenshots
            ======================================================== */}
        <button
          onClick={prevSlide}
          className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-black/40 hover:bg-black/70 border border-white/50 text-white flex items-center justify-center transition shadow-lg active:scale-90"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 -translate-x-0.5" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-black/40 hover:bg-black/70 border border-white/50 text-white flex items-center justify-center transition shadow-lg active:scale-90"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 translate-x-0.5" />
        </button>
      </div>

      {/* ========================================================
          CAROUSEL INDICATOR CAPSULE (Centered underneath banner: ● ●)
          Matches the dark 2-dot pill in both screenshots
          ======================================================== */}
      <div className="flex items-center justify-center pt-2.5">
        <div className="bg-[#40243B] px-2.5 py-1 rounded-full flex items-center space-x-1.5 shadow-xs border border-[#5A3553]/60">
          {[0, 1].map((idx) => (
            <button
              key={idx}
              onClick={() => {
                sound.playChipClick();
                setCurrentSlide(idx);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx
                  ? "bg-[#FFE58B] scale-125"
                  : "bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
