export interface DecorationItem {
  id: string;
  name: string;
  type: "FRAME" | "TABLE_SKIN";
  price: number; // in Coins (0 = free/default)
  rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
  description: string;
  badge?: string;
  previewGradient: string;
  accentColor: string;
}

export const DECORATIONS_CATALOG: DecorationItem[] = [
  // AVATAR FRAMES
  {
    id: "frame-classic",
    name: "Classic Bronze Border",
    type: "FRAME",
    price: 0,
    rarity: "COMMON",
    description: "Standard clean casino member frame.",
    previewGradient: "from-amber-700 to-amber-900",
    accentColor: "#B45309",
  },
  {
    id: "frame-gold-777",
    name: "Royal 777 Gold Crown",
    type: "FRAME",
    price: 500,
    rarity: "RARE",
    badge: "POPULAR",
    description: "Embossed 24K gold ring with miniature 777 royal crown top piece.",
    previewGradient: "from-[#FFE066] via-[#F5B301] to-[#9E6E00]",
    accentColor: "#F5B301",
  },
  {
    id: "frame-neon-vegas",
    name: "Vegas Cyber Neon Glow",
    type: "FRAME",
    price: 1000,
    rarity: "RARE",
    badge: "HOT",
    description: "Electrified retro Vegas neon ring with pulsing hot-pink and cyan glow.",
    previewGradient: "from-pink-500 via-purple-500 to-cyan-400",
    accentColor: "#EC4899",
  },
  {
    id: "frame-emerald-vip",
    name: "Emerald High Roller",
    type: "FRAME",
    price: 2500,
    rarity: "EPIC",
    description: "Polished Colombian emerald bezel with glistening gem facets.",
    previewGradient: "from-emerald-400 via-teal-600 to-green-900",
    accentColor: "#10B981",
  },
  {
    id: "frame-cyber-phoenix",
    name: "Cyber Phoenix Flame",
    type: "FRAME",
    price: 5000,
    rarity: "EPIC",
    badge: "ANIMATED",
    description: "Animated mythical phoenix fire aura flickering around your profile.",
    previewGradient: "from-red-500 via-amber-500 to-yellow-400",
    accentColor: "#F97316",
  },
  {
    id: "frame-diamond-prismatic",
    name: "Diamond VIP Prismatic",
    type: "FRAME",
    price: 10000,
    rarity: "LEGENDARY",
    badge: "EXCLUSIVE",
    description: "Ultra-rare rainbow holographic diamond crystal with shining prismatic aura.",
    previewGradient: "from-sky-300 via-indigo-300 to-purple-400",
    accentColor: "#818CF8",
  },

  // GAME TABLE / ROOM DECORATIONS
  {
    id: "skin-felt-green",
    name: "Monte Carlo Green Felt",
    type: "TABLE_SKIN",
    price: 0,
    rarity: "COMMON",
    description: "Classic European high-stakes green baize felt table.",
    previewGradient: "from-emerald-800 to-emerald-950",
    accentColor: "#065F46",
  },
  {
    id: "skin-burgundy-velvet",
    name: "Venetian Burgundy Velvet",
    type: "TABLE_SKIN",
    price: 800,
    rarity: "RARE",
    badge: "ELEGANT",
    description: "Deep crimson royal velvet table with golden stitches and wood rails.",
    previewGradient: "from-[#BA2649] via-[#851833] to-[#381523]",
    accentColor: "#BA2649",
  },
  {
    id: "skin-cyber-midnight",
    name: "Midnight Cyber Matrix",
    type: "TABLE_SKIN",
    price: 2000,
    rarity: "EPIC",
    badge: "MODERN",
    description: "Futuristic dark obsidian table surface with illuminated neon lines.",
    previewGradient: "from-gray-900 via-slate-900 to-cyan-950",
    accentColor: "#06B6D4",
  },
  {
    id: "skin-golden-palace",
    name: "Emperor's Golden Palace",
    type: "TABLE_SKIN",
    price: 4500,
    rarity: "LEGENDARY",
    badge: "VIP ONLY",
    description: "Gold-threaded satin gaming surface adorned with embossed 777 motifs.",
    previewGradient: "from-amber-600 via-yellow-600 to-amber-950",
    accentColor: "#D97706",
  },
];
