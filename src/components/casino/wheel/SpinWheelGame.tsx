"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Coins,
  Shield,
  Volume2,
  VolumeX,
  Sparkles,
  Trophy,
  RotateCw,
} from "lucide-react";
import confetti from "canvas-confetti";
import sound from "@/lib/sound";
import { useUserStore } from "@/lib/store/useUserStore";
import { WheelAdminConfig, WheelSegment } from "@/lib/wheel/types";
import {
  getWheelConfig,
  recordSpin,
} from "@/lib/wheel/storage";
import {
  selectWinningSegment,
  calculateDestinationAngle,
  easeOutCasino,
} from "@/lib/wheel/engine";
import WheelCanvas from "./WheelCanvas";
import AdminPanelModal from "./AdminPanelModal";

const BET_PRESETS = [50, 100, 250, 500];

export default function SpinWheelGame() {
  const { user, addCoins, showNotification } = useUserStore();

  // Wheel configuration & state
  const [config, setConfig] = useState<WheelAdminConfig>(() => getWheelConfig());
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedBet, setSelectedBet] = useState(100);

  // Rotation & Animation state
  const [rotationAngle, setRotationAngle] = useState(0);
  const [pointerDeflection, setPointerDeflection] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());

  // Result & Celebration Modal
  const [winResult, setWinResult] = useState<{
    segment: WheelSegment;
    reward: number;
    wasOverridden: boolean;
  } | null>(null);

  // Animation refs
  const animFrameRef = useRef<number | null>(null);
  const lastDividerAngleRef = useRef<number>(0);
  const pointerWobbleRef = useRef<number>(0);

  // Keep live user coins or fallback to default
  const userCoins = user ? user.coins ?? 999 : 999;

  // Sync config from storage on load
  useEffect(() => {
    const loaded = getWheelConfig();
    setConfig(loaded);
    setSelectedBet(loaded.spinCost || 100);
  }, []);

  const toggleSound = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  // ==========================================
  // SPIN LOGIC & PHYSICS ANIMATION
  // ==========================================
  const handleSpin = useCallback(() => {
    if (isSpinning) return;

    // Check balance
    if (userCoins < selectedBet) {
      showNotification("Insufficient coins! Please deposit or buy coins.", "ERROR");
      return;
    }

    // 1. Deduct Bet Cost immediately
    if (user) {
      addCoins(-selectedBet, `Spin to Win: Bet ${selectedBet} Coins`);
    }

    setIsSpinning(true);
    setWinResult(null);
    sound.playChipClick();

    // 2. BACKEND / CONTROLLER: Pre-determine winning segment BEFORE animation begins!
    const { segment, index, wasOverridden } = selectWinningSegment(
      config.segments,
      config.nextSpinOverrideSegmentId
    );

    // 3. Compute exact destination angle to land on targetIndex
    const startAngle = rotationAngle;
    const targetAngle = calculateDestinationAngle(
      index,
      config.segments.length,
      startAngle,
      6, // Min full revolutions
      9  // Max full revolutions
    );

    const totalDelta = targetAngle - startAngle;
    const durationMs = 5000; // 5.0 seconds smooth deceleration
    const startTime = performance.now();

    const arcDeg = 360 / config.segments.length;
    lastDividerAngleRef.current = startAngle;

    // 4. Smooth Animation Loop (60 FPS, easing, and pointer clapper ticks)
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const easedProgress = easeOutCasino(progress);

      const currentAngle = startAngle + totalDelta * easedProgress;
      setRotationAngle(currentAngle);

      // --- Pointer Clapper Physics & Audio Tick ---
      // Check if a segment divider line passed under pointer (270 deg)
      const prevNorm = lastDividerAngleRef.current;
      const anglePassed = currentAngle - prevNorm;

      if (anglePassed >= arcDeg * 0.95) {
        lastDividerAngleRef.current = currentAngle;
        sound.playWheelTick();

        // Pointer kick deflection (wobble angle based on velocity)
        const velocity = (1 - progress);
        pointerWobbleRef.current = -14 * velocity;
      }

      // Spring damping recovery for pointer
      pointerWobbleRef.current *= 0.85;
      setPointerDeflection(pointerWobbleRef.current);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete!
        setPointerDeflection(0);
        setIsSpinning(false);

        // 5. Calculate final payout
        const reward = segment.rewardValue || 0;
        if (reward > 0) {
          if (user) {
            addCoins(reward, `Spin to Win: Won ${reward} Coins on ${segment.label}`);
          }
          sound.playWin();
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } else {
          sound.playCrash();
        }

        // Record history & reset override if consumed
        const updatedConfig = recordSpin({
          id: `spin-${Date.now()}`,
          timestamp: Date.now(),
          segmentId: segment.id,
          segmentLabel: segment.label,
          rewardType: segment.rewardType,
          rewardValue: reward,
          betCost: selectedBet,
          netPayout: reward - selectedBet,
          wasOverridden,
        });
        setConfig(updatedConfig);

        // Show win celebration popup
        setWinResult({
          segment,
          reward,
          wasOverridden,
        });
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, [isSpinning, userCoins, selectedBet, user, addCoins, showNotification, config, rotationAngle]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#120624] text-white flex flex-col items-center justify-between select-none relative overflow-x-hidden font-sans">
      {/* Background Ambience: Deep purple nebula with golden sparkles */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3B0764]/40 via-[#180829] to-[#0A0214] z-0" />

      {/* Decorative Gold Dust Particles (CSS-only for 0 GPU drag on low-end phones) */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:24px_24px] z-0" />

      {/* ==========================================
          TOP HEADER: "Spin to Win" & Balance Pill
          ========================================== */}
      <header className="w-full max-w-md px-4 pt-4 pb-2 flex items-center justify-between z-10">
        {/* Back Button */}
        <Link
          href="/"
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition active:scale-95 shadow-md"
        >
          <ArrowLeft className="w-5 h-5 text-gray-200" />
        </Link>

        {/* Center Title */}
        <div className="text-center">
          <h1 className="text-xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 drop-shadow-md uppercase">
            Spin to Win
          </h1>
          <div className="text-[10px] text-amber-200/70 font-semibold tracking-wider">
            LUCKY CASINO WHEEL
          </div>
        </div>

        {/* Right Section: Sound, Balance & Admin */}
        <div className="flex items-center space-x-2">
          {/* Sound Mute */}
          <button
            onClick={toggleSound}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-gray-200" />}
          </button>

          {/* Glowing Gold Coin Balance Pill matching screenshot */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#2A0845] to-[#1B0530] border-2 border-amber-400/60 shadow-lg shadow-amber-500/10">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-[10px] text-amber-950 font-black shadow">
              🪙
            </div>
            <span className="text-xs font-black font-mono text-amber-300">
              {userCoins.toLocaleString()}
            </span>
          </div>

          {/* Admin Control Button */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="w-9 h-9 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 flex items-center justify-center text-amber-400 transition"
            title="Open Admin Hub"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ==========================================
          SUBTITLE: Spin Cost & Quick Bet Selector
          ========================================== */}
      <div className="w-full max-w-md px-4 py-1 flex flex-col items-center space-y-2 z-10">
        <div className="text-sm font-black tracking-wider text-amber-300 uppercase flex items-center space-x-1 drop-shadow">
          <span>Spin - {selectedBet}</span>
        </div>

        {/* Quick Bet Buttons */}
        <div className="flex items-center space-x-2">
          {BET_PRESETS.map((bet) => (
            <button
              key={bet}
              disabled={isSpinning}
              onClick={() => {
                sound.playChipClick();
                setSelectedBet(bet);
              }}
              className={`px-3 py-1 rounded-full text-xs font-black transition active:scale-95 ${
                selectedBet === bet
                  ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-md shadow-amber-500/30"
                  : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10"
              }`}
            >
              {bet}
            </button>
          ))}
        </div>
      </div>

      {/* ==========================================
          CENTER STAGE: CASINO WHEEL CANVAS
          ========================================== */}
      <div className="flex-1 w-full max-w-md flex items-center justify-center py-2 px-3 z-10">
        <WheelCanvas
          segments={config.segments}
          rotationAngle={rotationAngle}
          pointerDeflection={pointerDeflection}
          size={360}
        />
      </div>

      {/* ==========================================
          BOTTOM ACTION: 3D GLOWING "PLAY" BUTTON
          (Exact replica of reference screenshot)
          ========================================== */}
      <div className="w-full max-w-md px-6 pb-6 pt-2 flex flex-col items-center space-y-3 z-10">
        <button
          disabled={isSpinning}
          onClick={handleSpin}
          className={`w-full max-w-xs py-4 px-8 rounded-full text-2xl font-black tracking-widest uppercase transition-all duration-300 relative overflow-hidden group shadow-2xl ${
            isSpinning
              ? "bg-[#3D1A54] border-2 border-purple-500/40 text-purple-300 cursor-not-allowed opacity-80"
              : "bg-gradient-to-b from-[#8C2A08] via-[#B8450F] to-[#591404] hover:brightness-110 active:scale-95 border-3 border-[#FDE047] text-white shadow-amber-500/30"
          }`}
          style={{
            boxShadow: isSpinning
              ? "none"
              : "0 0 25px rgba(245, 158, 11, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.4)",
          }}
        >
          {/* Inner Light Bevel Highlight */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-t-full" />

          {/* Button Text */}
          <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-amber-300 flex items-center justify-center gap-2">
            {isSpinning ? (
              <>
                <RotateCw className="w-6 h-6 animate-spin text-amber-300" />
                <span>SPINNING...</span>
              </>
            ) : (
              "PLAY"
            )}
          </span>
        </button>

        <div className="text-[10px] text-gray-400 font-semibold tracking-wide">
          Tap PLAY to spin • Provably fair weighted probability
        </div>
      </div>

      {/* ==========================================
          CELEBRATION WIN MODAL POPUP
          ========================================== */}
      {winResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-xs p-6 rounded-3xl bg-gradient-to-b from-[#2B0E44] to-[#120624] border-3 border-amber-400 text-center space-y-4 shadow-2xl shadow-amber-500/20">
            {/* Crown / Trophy Icon */}
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-3xl shadow-lg border-2 border-white animate-bounce">
              {winResult.reward > 0 ? winResult.segment.iconEmoji : "💨"}
            </div>

            <div>
              <div className="text-xs font-black tracking-widest text-amber-400 uppercase">
                {winResult.reward > 0 ? "CONGRATULATIONS!" : "BETTER LUCK NEXT TIME!"}
              </div>
              <h3 className="text-3xl font-black text-white mt-1">
                {winResult.segment.label}
              </h3>
            </div>

            {winResult.reward > 0 ? (
              <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/30 flex items-center justify-center space-x-2">
                <span className="text-2xl">🪙</span>
                <span className="text-2xl font-black text-amber-300 font-mono">
                  +{winResult.reward.toLocaleString()} Coins
                </span>
              </div>
            ) : (
              <p className="text-xs text-gray-400">
                You landed on {winResult.segment.label}. Spin again to hit the Jackpot!
              </p>
            )}

            <button
              onClick={() => {
                sound.playChipClick();
                setWinResult(null);
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-black text-sm uppercase tracking-wider shadow-lg transition active:scale-95"
            >
              {winResult.reward > 0 ? "CLAIM & SPIN AGAIN" : "SPIN AGAIN"}
            </button>
          </div>
        </div>
      )}

      {/* ==========================================
          ADMIN PANEL MODAL
          ========================================== */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        config={config}
        onConfigUpdated={(newConfig) => {
          setConfig(newConfig);
          setSelectedBet(newConfig.spinCost || 100);
        }}
      />
    </div>
  );
}
