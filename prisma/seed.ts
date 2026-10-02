import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Casino & Sportsbook database...");

  // Clean old records
  await prisma.betItem.deleteMany();
  await prisma.bet.deleteMany();
  await prisma.outcome.deleteMany();
  await prisma.market.deleteMany();
  await prisma.sportMatch.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.casinoRound.deleteMany();
  await prisma.jackpot.deleteMany();
  await prisma.user.deleteMany();

  const hashedAdminPassword = await bcrypt.hash("admin123", 10);
  const hashedUserPassword = await bcrypt.hash("demo123", 10);

  // 1. Create Users
  const admin = await prisma.user.create({
    data: {
      email: "admin@auracasino.com",
      phone: "+8801700000001",
      name: "Aura Grand Admin",
      passwordHash: hashedAdminPassword,
      role: "ADMIN",
      balance: 500000.0,
      bonusBalance: 25000.0,
      currency: "BDT",
      referralCode: "AURAADMIN",
    },
  });

  const demoPlayer = await prisma.user.create({
    data: {
      email: "player@auracasino.com",
      phone: "+8801711223344",
      name: "Tariqul Islam (VIP)",
      passwordHash: hashedUserPassword,
      role: "USER",
      balance: 24500.0,
      bonusBalance: 3200.0,
      currency: "BDT",
      referralCode: "WIN777",
    },
  });

  const vipPlayer = await prisma.user.create({
    data: {
      email: "vip@auracasino.com",
      phone: "+8801819998877",
      name: "Shahrier Kabir",
      passwordHash: hashedUserPassword,
      role: "VIP",
      balance: 120000.0,
      bonusBalance: 15000.0,
      currency: "BDT",
      referralCode: "ROYAL99",
    },
  });

  console.log("✅ Users created (admin@auracasino.com, player@auracasino.com)");

  // 2. Create Initial Jackpots
  await prisma.jackpot.createMany({
    data: [
      {
        title: "GRAND MEGA JACKPOT",
        currentAmount: 18452390.0,
        lastWinnerName: "Tanvir H. (Dhaka)",
        lastWinAmount: 2450000.0,
        updatedAt: new Date(),
      },
      {
        title: "CRICKET SUPER STRIKE",
        currentAmount: 3720450.0,
        lastWinnerName: "Rashid K.",
        lastWinAmount: 850000.0,
        updatedAt: new Date(),
      },
      {
        title: "AVIATOR HIGH ALTITUDE",
        currentAmount: 1250800.0,
        lastWinnerName: "Sohanur R.",
        lastWinAmount: 430000.0,
        updatedAt: new Date(),
      },
    ],
  });

  // 3. Create Sample Transactions for demo user
  await prisma.transaction.createMany({
    data: [
      {
        userId: demoPlayer.id,
        type: "DEPOSIT",
        amount: 15000.0,
        method: "bKash",
        accountNumber: "01711223344",
        txId: "BK992834190",
        status: "COMPLETED",
        note: "Instant bKash Deposit ৳15,000 + VIP Bonus",
      },
      {
        userId: demoPlayer.id,
        type: "BONUS_CLAIM",
        amount: 3200.0,
        method: "System",
        status: "COMPLETED",
        note: "100% Sportsbook Welcome Bonus",
      },
      {
        userId: demoPlayer.id,
        type: "BET_WIN",
        amount: 9500.0,
        method: "System",
        status: "COMPLETED",
        note: "Aviator Cashout at 4.75x",
      },
    ],
  });

  // 4. Create Cricket Matches & Markets
  const cskMi = await prisma.sportMatch.create({
    data: {
      sport: "CRICKET",
      tournament: "Indian Premier League 2026",
      homeTeam: "Chennai Super Kings",
      awayTeam: "Mumbai Indians",
      homeTeamCode: "CSK",
      awayTeamCode: "MI",
      homeScore: "174/4 (17.3)",
      awayScore: "189/6 (20)",
      status: "LIVE",
      matchTime: "LIVE 2nd Inning",
      venue: "Wankhede Stadium, Mumbai",
      liveMinute: "17.3 Ov",
      liveSummary: "CSK need 16 runs in 15 balls | Dhoni 28*(11), Jadeja 14*(8)",
      isHot: true,
      markets: {
        create: [
          {
            name: "Match Winner (2-Way)",
            category: "MAIN",
            status: "OPEN",
            outcomes: {
              create: [
                { name: "Chennai Super Kings", odds: 1.62 },
                { name: "Mumbai Indians", odds: 2.30 },
              ],
            },
          },
          {
            name: "Total Match Sixes (Over / Under 16.5)",
            category: "TOTALS",
            status: "OPEN",
            outcomes: {
              create: [
                { name: "Over 16.5 Sixes", odds: 1.88 },
                { name: "Under 16.5 Sixes", odds: 1.92 },
              ],
            },
          },
          {
            name: "Next Over Runs (Over 18 Total Runs)",
            category: "PROPS",
            status: "OPEN",
            outcomes: {
              create: [
                { name: "Over 10.5 Runs", odds: 1.95 },
                { name: "Under 10.5 Runs", odds: 1.80 },
              ],
            },
          },
          {
            name: "Highest Individual Score Range",
            category: "SCORES",
            status: "OPEN",
            outcomes: {
              create: [
                { name: "60 - 79 Runs", odds: 2.10 },
                { name: "80 - 99 Runs", odds: 3.40 },
                { name: "100+ Runs (Century)", odds: 6.50 },
              ],
            },
          },
        ],
      },
    },
  });

  const kkrRcb = await prisma.sportMatch.create({
    data: {
      sport: "CRICKET",
      tournament: "Indian Premier League 2026",
      homeTeam: "Kolkata Knight Riders",
      awayTeam: "Royal Challengers Bengaluru",
      homeTeamCode: "KKR",
      awayTeamCode: "RCB",
      homeScore: "208/5 (20)",
      awayScore: "84/1 (7.2)",
      status: "LIVE",
      matchTime: "LIVE 2nd Inning",
      venue: "Eden Gardens, Kolkata",
      liveMinute: "7.2 Ov",
      liveSummary: "Target 209 | Kohli 52*(24), Green 26*(18) | CRR 11.45",
      isHot: true,
      markets: {
        create: [
          {
            name: "Match Winner",
            category: "MAIN",
            status: "OPEN",
            outcomes: {
              create: [
                { name: "Kolkata Knight Riders", odds: 2.15 },
                { name: "Royal Challengers Bengaluru", odds: 1.72 },
              ],
            },
          },
          {
            name: "Total Match Runs (Over / Under 405.5)",
            category: "TOTALS",
            status: "OPEN",
            outcomes: {
              create: [
                { name: "Over 405.5", odds: 1.85 },
                { name: "Under 405.5", odds: 1.95 },
              ],
            },
          },
          {
            name: "Virat Kohli Total Runs",
            category: "PROPS",
            status: "OPEN",
            outcomes: {
              create: [
                { name: "Over 82.5 Runs", odds: 1.75 },
                { name: "Under 82.5 Runs", odds: 2.05 },
              ],
            },
          },
        ],
      },
    },
  });

  const bplFinal = await prisma.sportMatch.create({
    data: {
      sport: "CRICKET",
      tournament: "Bangladesh Premier League (BPL)",
      homeTeam: "Comilla Victorians",
      awayTeam: "Fortune Barishal",
      homeTeamCode: "COV",
      awayTeamCode: "FOB",
      homeScore: "0/0",
      awayScore: "0/0",
      status: "UPCOMING",
      matchTime: "Tonight 20:00",
      venue: "Shere Bangla National Stadium, Mirpur, Dhaka",
      liveMinute: "Starts in 2h 45m",
      liveSummary: "Pitch Report: Batting friendly wicket with slight evening dew",
      isHot: true,
      markets: {
        create: [
          {
            name: "Match Winner",
            category: "MAIN",
            status: "OPEN",
            outcomes: {
              create: [
                { name: "Comilla Victorians", odds: 1.80 },
                { name: "Fortune Barishal", odds: 2.05 },
              ],
            },
          },
          {
            name: "1st Innings 6 Overs Score (Powerplay)",
            category: "TOTALS",
            status: "OPEN",
            outcomes: {
              create: [
                { name: "Over 52.5 Runs", odds: 1.90 },
                { name: "Under 52.5 Runs", odds: 1.90 },
              ],
            },
          },
          {
            name: "Top Batsman Match Prediction",
            category: "PROPS",
            status: "OPEN",
            outcomes: {
              create: [
                { name: "Tamim Iqbal", odds: 3.20 },
                { name: "Litton Das", odds: 3.50 },
                { name: "Towhid Hridoy", odds: 4.10 },
                { name: "Mushfiqur Rahim", odds: 4.80 },
              ],
            },
          },
        ],
      },
    },
  });

  const indAus = await prisma.sportMatch.create({
    data: {
      sport: "CRICKET",
      tournament: "ICC Champions Trophy 2026",
      homeTeam: "India",
      awayTeam: "Australia",
      homeTeamCode: "IND",
      awayTeamCode: "AUS",
      homeScore: "312/7 (50)",
      awayScore: "245/4 (41.1)",
      status: "LIVE",
      matchTime: "LIVE 2nd Inning",
      venue: "Melbourne Cricket Ground (MCG)",
      liveMinute: "41.1 Ov",
      liveSummary: "Australia need 68 runs in 53 balls with 6 wickets in hand",
      isHot: true,
      markets: {
        create: [
          {
            name: "Match Winner",
            category: "MAIN",
            status: "OPEN",
            outcomes: {
              create: [
                { name: "India", odds: 1.78 },
                { name: "Australia", odds: 2.05 },
              ],
            },
          },
          {
            name: "Total Match Boundaries (4s + 6s)",
            category: "TOTALS",
            status: "OPEN",
            outcomes: {
              create: [
                { name: "Over 54.5", odds: 1.85 },
                { name: "Under 54.5", odds: 1.95 },
              ],
            },
          },
        ],
      },
    },
  });

  // 5. Create Football Matches & Markets
  const rmaMci = await prisma.sportMatch.create({
    data: {
      sport: "FOOTBALL",
      tournament: "UEFA Champions League Quarter-Final",
      homeTeam: "Real Madrid",
      awayTeam: "Manchester City",
      homeTeamCode: "RMA",
      awayTeamCode: "MCI",
      homeScore: "2",
      awayScore: "1",
      status: "LIVE",
      matchTime: "LIVE 72'",
      venue: "Santiago Bernabéu, Madrid",
      liveMinute: "72'",
      liveSummary: "Vinicius Jr. 24', Bellingham 58' | Haaland 41' | Shots: 14 - 12",
      isHot: true,
      markets: {
        create: [
          {
            name: "1X2 (Full Time Match Result)",
            category: "MAIN",
            status: "OPEN",
            outcomes: {
              create: [
                { name: "Real Madrid (1)", odds: 1.48 },
                { name: "Draw (X)", odds: 4.10 },
                { name: "Manchester City (2)", odds: 6.80 },
              ],
            },
          },
          {
            name: "Correct Score Prediction",
            category: "SCORES",
            status: "OPEN",
            outcomes: {
              create: [
                { name: "2 - 1", odds: 2.20 },
                { name: "3 - 1", odds: 3.60 },
                { name: "2 - 2", odds: 5.50 },
                { name: "3 - 2", odds: 8.50 },
                { name: "2 - 3", odds: 14.0 },
              ],
            },
          },
          {
            name: "Total Goals (Over / Under 3.5)",
            category: "TOTALS",
            status: "OPEN",
            outcomes: {
              create: [
                { name: "Over 3.5 Goals", odds: 1.82 },
                { name: "Under 3.5 Goals", odds: 1.98 },
              ],
            },
          },
          {
            name: "Next Goal (Goal 4)",
            category: "PROPS",
            status: "OPEN",
            outcomes: {
              create: [
                { name: "Real Madrid", odds: 2.40 },
                { name: "No More Goals", odds: 2.10 },
                { name: "Manchester City", odds: 3.10 },
              ],
            },
          },
        ],
      },
    },
  });

  const arsChe = await prisma.sportMatch.create({
    data: {
      sport: "FOOTBALL",
      tournament: "English Premier League",
      homeTeam: "Arsenal",
      awayTeam: "Chelsea",
      homeTeamCode: "ARS",
      awayTeamCode: "CHE",
      homeScore: "1",
      awayScore: "0",
      status: "LIVE",
      matchTime: "LIVE 38'",
      venue: "Emirates Stadium, London",
      liveMinute: "38'",
      liveSummary: "Saka 19' | Arsenal dominating midfield (62% Possession)",
      isHot: true,
      markets: {
        create: [
          {
            name: "1X2 (Full Time Match Result)",
            category: "MAIN",
            status: "OPEN",
            outcomes: {
              create: [
                { name: "Arsenal (1)", odds: 1.55 },
                { name: "Draw (X)", odds: 3.90 },
                { name: "Chelsea (2)", odds: 5.80 },
              ],
            },
          },
          {
            name: "Both Teams To Score (BTTS)",
            category: "PROPS",
            status: "OPEN",
            outcomes: {
              create: [
                { name: "Yes (BTTS)", odds: 1.72 },
                { name: "No (Clean sheet)", odds: 2.10 },
              ],
            },
          },
          {
            name: "Correct Score",
            category: "SCORES",
            status: "OPEN",
            outcomes: {
              create: [
                { name: "1 - 0", odds: 3.50 },
                { name: "2 - 0", odds: 4.20 },
                { name: "2 - 1", odds: 5.00 },
                { name: "1 - 1", odds: 4.60 },
                { name: "3 - 1", odds: 7.50 },
              ],
            },
          },
        ],
      },
    },
  });

  const barBay = await prisma.sportMatch.create({
    data: {
      sport: "FOOTBALL",
      tournament: "UEFA Champions League",
      homeTeam: "Barcelona",
      awayTeam: "Bayern Munich",
      homeTeamCode: "BAR",
      awayTeamCode: "BAY",
      homeScore: "0",
      awayScore: "0",
      status: "UPCOMING",
      matchTime: "Tomorrow 01:00",
      venue: "Estadi Olímpic Lluís Companys, Barcelona",
      liveMinute: "Upcoming",
      liveSummary: "High-octane European clash featuring Lewandowski & Kane",
      isHot: true,
      markets: {
        create: [
          {
            name: "1X2 (Match Winner)",
            category: "MAIN",
            status: "OPEN",
            outcomes: {
              create: [
                { name: "Barcelona (1)", odds: 2.25 },
                { name: "Draw (X)", odds: 3.75 },
                { name: "Bayern Munich (2)", odds: 2.90 },
              ],
            },
          },
          {
            name: "Total Goals (Over / Under 3.5)",
            category: "TOTALS",
            status: "OPEN",
            outcomes: {
              create: [
                { name: "Over 3.5 Goals", odds: 2.05 },
                { name: "Under 3.5 Goals", odds: 1.75 },
              ],
            },
          },
          {
            name: "Anytime Goalscorer",
            category: "PROPS",
            status: "OPEN",
            outcomes: {
              create: [
                { name: "Harry Kane", odds: 1.95 },
                { name: "Robert Lewandowski", odds: 2.05 },
                { name: "Lamine Yamal", odds: 3.10 },
                { name: "Jamal Musiala", odds: 3.40 },
              ],
            },
          },
        ],
      },
    },
  });

  // 6. Create sample Casino Round logs
  await prisma.casinoRound.createMany({
    data: [
      {
        userId: demoPlayer.id,
        game: "AVIATOR",
        betAmount: 2000.0,
        multiplier: 4.75,
        payout: 9500.0,
        isWin: true,
        details: JSON.stringify({ crashPoint: 8.42, cashedOutAt: 4.75 }),
      },
      {
        userId: demoPlayer.id,
        game: "ROULETTE",
        betAmount: 1000.0,
        multiplier: 2.0,
        payout: 2000.0,
        isWin: true,
        details: JSON.stringify({ betType: "RED", landedNumber: 7, color: "red" }),
      },
      {
        userId: demoPlayer.id,
        game: "CARROM",
        betAmount: 1500.0,
        multiplier: 3.5,
        payout: 5250.0,
        isWin: true,
        details: JSON.stringify({ coinsPotted: 5, queenCovered: true, score: 75 }),
      },
    ],
  });

  console.log("🎉 Database seeded successfully with matches, odds, and demo accounts!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
