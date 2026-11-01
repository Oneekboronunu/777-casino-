"use client";

import React, { useEffect, useRef } from "react";
import { WheelSegment } from "@/lib/wheel/types";

interface WheelCanvasProps {
  segments: WheelSegment[];
  rotationAngle: number; // in degrees
  pointerDeflection: number; // in degrees (-12 to +12)
  size?: number; // width/height in px
}

export default function WheelCanvas({
  segments,
  rotationAngle,
  pointerDeflection,
  size = 380,
}: WheelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI displays smoothly (limit to 2x for low-end mobile performance)
    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;

    ctx.save();
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const outerRadius = size / 2 - 14;
    const wheelRadius = outerRadius - 16;
    const centerHubRadius = wheelRadius * 0.24;

    ctx.clearRect(0, 0, size, size);

    // ==========================================
    // 1. OUTER GLOWING CASINO SHADOW
    // ==========================================
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, outerRadius + 2, 0, Math.PI * 2);
    ctx.shadowColor = "rgba(245, 158, 11, 0.4)";
    ctx.shadowBlur = 18;
    ctx.fillStyle = "#1E0A2A";
    ctx.fill();
    ctx.restore();

    // ==========================================
    // 2. OUTER GOLD METALLIC RIM WITH STUDS
    // ==========================================
    // Beveled Gold Rim
    const rimGrad = ctx.createRadialGradient(cx, cy, wheelRadius - 2, cx, cy, outerRadius + 4);
    rimGrad.addColorStop(0, "#854D0E");
    rimGrad.addColorStop(0.3, "#F59E0B");
    rimGrad.addColorStop(0.65, "#FEF08A");
    rimGrad.addColorStop(0.85, "#D97706");
    rimGrad.addColorStop(1, "#451A03");

    ctx.beginPath();
    ctx.arc(cx, cy, outerRadius, 0, Math.PI * 2);
    ctx.fillStyle = rimGrad;
    ctx.fill();

    // Outer rim thin highlights
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#FEF08A";
    ctx.stroke();

    // Inner rim dark groove
    ctx.beginPath();
    ctx.arc(cx, cy, wheelRadius + 1, 0, Math.PI * 2);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#3B1400";
    ctx.stroke();

    // Studs / Golden Bulbs around the perimeter (24 bulbs)
    const numStuds = 24;
    const studOrbitRadius = (outerRadius + wheelRadius) / 2 + 1;
    for (let i = 0; i < numStuds; i++) {
      const angle = (i * 2 * Math.PI) / numStuds;
      const sx = cx + Math.cos(angle) * studOrbitRadius;
      const sy = cy + Math.sin(angle) * studOrbitRadius;

      // Stud Drop Shadow
      ctx.beginPath();
      ctx.arc(sx, sy + 1, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
      ctx.fill();

      // Stud Metallic Sphere
      const studGrad = ctx.createRadialGradient(sx - 1, sy - 1, 0.5, sx, sy, 3.5);
      studGrad.addColorStop(0, "#FFFFFF");
      studGrad.addColorStop(0.35, "#FEF08A");
      studGrad.addColorStop(0.8, "#D97706");
      studGrad.addColorStop(1, "#5B2100");

      ctx.beginPath();
      ctx.arc(sx, sy, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = studGrad;
      ctx.fill();
    }

    // ==========================================
    // 3. ROTATING WHEEL SEGMENTS
    // ==========================================
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((rotationAngle * Math.PI) / 180);

    const totalSegs = segments.length;
    const arc = (2 * Math.PI) / totalSegs;

    segments.forEach((seg, i) => {
      const startAngle = i * arc;
      const endAngle = startAngle + arc;

      // Draw Segment Wedge
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, wheelRadius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = seg.bgColor || "#581C87";
      ctx.fill();

      // Subtle inner vignette gradient for luxury feel
      const sliceGrad = ctx.createRadialGradient(0, 0, centerHubRadius, 0, 0, wheelRadius);
      sliceGrad.addColorStop(0, "rgba(255, 255, 255, 0.18)");
      sliceGrad.addColorStop(0.7, "rgba(0, 0, 0, 0)");
      sliceGrad.addColorStop(1, "rgba(0, 0, 0, 0.42)");
      ctx.fillStyle = sliceGrad;
      ctx.fill();

      // Golden Divider Line between segments
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Peg/Divider Stud at outer edge
      const dividerAngle = startAngle;
      const px = Math.cos(dividerAngle) * (wheelRadius - 3);
      const py = Math.sin(dividerAngle) * (wheelRadius - 3);
      ctx.beginPath();
      ctx.arc(px, py, 2.8, 0, Math.PI * 2);
      ctx.fillStyle = "#FEF08A";
      ctx.fill();

      // Draw Segment Label Text & Mini Gem Icon
      ctx.save();
      const midAngle = startAngle + arc / 2;
      ctx.rotate(midAngle);

      // 1. Text Label (Radially oriented matching reference)
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = seg.textColor || "#FFFFFF";

      const isJackpot = seg.label.toUpperCase() === "JACKPOT";
      const fontSize = isJackpot
        ? Math.max(10, Math.round(wheelRadius * 0.088))
        : Math.max(11, Math.round(wheelRadius * 0.11));

      ctx.font = `900 ${fontSize}px "Inter", "Arial Black", sans-serif`;

      // Text Shadow for high contrast
      ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      // Position text along the slice radius
      const textRadius = wheelRadius * 0.62;
      ctx.save();
      ctx.translate(textRadius, 0);
      ctx.rotate(Math.PI / 2); // Radial orientation
      ctx.fillText(seg.label, 0, 0);
      ctx.restore();

      // Reset text shadow for icon
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // 2. Mini Gemstone / Icon near the outer rim
      const iconRadius = wheelRadius * 0.85;
      const iconSize = Math.max(12, Math.round(wheelRadius * 0.11));
      ctx.font = `${iconSize}px sans-serif`;
      ctx.save();
      ctx.translate(iconRadius, 0);
      ctx.rotate(Math.PI / 2);
      ctx.fillText(seg.iconEmoji || "💎", 0, 0);
      ctx.restore();

      ctx.restore();
    });

    ctx.restore(); // Restore rotating translate

    // ==========================================
    // 4. CENTER LUXURY GOLDEN DIAMOND HUB
    // ==========================================
    // Hub Drop Shadow
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, centerHubRadius + 2, 0, Math.PI * 2);
    ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 3;
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fill();
    ctx.restore();

    // Outer Hub Gold Rim
    const hubRimGrad = ctx.createRadialGradient(
      cx - 4,
      cy - 4,
      1,
      cx,
      cy,
      centerHubRadius + 2
    );
    hubRimGrad.addColorStop(0, "#FFFFFF");
    hubRimGrad.addColorStop(0.2, "#FEF08A");
    hubRimGrad.addColorStop(0.6, "#D97706");
    hubRimGrad.addColorStop(1, "#5B2100");

    ctx.beginPath();
    ctx.arc(cx, cy, centerHubRadius, 0, Math.PI * 2);
    ctx.fillStyle = hubRimGrad;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#FEF08A";
    ctx.stroke();

    // Inner Faceted Gemstone / Medallion
    const innerGemRadius = centerHubRadius * 0.75;
    const gemGrad = ctx.createRadialGradient(
      cx - 2,
      cy - 2,
      1,
      cx,
      cy,
      innerGemRadius
    );
    gemGrad.addColorStop(0, "#FFFBEB");
    gemGrad.addColorStop(0.3, "#F59E0B");
    gemGrad.addColorStop(0.7, "#B45309");
    gemGrad.addColorStop(1, "#78350F");

    ctx.beginPath();
    ctx.arc(cx, cy, innerGemRadius, 0, Math.PI * 2);
    ctx.fillStyle = gemGrad;
    ctx.fill();

    // Center Diamond Star Facet Accent
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
    for (let r = 0; r < 4; r++) {
      ctx.rotate(Math.PI / 4);
      ctx.beginPath();
      ctx.moveTo(-1.5, 0);
      ctx.lineTo(0, -innerGemRadius * 0.7);
      ctx.lineTo(1.5, 0);
      ctx.lineTo(0, innerGemRadius * 0.7);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // Center sparkling point
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();

    // ==========================================
    // 5. TOP CENTER POINTER / CLAPPER
    // ==========================================
    ctx.save();
    const pointerTopY = cy - outerRadius - 10;
    const pointerTipY = cy - wheelRadius + 8;
    const pointerWidth = 26;

    ctx.translate(cx, pointerTopY + 12);
    // Apply dynamic wobble/kick deflection when passing dividers!
    ctx.rotate((pointerDeflection * Math.PI) / 180);

    // Pointer Drop Shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;

    // Pointer Golden Shape
    ctx.beginPath();
    ctx.moveTo(-pointerWidth / 2, -12);
    ctx.lineTo(pointerWidth / 2, -12);
    ctx.lineTo(pointerWidth / 3, 4);
    ctx.lineTo(0, pointerTipY - pointerTopY - 12); // Sharp tip into the wheel
    ctx.lineTo(-pointerWidth / 3, 4);
    ctx.closePath();

    const ptrGrad = ctx.createLinearGradient(
      -pointerWidth / 2,
      -12,
      pointerWidth / 2,
      pointerTipY - pointerTopY
    );
    ptrGrad.addColorStop(0, "#FFFFFF");
    ptrGrad.addColorStop(0.3, "#FDE047");
    ptrGrad.addColorStop(0.7, "#D97706");
    ptrGrad.addColorStop(1, "#78350F");

    ctx.fillStyle = ptrGrad;
    ctx.fill();
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = "#FEF08A";
    ctx.stroke();

    // Center Gem in Pointer Cap
    ctx.beginPath();
    ctx.arc(0, -5, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = "#EF4444"; // Red Ruby Accent
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#FEF08A";
    ctx.stroke();

    ctx.restore();

    ctx.restore();
  }, [segments, rotationAngle, pointerDeflection, size]);

  return (
    <div className="relative flex items-center justify-center select-none">
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="max-w-full h-auto drop-shadow-2xl"
      />
    </div>
  );
}
