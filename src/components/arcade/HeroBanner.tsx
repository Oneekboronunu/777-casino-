"use client";

import React, { useState, useEffect } from "react";
import { Play, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import sound from "@/lib/sound";

interface HeroBannerProps {
  onPlayClick?: () => void;
}

const SLIDES = [
  {
    id: "slide-1",
    mainTitle: "ENTER THE WORLD",
    subTitle: "OF ARCADE",
    tagline: "100% Free-to-play classic & modern arcade games with FreePlay points",
    ctaText: "PLAY",
  },
  {
    id: "slide-2",
    mainTitle: "DISCOVER NEW",
    subTitle: "ARCADE HITS",
    tagline: "Explore Big Bass Splash, Sugar Rush, and Retro 777 Slots today!",
    ctaText: "EXPLORE",
  },
  {
    id: "slide-3",
    mainTitle: "DAILY FREEPLAY",
    subTitle: "POINTS DROP",
    tagline: "Claim 1,000 free bonus points every day to spin and play risk-free!",
    ctaText: "CLAIM NOW",
  },
];

export default function HeroBanner({ onPlayClick }: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto advance carousel every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 pb-2">
      {/* Main Banner Card */}
      <div className="relative w-full h-[290px] sm:h-[320px] rounded-3xl overflow-hidden shadow-xl border border-[#91D2BC] flex flex-col md:flex-row select-none bg-[#303030]">
        {/* ========================================================
            LEFT COLUMN (~58%): Dark Charcoal with Organic Curve
            ======================================================== */}
        <div className="relative z-10 w-full md:w-[58%] h-full p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-[#303030]">
          {/* Subtle starburst / grid glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(255,229,139,0.08),transparent_60%)] pointer-events-none" />

          {/* Text Content */}
          <div className="space-y-1 sm:space-y-2 max-w-lg">
            <h1 className="text-2xl sm:text-4xl md:text-[42px] font-black tracking-tight leading-none text-[#FFE58B] drop-shadow-[2px_3px_0px_#1A1A1A]">
              {slide.mainTitle}
            </h1>
            <h2 className="text-xl sm:text-3xl md:text-[34px] font-black tracking-tight leading-none text-[#C33355]">
              {slide.subTitle}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 font-medium pt-1 max-w-md line-clamp-2">
              {slide.tagline}
            </p>
          </div>

          {/* CTA Button: PLAY */}
          <div className="pt-4">
            <button
              onClick={() => {
                sound.playWin();
                if (onPlayClick) onPlayClick();
              }}
              className="px-8 sm:px-10 py-2.5 sm:py-3 rounded-full bg-[#C33355] hover:bg-[#AA2443] text-white font-black text-xs sm:text-sm uppercase tracking-widest transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-[0_4px_12px_rgba(195,51,85,0.4)] flex items-center space-x-2"
            >
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
              <span>{slide.ctaText}</span>
            </button>
          </div>
        </div>

        {/* Curved Divider Mask (between dark left and green right) */}
        <div className="hidden md:block absolute top-0 bottom-0 left-[54%] w-16 z-10 pointer-events-none">
          <svg
            className="w-full h-full text-[#303030] fill-current"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M0,0 L100,0 C60,40 60,60 100,100 L0,100 Z" />
          </svg>
        </div>

        {/* ========================================================
            RIGHT COLUMN (~42%): Vivid Arcade Scene with Portals
            ======================================================== */}
        <div className="relative w-full md:w-[46%] md:-ml-[4%] h-full bg-gradient-to-tr from-[#14532D] via-[#15803D] to-[#22C55E] overflow-hidden flex items-center justify-center p-4">
          {/* Neon Lightning & Energy Sparks */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.15),transparent_70%)] pointer-events-none" />

          {/* Floating Neon Lightning SVGs */}
          <div className="absolute top-4 left-6 text-yellow-300 opacity-90 animate-pulse">
            ⚡
          </div>
          <div className="absolute bottom-6 right-10 text-emerald-200 opacity-80 text-xl animate-bounce">
            ⚡
          </div>
          <div className="absolute top-12 right-24 text-lime-300 opacity-70">
            ✦
          </div>

          {/* Layered Circular Preview Portals (Matching screenshot!) */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* 1. Left Portal: Aviator Biplane */}
            <div className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-28 sm:w-36 h-28 sm:h-36 rounded-full bg-gradient-to-br from-red-600 via-rose-700 to-red-950 border-3 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.6)] flex flex-col items-center justify-center overflow-hidden transform -rotate-6 hover:scale-105 transition">
              <span className="text-3xl sm:text-4xl">✈️</span>
              <span className="text-[10px] sm:text-xs font-black tracking-wider text-white uppercase mt-1 drop-shadow">
                Aviator
              </span>
            </div>

            {/* 2. Center Portal: Big Bass Crash Fisherman (Prominent!) */}
            <div className="relative z-20 w-36 sm:w-48 h-36 sm:h-48 rounded-full bg-gradient-to-tr from-cyan-700 via-teal-600 to-emerald-500 border-4 border-yellow-300 shadow-[0_0_25px_rgba(253,224,71,0.7)] flex flex-col items-center justify-center overflow-hidden hover:scale-105 transition">
              {/* Fisherman Silhouette / Icon */}
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

            {/* 3. Right Portal: High Flyer Golden Plane */}
            <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-28 sm:w-36 h-28 sm:h-36 rounded-full bg-gradient-to-br from-indigo-800 via-purple-700 to-amber-700 border-3 border-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.6)] flex flex-col items-center justify-center overflow-hidden transform rotate-6 hover:scale-105 transition">
              <span className="text-3xl sm:text-4xl">🛩️</span>
              <span className="text-[10px] sm:text-xs font-black tracking-wider text-yellow-300 uppercase mt-1 drop-shadow">
                HIGH FLYER
              </span>
            </div>

            {/* Flying Green Bass Fish */}
            <div className="absolute bottom-2 left-20 z-30 animate-pulse">
              <span className="text-2xl sm:text-3xl drop-shadow">🐟</span>
            </div>
            <div className="absolute top-3 right-16 z-30 animate-bounce">
              <span className="text-xl sm:text-2xl drop-shadow">🎣</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          CAROUSEL INDICATOR DOTS (Matching screenshot ● ● ●)
          ======================================================== */}
      <div className="flex items-center justify-center space-x-2 pt-3">
        {SLIDES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => {
              setCurrentSlide(idx);
              sound.playChipClick();
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
              currentSlide === idx
                ? "bg-[#C33355] w-6 shadow-sm"
                : "bg-[#A6D5C2] hover:bg-[#86BEA9]"
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
