export interface ArcadeGame {
  id: string;
  title: string;
  category: "Slots" | "Roulette" | "Blackjack" | "Arcade" | "Jackpot" | "Live Casino";
  theme: "Adventure" | "Classic" | "Mythology" | "Candy" | "Fish" | "Table" | "Puzzle";
  badge?: "NEW" | "HOT" | "POPULAR";
  jackpotValue?: string;
  rtp?: string;
  minBet: number;
  bgGradient: string;
  iconEmoji: string;
  artworkType:
    | "fisherman"
    | "egypt"
    | "candy"
    | "roulette"
    | "zeus"
    | "fruit"
    | "plane"
    | "wheel"
    | "cards"
    | "boat-anchor"
    | "mask-drum"
    | "book-egypt"
    | "chalice-zeus";
  description: string;
}

export const ARCADE_GAMES: ArcadeGame[] = [
  // 1. Big Bass Splash (Exact match to screenshot card 1)
  {
    id: "big-bass-splash",
    title: "Big Bass Splash",
    category: "Slots",
    theme: "Fish",
    badge: "POPULAR",
    rtp: "96.7%",
    minBet: 100,
    bgGradient: "from-sky-500 via-cyan-600 to-teal-800",
    iconEmoji: "🎣",
    artworkType: "fisherman",
    description: "Reel in massive bass fish multipliers and dynamic free-spin arcade bonuses!",
  },
  // 2. Legacy of Dead (Exact match to screenshot card 2)
  {
    id: "legacy-of-dead",
    title: "Legacy of Dead",
    category: "Slots",
    theme: "Mythology",
    badge: "HOT",
    rtp: "96.5%",
    minBet: 100,
    bgGradient: "from-amber-600 via-yellow-700 to-amber-950",
    iconEmoji: "⚱️",
    artworkType: "egypt",
    description: "Uncover ancient golden pharaoh tombs with expanding mystical arcade scrolls.",
  },
  // 3. Holy Mackerel Extreme Fishing (Exact match to screenshot card 3 with $5,590.74 pill)
  {
    id: "holy-mackerel",
    title: "Holy Mackerel Extreme Fishing",
    category: "Slots",
    theme: "Fish",
    badge: "HOT",
    jackpotValue: "$5,590.74",
    rtp: "96.6%",
    minBet: 100,
    bgGradient: "from-sky-400 via-cyan-600 to-blue-900",
    iconEmoji: "⚓",
    artworkType: "boat-anchor",
    description: "Deep-sea extreme trawler quest with sunken chests and anchored multipliers.",
  },
  // 4. Sugar Rush Super Scatter (Exact match to screenshot card 4)
  {
    id: "sugar-rush",
    title: "Sugar Rush Super Scatter",
    category: "Slots",
    theme: "Candy",
    badge: "POPULAR",
    rtp: "96.5%",
    minBet: 100,
    bgGradient: "from-pink-400 via-fuchsia-500 to-purple-800",
    iconEmoji: "🍬",
    artworkType: "candy",
    description: "Tumble juicy gummy bears with exploding 128x arcade grid multipliers!",
  },
  // 5. 12 Masks of Fire Drum Frenzy (Exact match to screenshot card 5)
  {
    id: "12-masks-of-fire",
    title: "12 Masks of Fire Drum Frenzy",
    category: "Slots",
    theme: "Adventure",
    badge: "HOT",
    rtp: "96.3%",
    minBet: 100,
    bgGradient: "from-orange-500 via-red-600 to-amber-900",
    iconEmoji: "🥁",
    artworkType: "mask-drum",
    description: "Feel the rhythmic pulse of flaming African drums and instant scatter prizes.",
  },
  // 6. Book of Dead Go Collect (Exact match to screenshot card 6)
  {
    id: "book-of-dead",
    title: "Book of Dead Go Collect",
    category: "Slots",
    theme: "Mythology",
    badge: "POPULAR",
    rtp: "96.5%",
    minBet: 100,
    bgGradient: "from-amber-500 via-yellow-600 to-stone-900",
    iconEmoji: "📖",
    artworkType: "book-egypt",
    description: "Explore secret pyramid corridors and collect ancient gilded scarab treasures.",
  },
  // 7. Mega Fire Blaze Roulette (Exact match to screenshot card 7)
  {
    id: "mega-fire-blaze",
    title: "Mega Fire Blaze Roulette",
    category: "Roulette",
    theme: "Table",
    badge: "HOT",
    rtp: "97.3%",
    minBet: 50,
    bgGradient: "from-purple-900 via-rose-900 to-amber-900",
    iconEmoji: "🎡",
    artworkType: "roulette",
    description: "European single-zero wheel with blazing fire numbers paying up to 500x.",
  },
  // 8. Gates of Olympus Super Scatter (Exact match to screenshot card 8)
  {
    id: "gates-of-olympus",
    title: "Gates of Olympus Super Scatter",
    category: "Slots",
    theme: "Mythology",
    badge: "POPULAR",
    rtp: "96.5%",
    minBet: 100,
    bgGradient: "from-violet-600 via-purple-700 to-amber-900",
    iconEmoji: "⚡",
    artworkType: "chalice-zeus",
    description: "Zeus strikes lightning orbs with divine golden chalice cascade multipliers.",
  },

  // Additional Arcade & Table Hits
  {
    id: "sweet-bonanza",
    title: "Sweet Bonanza",
    category: "Slots",
    theme: "Candy",
    badge: "NEW",
    rtp: "96.4%",
    minBet: 100,
    bgGradient: "from-rose-500 via-pink-600 to-red-800",
    iconEmoji: "🍭",
    artworkType: "fruit",
    description: "All-ways pay candy bonanza with 100x rainbow bomb point multipliers.",
  },
  {
    id: "golden-treasure",
    title: "Golden Treasure",
    category: "Jackpot",
    theme: "Adventure",
    badge: "NEW",
    rtp: "96.8%",
    minBet: 150,
    bgGradient: "from-yellow-500 via-amber-600 to-amber-900",
    iconEmoji: "🏆",
    artworkType: "egypt",
    description: "Hunt ancient hidden chests filled with progressive virtual arcade jackpots.",
  },
  {
    id: "wild-adventure",
    title: "Wild Adventure",
    category: "Slots",
    theme: "Adventure",
    badge: "NEW",
    rtp: "96.2%",
    minBet: 100,
    bgGradient: "from-emerald-600 via-green-700 to-stone-900",
    iconEmoji: "🧭",
    artworkType: "fisherman",
    description: "Deep jungle safari expedition with expanding gorilla wilds.",
  },
  {
    id: "spin-to-win",
    title: "Spin to Win Wheel",
    category: "Arcade",
    theme: "Classic",
    badge: "HOT",
    rtp: "97.0%",
    minBet: 100,
    bgGradient: "from-violet-600 via-purple-700 to-indigo-950",
    iconEmoji: "🎡",
    artworkType: "wheel",
    description: "Luxury spinning lucky wheel with weighted slices and Jackpot prizes.",
  },
  {
    id: "aviator-crash",
    title: "Aviator Crash",
    category: "Arcade",
    theme: "Classic",
    badge: "HOT",
    rtp: "97.0%",
    minBet: 100,
    bgGradient: "from-red-600 via-rose-700 to-red-950",
    iconEmoji: "✈️",
    artworkType: "plane",
    description: "Take flight and cash out before the lucky red plane flies away!",
  },
  {
    id: "blackjack-21",
    title: "Blackjack 21 Pro",
    category: "Blackjack",
    theme: "Table",
    badge: "POPULAR",
    rtp: "99.2%",
    minBet: 100,
    bgGradient: "from-emerald-700 via-teal-800 to-slate-900",
    iconEmoji: "♠️",
    artworkType: "cards",
    description: "Classic Vegas rules: hit, stand, double down, or split to beat the dealer.",
  },
  {
    id: "carrom-arcade",
    title: "Carrom Board Pro",
    category: "Arcade",
    theme: "Classic",
    badge: "NEW",
    rtp: "98.0%",
    minBet: 50,
    bgGradient: "from-amber-700 via-yellow-800 to-amber-950",
    iconEmoji: "🎯",
    artworkType: "wheel",
    description: "Authentic striker physics board game with red Queen cover bonus.",
  },
];
