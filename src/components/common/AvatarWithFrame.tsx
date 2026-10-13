import React from "react";

interface AvatarWithFrameProps {
  name?: string;
  avatarUrl?: string | null;
  frameId?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeConfig = {
  xs: {
    container: "w-7 h-7",
    avatar: "w-5 h-5 text-[10px]",
    badge: "text-[7px] -top-1",
  },
  sm: {
    container: "w-9 h-9",
    avatar: "w-7 h-7 text-xs font-bold",
    badge: "text-[8px] -top-1.5",
  },
  md: {
    container: "w-12 h-12",
    avatar: "w-9 h-9 text-sm font-extrabold",
    badge: "text-[9px] -top-2",
  },
  lg: {
    container: "w-16 h-16",
    avatar: "w-12 h-12 text-lg font-black",
    badge: "text-[11px] -top-2.5",
  },
  xl: {
    container: "w-24 h-24",
    avatar: "w-18 h-18 text-2xl font-black",
    badge: "text-xs -top-3.5",
  },
};

export default function AvatarWithFrame({
  name = "Player",
  avatarUrl,
  frameId = "frame-classic",
  size = "md",
  className = "",
}: AvatarWithFrameProps) {
  const config = sizeConfig[size] || sizeConfig.md;
  const initial = name ? name[0].toUpperCase() : "P";

  const renderFrameOverlay = () => {
    switch (frameId) {
      case "frame-gold-777":
        return (
          <>
            {/* 24K Gold Ring */}
            <div className="absolute inset-0 rounded-full border-2 sm:border-[3px] border-[#F5B301] shadow-[0_0_12px_rgba(245,179,1,0.65)] ring-1 ring-[#FFE066]" />
            {/* Top Crown Emblem */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 ${config.badge} flex items-center justify-center bg-gradient-to-r from-[#FFE066] to-[#F5B301] text-[#3D2500] font-black px-1.5 py-0.2 rounded-full shadow-md z-10 uppercase tracking-tighter`}
            >
              👑 777
            </div>
            {/* Sparkle corner */}
            <span className="absolute bottom-0 right-0 text-[10px] animate-bounce">✨</span>
          </>
        );

      case "frame-neon-vegas":
        return (
          <>
            {/* Neon Pulse */}
            <div className="absolute inset-0 rounded-full border-2 sm:border-[3px] border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.9),inset_0_0_8px_rgba(34,211,238,0.7)] animate-pulse" />
            <div
              className={`absolute left-1/2 -translate-x-1/2 ${config.badge} bg-gradient-to-r from-pink-500 to-cyan-400 text-white font-black px-1 rounded-full shadow z-10`}
            >
              VEGAS
            </div>
          </>
        );

      case "frame-emerald-vip":
        return (
          <>
            {/* Gemstone Bezel */}
            <div className="absolute inset-0 rounded-full border-2 sm:border-[3px] border-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.75)] ring-1 ring-emerald-300" />
            <div
              className={`absolute left-1/2 -translate-x-1/2 ${config.badge} bg-gradient-to-r from-emerald-500 to-teal-400 text-[#064E3B] font-black px-1.5 rounded-full shadow z-10`}
            >
              VIP
            </div>
            <span className="absolute top-0 right-0 text-[9px]">💎</span>
          </>
        );

      case "frame-cyber-phoenix":
        return (
          <>
            {/* Burning Phoenix Ring */}
            <div className="absolute inset-0 rounded-full border-2 sm:border-[3px] border-orange-500 shadow-[0_0_18px_rgba(249,115,22,0.95)] ring-2 ring-yellow-400 animate-pulse" />
            <div
              className={`absolute left-1/2 -translate-x-1/2 ${config.badge} bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 text-white font-black px-1.5 rounded-full shadow-lg z-10 flex items-center space-x-0.5`}
            >
              <span>🔥</span>
              <span>PHOENIX</span>
            </div>
          </>
        );

      case "frame-diamond-prismatic":
        return (
          <>
            {/* Prismatic Rainbow Diamond */}
            <div className="absolute inset-0 rounded-full border-2 sm:border-[3.5px] border-sky-300 shadow-[0_0_20px_rgba(129,140,248,0.9),inset_0_0_10px_rgba(244,114,182,0.6)] ring-1 ring-white" />
            <div
              className={`absolute left-1/2 -translate-x-1/2 ${config.badge} bg-gradient-to-r from-sky-400 via-indigo-400 to-pink-400 text-white font-black px-1.5 rounded-full shadow-xl z-10`}
            >
              ✦ ELITE ✦
            </div>
            <span className="absolute bottom-0 right-0 text-[10px] animate-spin">🌟</span>
          </>
        );

      case "frame-classic":
      default:
        return (
          <div className="absolute inset-0 rounded-full border-2 border-amber-600/70 shadow-sm" />
        );
    }
  };

  return (
    <div
      className={`relative flex items-center justify-center flex-shrink-0 select-none ${config.container} ${className}`}
    >
      {/* Frame Graphic Overlay */}
      {renderFrameOverlay()}

      {/* Avatar Inner Core */}
      <div
        className={`rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#BA2649] to-[#381523] text-[#FFDE59] shadow-inner ${config.avatar}`}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{initial}</span>
        )}
      </div>
    </div>
  );
}
