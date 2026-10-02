import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, matchId, homeScore, awayScore, liveMinute, liveSummary, status, outcomeId } = body;

    if (!matchId) {
      return NextResponse.json({ error: "Match ID is required" }, { status: 400 });
    }

    if (action === "UPDATE_SCORE") {
      const match = await prisma.sportMatch.update({
        where: { id: matchId },
        data: {
          homeScore: homeScore !== undefined ? String(homeScore) : undefined,
          awayScore: awayScore !== undefined ? String(awayScore) : undefined,
          liveMinute: liveMinute !== undefined ? String(liveMinute) : undefined,
          liveSummary: liveSummary !== undefined ? String(liveSummary) : undefined,
          status: status || undefined,
        },
      });

      return NextResponse.json({ success: true, match });
    }

    if (action === "SETTLE_OUTCOME") {
      if (!outcomeId) {
        return NextResponse.json({ error: "Outcome ID is required" }, { status: 400 });
      }

      // Mark winning outcome
      const outcome = await prisma.outcome.update({
        where: { id: outcomeId },
        data: { isWinner: true },
        include: { market: true },
      });

      // Find all pending bet items for this outcome and mark WON
      const winningItems = await prisma.betItem.findMany({
        where: { outcomeId, status: "PENDING" },
        include: { bet: { include: { items: true } } },
      });

      for (const item of winningItems) {
        await prisma.betItem.update({
          where: { id: item.id },
          data: { status: "WON" },
        });

        // Check if full bet is won
        const bet = item.bet;
        const allItems = bet.items;
        const remainingPending = allItems.filter((i) => i.id !== item.id && i.status === "PENDING");
        const anyLost = allItems.some((i) => i.status === "LOST");

        if (!anyLost && remainingPending.length === 0) {
          // Bet is won! Pay out to user
          await prisma.bet.update({
            where: { id: bet.id },
            data: {
              status: "WON",
              returnAmount: bet.potentialPayout,
            },
          });

          await prisma.user.update({
            where: { id: bet.userId },
            data: {
              balance: { increment: bet.potentialPayout },
            },
          });

          await prisma.transaction.create({
            data: {
              userId: bet.userId,
              type: "BET_WIN",
              amount: bet.potentialPayout,
              method: "Sportsbook Settlement",
              status: "COMPLETED",
              note: `Settled Win for Bet #${bet.id.slice(-6)}: +৳${bet.potentialPayout.toLocaleString()}`,
            },
          });
        }
      }

      return NextResponse.json({
        success: true,
        message: `Outcome settled and winning payouts credited!`,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Match action error:", error);
    return NextResponse.json({ error: "Failed to update match" }, { status: 500 });
  }
}
