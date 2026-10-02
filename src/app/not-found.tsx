import Link from "next/link";
import { Flame, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="w-20 h-20 rounded-2xl bg-[#BA2649]/20 border-2 border-[#BA2649] flex items-center justify-center shadow-lg">
        <Flame className="w-10 h-10 text-[#BA2649]" />
      </div>

      <div className="space-y-2">
        <div className="text-xs uppercase font-black tracking-widest text-[#BA2649]">
          404 — PAGE NOT FOUND
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Looks like this game table is closed!
        </h1>
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          The page or game you are looking for might have moved or is temporarily unavailable.
        </p>
      </div>

      <Link
        href="/"
        className="btn-burgundy px-8 py-3 text-xs uppercase tracking-wider font-black shadow-retro flex items-center space-x-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to 777 Casino Lobby</span>
      </Link>
    </div>
  );
}
