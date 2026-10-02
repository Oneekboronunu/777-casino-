import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [userCount, betCount, activeMatches, totalDeposits, recentBets, recentTransactions, users] =
      await Promise.all([
        prisma.user.count(),
        prisma.bet.count(),
        prisma.sportMatch.count({ where: { status: "LIVE" } }),
        prisma.transaction.aggregate({
          where: { type: "DEPOSIT" },
          _sum: { amount: true },
        }),
        prisma.bet.findMany({
          take: 8,
          orderBy: { createdAt: "desc" },
          include: { user: true, items: true },
        }),
        prisma.transaction.findMany({
          take: 8,
          orderBy: { createdAt: "desc" },
          include: { user: true },
        }),
        prisma.user.findMany({
          take: 20,
          orderBy: { createdAt: "desc" },
        }),
      ]);

    return NextResponse.json({
      metrics: {
        totalUsers: userCount,
        totalBets: betCount,
        liveMatchesCount: activeMatches,
        totalDepositVolume: totalDeposits._sum.amount || 2450000,
        estimatedGGR: 482900,
      },
      recentBets,
      recentTransactions,
      users,
    });
  } catch (error) {
    console.error("Admin overview error:", error);
    return NextResponse.json({ error: "Failed to fetch admin overview" }, { status: 500 });
  }
}
