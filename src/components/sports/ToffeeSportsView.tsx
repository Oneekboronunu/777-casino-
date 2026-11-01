"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  Radio,
  Tv,
  Flame,
  Clock,
  Sparkles,
  Maximize2,
  Volume2,
  VolumeX,
  ChevronRight,
  Shield,
  Trophy,
  Check,
  Eye,
  Share2,
} from "lucide-react";
import sound from "@/lib/sound";
import { useUserStore } from "@/lib/store/useUserStore";

interface LiveStreamMatch {
  id: string;
  sport: "CRICKET" | "FOOTBALL";
  tournament: string;
  title: string;
  team1: { name: string; flag: string; score: string; overs?: string };
  team2: { name: string; flag: string; score: string; overs?: string };
  statusText: string;
  currentOverBalls?: string[];
  batters?: { name: string; runs: number; balls: number }[];
  bowler?: { name: string; wickets: number; runs: number };
  viewers: string;
  odds1: number;
  oddsX?: number;
  odds2: number;
  previewBg: string;
}

const LIVE_STREAMS: LiveStreamMatch[] = [
  {
    id: "live-ban-wi",
    sport: "CRICKET",
    tournament: "BANGLADESH TOUR OF WEST INDIES 2026 • 2ND ODI",
    title: "Bangladesh vs West Indies",
    team1: { name: "Bangladesh", flag: "🇧🇩", score: "218/4", overs: "36.4 ov" },
    team2: { name: "West Indies", flag: "🌴", score: "272", overs: "50.0 ov" },
    statusText: "BAN needs 55 runs in 80 balls • Required RR: 4.12",
    currentOverBalls: ["1", "4", "0", "6", "2", "1"],
    batters: [
      { name: "Shakib Al Hasan", runs: 68, balls: 54 },
      { name: "Litton Das", runs: 46, balls: 41 },
    ],
    bowler: { name: "Alzarri Joseph", wickets: 2, runs: 44 },
    viewers: "128,450 Watching Live",
    odds1: 1.58,
    odds2: 2.35,
    previewBg: "from-emerald-950 via-[#0A1F16] to-[#050D09]",
  },
  {
    id: "live-epl-ars-che",
    sport: "FOOTBALL",
    tournament: "ENGLISH PREMIER LEAGUE • MATCHDAY 28",
    title: "Arsenal vs Chelsea",
    team1: { name: "Arsenal", flag: "🔴", score: "2" },
    team2: { name: "Chelsea", flag: "🔵", score: "1" },
    statusText: "82' • High Pressing by Arsenal • Stadium: Emirates Stadium",
    viewers: "214,900 Watching Live",
    odds1: 1.35,
    oddsX: 4.20,
    odds2: 7.50,
    previewBg: "from-red-950 via-[#1C0A0E] to-[#0C0407]",
  },
  {
    id: "live-bpl-bar-com",
    sport: "CRICKET",
    tournament: "BANGLADESH PREMIER LEAGUE 2026 • QUALIFIER 1",
    title: "Fortune Barishal vs Comilla Victorians",
    team1: { name: "Fortune Barishal", flag: "🐅", score: "184/5", overs: "18.3 ov" },
    team2: { name: "Comilla Victorians", flag: "🦁", score: "Yet to Bat", overs: "Target: 185" },
    statusText: "Tamim Iqbal 82* (51) • Mirpur Sher-e-Bangla Stadium",
    currentOverBalls: ["6", "1", "4", "W", "2"],
    viewers: "96,200 Watching Live",
    odds1: 1.72,
    odds2: 2.10,
    previewBg: "from-amber-950 via-[#1F140A] to-[#0D0804]",
  },
];

const TV_CHANNELS = [
  {
    id: "tsports",
    name: "T Sports HD",
    tag: "LIVE 1080P",
    program: "Live: Bangladesh Tour of WI 2026",
    viewers: "94.2K",
    logoText: "T SPORTS",
    color: "from-red-600 to-rose-700",
  },
  {
    id: "sonyten1",
    name: "Sony Sports Ten 1 HD",
    tag: "LIVE HD",
    program: "Live: India vs Australia Test Series",
    viewers: "78.6K",
    logoText: "SONY TEN 1",
    color: "from-blue-600 to-cyan-700",
  },
  {
    id: "sonyten2",
    name: "Sony Sports Ten 2 HD",
    tag: "LIVE HD",
    program: "Live: UEFA Champions League Hub",
    viewers: "65.1K",
    logoText: "SONY TEN 2",
    color: "from-indigo-600 to-purple-700",
  },
  {
    id: "gtv",
    name: "GTV Live HD",
    tag: "CRICKET SPECIAL",
    program: "BPL 2026 Live Match Coverage",
    viewers: "52.3K",
    logoText: "GTV LIVE",
    color: "from-emerald-600 to-teal-700",
  },
  {
    id: "eplchan",
    name: "EPL Channel 1 HD",
    tag: "PREMIER LEAGUE",
    program: "Live Matchday 28 Live Broadcast",
    viewers: "88.9K",
    logoText: "EPL 1 HD",
    color: "from-purple-700 to-pink-700",
  },
  {
    id: "willow",
    name: "Willow Cricket HD",
    tag: "24/7 CRICKET",
    program: "International Twenty20 Blast",
    viewers: "34.1K",
    logoText: "WILLOW HD",
    color: "from-amber-600 to-orange-700",
  },
];

const UPCOMING_FIXTURES = [
  {
    id: "up-1",
    sport: "CRICKET",
    tournament: "ICC Champions Trophy 2026",
    team1: "Pakistan",
    flag1: "🇵🇰",
    team2: "India",
    flag2: "🇮🇳",
    dateText: "Tomorrow 14:30",
    venue: "Dubai International Stadium",
    countdown: "Starts in 16h 25m",
    odds1: 2.30,
    odds2: 1.62,
  },
  {
    id: "up-2",
    sport: "FOOTBALL",
    tournament: "UEFA Champions League • Quarter Final",
    team1: "Real Madrid",
    flag1: "⚪",
    team2: "Manchester City",
    flag2: "🔵",
    dateText: "Wednesday 02:00",
    venue: "Santiago Bernabéu",
    countdown: "Starts in 28h 10m",
    odds1: 2.45,
    oddsX: 3.50,
    odds2: 2.70,
  },
  {
    id: "up-3",
    sport: "CRICKET",
    tournament: "IPL 2026 Mega Clash",
    team1: "Chennai Super Kings",
    flag1: "🦁",
    team2: "Mumbai Indians",
    flag2: "🦅",
    dateText: "Thursday 20:00",
    venue: "Wankhede Stadium, Mumbai",
    countdown: "Starts in 42h 00m",
    odds1: 1.88,
    odds2: 1.92,
  },
];

const HIGHLIGHTS = [
  {
    id: "high-1",
    title: "Bangladesh vs Sri Lanka Thriller • Last Over Finish Extended Highlights HD",
    tournament: "Asia Cup Moments",
    duration: "14:25 HD",
    views: "450K Views",
    thumbBg: "from-emerald-900 to-[#0A1F16]",
    badge: "MATCH REPLAY",
  },
  {
    id: "high-2",
    title: "Arsenal 3 - 1 Chelsea All Goals & Extended Highlights • Premier League",
    tournament: "EPL Matchday Highlights",
    duration: "10:15 HD",
    views: "620K Views",
    thumbBg: "from-red-900 to-[#1F0A10]",
    badge: "ALL GOALS",
  },
  {
    id: "high-3",
    title: "Shakib Al Hasan 5 Wickets & Stunning 82 Runs • Full Heroic Spell",
    tournament: "BPL 2026 Classics",
    duration: "08:50 HD",
    views: "310K Views",
    thumbBg: "from-amber-900 to-[#1F140A]",
    badge: "PLAYER OF MATCH",
  },
  {
    id: "high-4",
    title: "Real Madrid vs Barcelona 3-2 El Clasico Last Minute Drama HD",
    tournament: "La Liga Highlights",
    duration: "16:40 HD",
    views: "980K Views",
    thumbBg: "from-blue-900 to-[#0A121F]",
    badge: "EXTENDED HIGHLIGHTS",
  },
];

export default function ToffeeSportsView() {
  const { user, updateBalance, showNotification, openAuthModal } = useUserStore();

  const [activeStream, setActiveStream] = useState<LiveStreamMatch>(LIVE_STREAMS[0]);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [commentaryLang, setCommentaryLang] = useState<"BN" | "EN">("BN");
  const [selectedQuality, setSelectedQuality] = useState<string>("1080p HD");

  // Live Score dynamic ticker
  const [liveRuns, setLiveRuns] = useState(218);
  const [liveBalls, setLiveBalls] = useState(4); // 36.4

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveBalls((prev) => {
        const next = (prev + 1) % 6;
        if (Math.random() > 0.4) {
          const added = Math.random() > 0.7 ? 4 : Math.random() > 0.9 ? 6 : 1;
          setLiveRuns((r) => r + added);
        }
        return next;
      });
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleQuickBet = (team: string, odd: number) => {
    sound.playChipClick();
    if (!user) {
      openAuthModal("LOGIN");
      return;
    }
    const betAmount = 500;
    if (user.balance < betAmount) {
      showNotification("Insufficient balance for instant bet (Min: ৳500)", "ERROR");
      return;
    }

    updateBalance(-betAmount);
    sound.playBetPlaced();
    const potential = Math.round(betAmount * odd);
    showNotification(
      `Instant Live Bet Placed on ${team} @ ${odd.toFixed(2)}! Potential: ৳${potential.toLocaleString()}`,
      "SUCCESS"
    );
  };

  return (
    <div className="w-full bg-[#070A0E] text-gray-200 select-none pb-12 font-sans">
      {/* ========================================================
          1. TOFFEE CATEGORY NAVIGATION TABS (Horizontal scrolling)
          ======================================================== */}
      <div className="w-full bg-[#0C1017] border-b border-[#151D28] sticky top-28 sm:top-28 z-30 px-4 sm:px-8 py-2.5">
        <div className="max-w-[1600px] mx-auto flex items-center space-x-2 overflow-x-auto scrollbar-none">
          {[
            { id: "ALL", label: "🔥 All Sports", count: "Live 106" },
            { id: "CRICKET", label: "🏏 Cricket", count: "BPL & ODI" },
            { id: "FOOTBALL", label: "⚽ Football", count: "EPL & UCL" },
            { id: "CHANNELS", label: "📺 Live Sports TV", count: "6 Channels" },
            { id: "UPCOMING", label: "⚡ Upcoming Fixtures", count: "3 Big Clash" },
            { id: "HIGHLIGHTS", label: "🎬 Match Highlights", count: "HD Replays" },
            { id: "TOURNAMENTS", label: "🏆 Tournaments", count: "2026 Season" },
          ].map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  sound.playChipClick();
                  setActiveCategory(cat.id);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center space-x-2 shrink-0 ${
                  isActive
                    ? "bg-[#95D600] text-black shadow-[0_0_12px_rgba(149,214,0,0.4)] font-black"
                    : "bg-[#131A24] text-gray-300 hover:text-white hover:bg-[#1B2533] border border-[#1E2938]"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive
                      ? "bg-black/30 text-black font-black"
                      : "bg-white/5 text-gray-400"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-8">
        {/* ========================================================
            2. HERO LIVE STREAMING BROADCAST STAGE (Toffee Style)
            ======================================================== */}
        <section className="relative w-full rounded-3xl overflow-hidden border border-[#1E2B3C] shadow-2xl bg-black">
          {/* Main 16:9 Video Canvas / Stage */}
          <div
            className={`relative w-full aspect-[16/9] max-h-[580px] bg-gradient-to-tr ${activeStream.previewBg} flex flex-col justify-between p-4 sm:p-8 overflow-hidden`}
          >
            {/* Animated Stadium Lighting & Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-black/80 pointer-events-none" />
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            {/* Top Overlay Bar */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                {/* Live Badge */}
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black tracking-wider uppercase shadow-lg shadow-red-600/40">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>LIVE STREAM (HD)</span>
                </div>

                {/* Tournament Tag */}
                <span className="hidden sm:inline-block text-xs font-bold text-gray-300 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 truncate max-w-md">
                  {activeStream.tournament}
                </span>
              </div>

              {/* Top Right: Viewers & Quality */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-mono text-gray-300 border border-white/10">
                  <Eye className="w-3.5 h-3.5 text-[#95D600]" />
                  <span>{activeStream.viewers}</span>
                </div>

                {/* Commentary Lang Toggle */}
                <div className="flex items-center bg-black/60 backdrop-blur-md rounded-full p-0.5 border border-white/10 text-xs font-bold">
                  <button
                    onClick={() => setCommentaryLang("BN")}
                    className={`px-2.5 py-0.5 rounded-full transition ${
                      commentaryLang === "BN" ? "bg-[#95D600] text-black font-black" : "text-gray-400"
                    }`}
                  >
                    বাংলা
                  </button>
                  <button
                    onClick={() => setCommentaryLang("EN")}
                    className={`px-2.5 py-0.5 rounded-full transition ${
                      commentaryLang === "EN" ? "bg-[#95D600] text-black font-black" : "text-gray-400"
                    }`}
                  >
                    ENG
                  </button>
                </div>
              </div>
            </div>

            {/* Center Stage: Match Scoreboard HUD Overlay */}
            <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
                {/* Team 1 */}
                <div className="flex items-center space-x-3 text-left">
                  <span className="text-4xl sm:text-6xl drop-shadow">{activeStream.team1.flag}</span>
                  <div>
                    <h2 className="text-xl sm:text-3xl font-black text-white tracking-wide uppercase">
                      {activeStream.team1.name}
                    </h2>
                    <div className="text-2xl sm:text-4xl font-mono font-black text-[#95D600] tracking-tight">
                      {activeStream.id === "live-ban-wi" ? `${liveRuns}/4` : activeStream.team1.score}
                      {activeStream.team1.overs && (
                        <span className="text-xs sm:text-sm text-gray-400 font-normal ml-2">
                          ({activeStream.id === "live-ban-wi" ? `36.${liveBalls} ov` : activeStream.team1.overs})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* VS Badge */}
                <div className="w-12 h-12 rounded-full bg-black/70 border-2 border-[#95D600] flex items-center justify-center font-black text-xs text-[#95D600] shadow-xl">
                  VS
                </div>

                {/* Team 2 */}
                <div className="flex items-center space-x-3 text-left">
                  <div>
                    <h2 className="text-xl sm:text-3xl font-black text-white tracking-wide uppercase">
                      {activeStream.team2.name}
                    </h2>
                    <div className="text-2xl sm:text-4xl font-mono font-black text-gray-300 tracking-tight">
                      {activeStream.team2.score}
                      {activeStream.team2.overs && (
                        <span className="text-xs sm:text-sm text-gray-400 font-normal ml-2">
                          ({activeStream.team2.overs})
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-4xl sm:text-6xl drop-shadow">{activeStream.team2.flag}</span>
                </div>
              </div>

              {/* Status Note */}
              <div className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs sm:text-sm font-semibold text-amber-300">
                {activeStream.statusText}
              </div>

              {/* Current Over / Ball by Ball (Cricket) */}
              {activeStream.currentOverBalls && (
                <div className="flex items-center space-x-2 pt-1">
                  <span className="text-xs font-bold text-gray-400 font-mono">THIS OVER:</span>
                  <div className="flex items-center space-x-1.5">
                    {activeStream.currentOverBalls.map((b, idx) => (
                      <span
                        key={idx}
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-black shadow ${
                          b === "6"
                            ? "bg-purple-600 text-white"
                            : b === "4"
                            ? "bg-[#95D600] text-black"
                            : b === "W"
                            ? "bg-red-600 text-white animate-pulse"
                            : "bg-white/15 text-white"
                        }`}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Controls Bar (Player overlay) */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/10 bg-black/40 backdrop-blur-sm -mx-4 -mb-4 sm:-mx-8 sm:-mb-8 p-3 sm:p-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full bg-[#95D600] text-black flex items-center justify-center font-black transition active:scale-95 shadow-lg shadow-[#95D600]/30"
                >
                  <Play className={`w-4 h-4 fill-current ${isPlaying ? "" : "translate-x-0.5"}`} />
                </button>

                <button
                  onClick={() => setIsAudioMuted(!isAudioMuted)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                >
                  {isAudioMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <div className="text-xs font-mono text-gray-300 hidden sm:block">
                  Live Stream • HD 60FPS Broadcast
                </div>
              </div>

              {/* Stream Switcher Mini Buttons */}
              <div className="flex items-center space-x-1.5 overflow-x-auto">
                {LIVE_STREAMS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      sound.playChipClick();
                      setActiveStream(s);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 whitespace-nowrap ${
                      activeStream.id === s.id
                        ? "bg-white text-black font-black"
                        : "bg-white/10 text-gray-300 hover:text-white"
                    }`}
                  >
                    <span>{s.team1.flag}</span>
                    <span>vs</span>
                    <span>{s.team2.flag}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Embedded In-Play Quick Predict Bar (Directly below Live Player) */}
          <div className="bg-[#101722] border-t border-[#1C2838] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#95D600] animate-ping" />
              <span className="text-xs font-black uppercase text-white tracking-wide">
                Live In-Play Odds:
              </span>
              <span className="text-xs text-gray-400">Tap to place instant bet</span>
            </div>

            {/* Quick Odds Buttons */}
            <div className="flex items-center space-x-2.5 w-full md:w-auto">
              <button
                onClick={() => handleQuickBet(activeStream.team1.name, activeStream.odds1)}
                className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-[#182332] hover:bg-[#202E42] border border-[#253549] text-xs font-bold transition flex items-center justify-between space-x-3 active:scale-95"
              >
                <span className="text-gray-300">{activeStream.team1.name}</span>
                <span className="font-mono font-black text-[#95D600]">{activeStream.odds1.toFixed(2)}</span>
              </button>

              {activeStream.oddsX && (
                <button
                  onClick={() => handleQuickBet("Draw", activeStream.oddsX!)}
                  className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-[#182332] hover:bg-[#202E42] border border-[#253549] text-xs font-bold transition flex items-center justify-between space-x-2 active:scale-95"
                >
                  <span className="text-gray-300">Draw (X)</span>
                  <span className="font-mono font-black text-[#95D600]">{activeStream.oddsX.toFixed(2)}</span>
                </button>
              )}

              <button
                onClick={() => handleQuickBet(activeStream.team2.name, activeStream.odds2)}
                className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-[#182332] hover:bg-[#202E42] border border-[#253549] text-xs font-bold transition flex items-center justify-between space-x-3 active:scale-95"
              >
                <span className="text-gray-300">{activeStream.team2.name}</span>
                <span className="font-mono font-black text-[#95D600]">{activeStream.odds2.toFixed(2)}</span>
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================
            3. CAROUSEL 1: 🔴 LIVE MATCHES NOW (Toffee OTT Cards)
            ======================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Radio className="w-5 h-5 text-red-500 animate-pulse" />
              <h3 className="text-lg font-black text-white uppercase tracking-wide">
                Live Matches Now (Streaming in HD)
              </h3>
            </div>
            <span className="text-xs font-bold text-[#95D600] cursor-pointer hover:underline">
              View All 106 Live Events →
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LIVE_STREAMS.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  sound.playChipClick();
                  setActiveStream(m);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative space-y-3 shadow-lg ${
                  activeStream.id === m.id
                    ? "bg-[#141E2B] border-[#95D600] shadow-[0_0_15px_rgba(149,214,0,0.25)]"
                    : "bg-[#101620] border-[#1C2634] hover:border-gray-500 hover:bg-[#131B26]"
                }`}
              >
                {/* Header Tag */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-400 text-[11px] truncate max-w-[200px]">
                    {m.tournament}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-black uppercase flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span>LIVE</span>
                  </span>
                </div>

                {/* Teams & Scores */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-black text-white">
                    <div className="flex items-center space-x-2">
                      <span>{m.team1.flag}</span>
                      <span>{m.team1.name}</span>
                    </div>
                    <span className="font-mono text-[#95D600]">{m.team1.score}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm font-black text-white">
                    <div className="flex items-center space-x-2">
                      <span>{m.team2.flag}</span>
                      <span>{m.team2.name}</span>
                    </div>
                    <span className="font-mono text-gray-300">{m.team2.score}</span>
                  </div>
                </div>

                {/* Sub status */}
                <div className="text-[11px] text-gray-400 font-mono truncate">
                  {m.statusText}
                </div>

                {/* Action button */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-gray-500 font-mono">{m.viewers}</span>
                  <span className="text-xs font-black text-[#95D600] flex items-center space-x-1">
                    <span>Watch Stream</span>
                    <Play className="w-3 h-3 fill-current" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================
            4. CAROUSEL 2: 📺 LIVE SPORTS TV CHANNELS (Toffee Channel Hub)
            ======================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Tv className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-black text-white uppercase tracking-wide">
                Live Sports TV Channels (24/7 Broadcast)
              </h3>
            </div>
            <span className="text-xs text-gray-400 font-medium">Toffee Exclusive HD Feeds</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {TV_CHANNELS.map((ch) => (
              <div
                key={ch.id}
                onClick={() => sound.playChipClick()}
                className="group relative p-3.5 rounded-2xl bg-[#101620] hover:bg-[#151D2A] border border-[#1C2634] hover:border-[#95D600]/60 transition-all cursor-pointer shadow-lg space-y-3"
              >
                {/* Channel Icon Box */}
                <div
                  className={`w-full aspect-[16/9] rounded-xl bg-gradient-to-tr ${ch.color} flex items-center justify-center p-2 text-center shadow-md relative overflow-hidden`}
                >
                  <span className="text-xs sm:text-sm font-black text-white tracking-wider uppercase drop-shadow">
                    {ch.logoText}
                  </span>
                  <div className="absolute top-1 right-1 px-1.5 py-0.2 rounded bg-black/60 text-white text-[8px] font-black uppercase">
                    {ch.tag}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-black text-white group-hover:text-[#95D600] transition truncate">
                    {ch.name}
                  </div>
                  <div className="text-[10px] text-gray-400 truncate">
                    {ch.program}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                  <span>{ch.viewers}</span>
                  <span className="text-[#95D600] font-bold group-hover:underline flex items-center gap-0.5">
                    Live <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================
            5. CAROUSEL 3: ⚡ UPCOMING HIGH-VOLTAGE FIXTURES
            ======================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-[#95D600]" />
              <h3 className="text-lg font-black text-white uppercase tracking-wide">
                Upcoming High-Voltage Fixtures
              </h3>
            </div>
            <span className="text-xs text-gray-400 font-mono">Live Match Countdowns</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {UPCOMING_FIXTURES.map((f) => (
              <div
                key={f.id}
                className="p-5 rounded-2xl bg-[#101620] border border-[#1C2634] space-y-4 shadow-lg"
              >
                {/* Header with Countdown */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-400 text-[11px] truncate max-w-[180px]">
                    {f.tournament}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-black">
                    {f.countdown}
                  </span>
                </div>

                {/* Teams Showcase */}
                <div className="flex items-center justify-between py-1">
                  <div className="text-center space-y-1">
                    <span className="text-3xl">{f.flag1}</span>
                    <div className="text-xs font-black text-white">{f.team1}</div>
                  </div>

                  <div className="text-center space-y-0.5">
                    <span className="text-xs font-mono font-bold text-gray-400">{f.dateText}</span>
                    <div className="text-[10px] text-gray-500 max-w-[120px] truncate">{f.venue}</div>
                  </div>

                  <div className="text-center space-y-1">
                    <span className="text-3xl">{f.flag2}</span>
                    <div className="text-xs font-black text-white">{f.team2}</div>
                  </div>
                </div>

                {/* Pre-Match Odds */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleQuickBet(f.team1, f.odds1)}
                    className="flex-1 py-2 rounded-xl bg-[#17212F] hover:bg-[#202E42] text-xs font-bold text-gray-200 transition text-center border border-[#253448]"
                  >
                    1: <span className="font-mono text-[#95D600] font-black">{f.odds1.toFixed(2)}</span>
                  </button>

                  {f.oddsX && (
                    <button
                      onClick={() => handleQuickBet("Draw", f.oddsX!)}
                      className="flex-1 py-2 rounded-xl bg-[#17212F] hover:bg-[#202E42] text-xs font-bold text-gray-200 transition text-center border border-[#253448]"
                    >
                      X: <span className="font-mono text-[#95D600] font-black">{f.oddsX.toFixed(2)}</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleQuickBet(f.team2, f.odds2)}
                    className="flex-1 py-2 rounded-xl bg-[#17212F] hover:bg-[#202E42] text-xs font-bold text-gray-200 transition text-center border border-[#253448]"
                  >
                    2: <span className="font-mono text-[#95D600] font-black">{f.odds2.toFixed(2)}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================
            6. CAROUSEL 4: 🎬 MATCH HIGHLIGHTS & REPLAYS (Toffee VOD)
            ======================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-black text-white uppercase tracking-wide">
                Match Highlights & Top Moments (HD Replay)
              </h3>
            </div>
            <span className="text-xs text-[#95D600] font-bold hover:underline cursor-pointer">
              Explore All VOD Clips →
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HIGHLIGHTS.map((h) => (
              <div
                key={h.id}
                onClick={() => sound.playChipClick()}
                className="group p-3 rounded-2xl bg-[#101620] hover:bg-[#151D2A] border border-[#1C2634] hover:border-gray-500 transition cursor-pointer shadow-lg space-y-2.5"
              >
                {/* Thumbnail Preview Box */}
                <div
                  className={`w-full aspect-[16/9] rounded-xl bg-gradient-to-tr ${h.thumbBg} flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition`}
                >
                  <div className="w-10 h-10 rounded-full bg-black/70 group-hover:bg-[#95D600] text-white group-hover:text-black flex items-center justify-center shadow-lg transition">
                    <Play className="w-4 h-4 fill-current translate-x-0.5" />
                  </div>
                  <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded bg-black/80 text-white font-mono text-[9px] font-black">
                    {h.duration}
                  </span>
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-red-600 text-white text-[8px] font-black uppercase">
                    {h.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] text-gray-400 font-bold truncate">
                    {h.tournament}
                  </div>
                  <h4 className="text-xs font-black text-white group-hover:text-[#95D600] transition line-clamp-2 leading-relaxed">
                    {h.title}
                  </h4>
                </div>

                <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                  <span>{h.views}</span>
                  <span className="text-[#95D600] font-bold">Watch Now</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
