"use client";

import React, { useState, useEffect } from "react";
import sound from "@/lib/sound";

export default function CookieConsentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const consent = localStorage.getItem("777_arcade_cookie_consent");
        if (!consent) {
          // Show popup after 1s
          const timer = setTimeout(() => setIsOpen(true), 800);
          return () => clearTimeout(timer);
        }
      }
    } catch {}
  }, []);

  const handleAcceptAll = () => {
    sound.playChipClick();
    try {
      localStorage.setItem(
        "777_arcade_cookie_consent",
        JSON.stringify({ essential: true, analytics: true, marketing: true, timestamp: Date.now() })
      );
    } catch {}
    setIsOpen(false);
  };

  const handleAcceptEssential = () => {
    sound.playChipClick();
    try {
      localStorage.setItem(
        "777_arcade_cookie_consent",
        JSON.stringify({ essential: true, analytics: false, marketing: false, timestamp: Date.now() })
      );
    } catch {}
    setIsOpen(false);
  };

  const handleSaveCustom = () => {
    sound.playChipClick();
    try {
      localStorage.setItem(
        "777_arcade_cookie_consent",
        JSON.stringify({
          essential: true,
          analytics: analyticsEnabled,
          marketing: marketingEnabled,
          timestamp: Date.now(),
        })
      );
    } catch {}
    setShowCustomize(false);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 sm:bottom-6 inset-x-0 z-50 flex items-center justify-center px-3 sm:px-4 pointer-events-none select-none">
      <div className="pointer-events-auto w-full max-w-2xl bg-[#FFF6D4] border-2 border-[#EADBBE] rounded-3xl p-5 sm:p-6 shadow-2xl cookie-popup-shadow text-[#40243B] space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
        {/* Main Content */}
        <div className="space-y-1.5">
          <h4 className="text-sm sm:text-base font-black text-black tracking-tight">
            This Website uses cookies
          </h4>
          <p className="text-xs sm:text-[13px] text-gray-700 leading-relaxed">
            We use cookies to improve your experience, tailor content and optimize functionality.
            For more information:{" "}
            <a href="#cookie-policy" className="underline font-semibold hover:text-[#C33355]">
              Cookie Policy
            </a>
          </p>
        </div>

        {/* Customization Panel */}
        {showCustomize && (
          <div className="p-3 bg-white/70 rounded-2xl border border-[#EADBBE] text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold">Essential Cookies</div>
                <div className="text-[10px] text-gray-500">Required for website security and basic arcade operations.</div>
              </div>
              <span className="text-[11px] font-bold text-gray-400">Always Active</span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-gray-200">
              <div>
                <div className="font-bold">Gameplay Analytics</div>
                <div className="text-[10px] text-gray-500">Helps us understand which arcade mini-games are most popular.</div>
              </div>
              <input
                type="checkbox"
                checked={analyticsEnabled}
                onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                className="w-4 h-4 text-[#C33355] rounded accent-[#C33355]"
              />
            </div>
          </div>
        )}

        {/* Action Buttons Row (Exact match to screenshot!) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          {/* Customize Cookies Link */}
          <button
            onClick={() => {
              sound.playChipClick();
              setShowCustomize(!showCustomize);
            }}
            className="text-xs font-bold text-black underline hover:text-[#C33355] transition self-start sm:self-center"
          >
            {showCustomize ? "Hide Customization" : "Customize Cookies"}
          </button>

          {/* Buttons: ACCEPT ESSENTIAL COOKIES ONLY & ACCEPT */}
          <div className="flex flex-wrap items-center justify-end gap-2 w-full sm:w-auto">
            {showCustomize ? (
              <button
                onClick={handleSaveCustom}
                className="px-5 py-2.5 rounded-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-black text-xs uppercase tracking-wider transition shadow-sm active:scale-95"
              >
                Save Preferences
              </button>
            ) : (
              <>
                <button
                  onClick={handleAcceptEssential}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#C33355] hover:bg-[#AA2443] text-white font-black text-[11px] sm:text-xs uppercase tracking-wider transition shadow-sm active:scale-95"
                >
                  ACCEPT ESSENTIAL COOKIES ONLY
                </button>

                <button
                  onClick={handleAcceptAll}
                  className="px-5 sm:px-7 py-2 sm:py-2.5 rounded-full bg-[#C33355] hover:bg-[#AA2443] text-white font-black text-[11px] sm:text-xs uppercase tracking-wider transition shadow-sm active:scale-95"
                >
                  ACCEPT
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
