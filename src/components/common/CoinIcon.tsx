import React from "react";

interface CoinIconProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}

const sizeMap = {
  xs: "w-3.5 h-3.5",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-7 h-7",
  xl: "w-10 h-10",
};

export default function CoinIcon({ className = "", size = "md", animated = false }: CoinIconProps) {
  const sizeClass = sizeMap[size] || sizeMap.md;

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block flex-shrink-0 drop-shadow-[0_2px_4px_rgba(212,175,55,0.4)] ${sizeClass} ${
        animated ? "animate-pulse" : ""
      } ${className}`}
    >
      <defs>
        {/* Outer coin rim gradient */}
        <linearGradient id="coinRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="25%" stopColor="#F5B301" />
          <stop offset="50%" stopColor="#9E6E00" />
          <stop offset="75%" stopColor="#F5B301" />
          <stop offset="100%" stopColor="#FFF2A3" />
        </linearGradient>

        {/* Inner coin face gradient */}
        <radialGradient id="coinFaceGrad" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#FFF4B8" />
          <stop offset="35%" stopColor="#F4BE1B" />
          <stop offset="70%" stopColor="#C98600" />
          <stop offset="100%" stopColor="#8A5800" />
        </radialGradient>

        {/* Edge bevel 3D depth */}
        <linearGradient id="coinBevelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF8D6" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#4A3000" stopOpacity="0.9" />
        </linearGradient>

        {/* 777 Text Gradient */}
        <linearGradient id="coin777Grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#FFF099" />
          <stop offset="100%" stopColor="#E5A100" />
        </linearGradient>

        {/* Specular Glint */}
        <linearGradient id="specularGlint" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Outer 3D Base Drop Rim */}
      <circle cx="32" cy="33" r="30" fill="#6B4200" />

      {/* Main Outer Rim */}
      <circle cx="32" cy="32" r="30" fill="url(#coinRimGrad)" stroke="#7A4D00" strokeWidth="1" />

      {/* Milled Ridge Dots on Coin Rim */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 360) / 16;
        const rad = (angle * Math.PI) / 180;
        const cx = 32 + 26.5 * Math.cos(rad);
        const cy = 32 + 26.5 * Math.sin(rad);
        return (
          <circle
            key={i}
            cx={cx.toFixed(1)}
            cy={cy.toFixed(1)}
            r="1.2"
            fill="#FFF5C2"
            opacity="0.85"
          />
        );
      })}

      {/* Inner Bevel Ring */}
      <circle
        cx="32"
        cy="32"
        r="23"
        fill="url(#coinFaceGrad)"
        stroke="url(#coinBevelGrad)"
        strokeWidth="1.8"
      />

      {/* Inner Decorative Beaded Ring */}
      <circle
        cx="32"
        cy="32"
        r="19"
        fill="none"
        stroke="#7A4D00"
        strokeWidth="0.8"
        strokeDasharray="2,2"
        opacity="0.6"
      />

      {/* Center 777 Emblem */}
      <g filter="drop-shadow(0px 1px 1px rgba(70,40,0,0.8))">
        {/* Crown on top */}
        <path
          d="M26 21 L28 23.5 L32 20 L36 23.5 L38 21 L38 24 L26 24 Z"
          fill="#FFF9D2"
        />
        {/* "777" Typography */}
        <text
          x="32"
          y="37.5"
          textAnchor="middle"
          fontSize="14"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="-0.5px"
          fill="url(#coin777Grad)"
          stroke="#5C3600"
          strokeWidth="0.6"
        >
          777
        </text>

        {/* Subtitle STARS */}
        <path
          d="M27 41.5 L28 43 L30 43 L28.5 44 L29 45.5 L27 44.5 L25 45.5 L25.5 44 L24 43 L26 43 Z"
          fill="#FFF5C2"
        />
        <path
          d="M32 40.5 L33.2 42.3 L35.5 42.3 L33.8 43.5 L34.4 45.5 L32 44.2 L29.6 45.5 L30.2 43.5 L28.5 42.3 L30.8 42.3 Z"
          fill="#FFFDF0"
        />
        <path
          d="M37 41.5 L38 43 L40 43 L38.5 44 L39 45.5 L37 44.5 L35 45.5 L35.5 44 L34 43 L36 43 Z"
          fill="#FFF5C2"
        />
      </g>

      {/* Top Gloss Light Arc */}
      <path
        d="M13 25 C16 16, 24 11, 35 11 C43 11, 48 13, 51 17 C45 13, 38 12, 30 13 C22 14, 16 18, 13 25 Z"
        fill="#FFFFFF"
        opacity="0.4"
      />
    </svg>
  );
}
