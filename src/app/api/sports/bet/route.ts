import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { type, selections, stake, totalOdds, potentialPayout } = body;

    if (!selections || selections.length === 0) {
      return NextResponse.json({ error: "No selections in bet slip" }, { status: 400 });
    }

    const totalStake = parseFloat(stake);
    if (!totalStake || totalStake < 10) {
      return NextResponse.json({ error: "Minimum bet stake is ৳10" }, { status: 400 });
    }

    let user = null;
    if (session?.user?.email) {
      user = await prisma.user.findUnique({ where: { email: session.user.email } });
    }
    if (!user) {
      user = await prisma.user.findFirst({ where: { email: "player@auracasino.com" } });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.balance < totalStake) {
      return NextResponse.json(
        {
          error: `Insufficient balance. Your current balance is ৳${user.balance.toLocaleString()}. Please deposit to place this bet.`,
        },
        { status: 400 }
      );
    }

    // Place bet & deduct balance inside transaction
    const [updatedUser, bet] = await prisma.$transaction(async (tx) => {
      const u = await tx.user.update({
        where: { id: user.id },
        data: {
          balance: { decrement: totalStake },
        },
      });

      const newBet = await tx.bet.create({
        data: {
          userId: user.id,
          type: type || (selections.length > 1 ? "ACCUMULATOR" : "SINGLE"),
          totalOdds: parseFloat(totalOdds) || 1.0,
          stake: totalStake,
          potentialPayout: parseFloat(potentialPayout) || totalStake * 1.5,
          cashoutValue: Math.round(totalStake * 0.92), // Initial cashout offer
          status: "PENDING",
          items: {
            create: selections.map((s: any) => ({
              matchId: s.matchId || null,
              outcomeId: s.outcomeId || null,
              matchName: s.matchName,
              marketName: s.marketName,
              outcomeName: s.outcomeName,
              odds: parseFloat(s.odds) || 1.0,
              status: "PENDING",
            })),
          },
        },
        include: {
          items: true,
        },
      });

      await tx.transaction.create({
        data: {
          userId: user.id,
          type: "BET_PLACED",
          amount: -totalStake,
          method: "Sportsbook",
          status: "COMPLETED",
          note: `Bet placed on ${selections.length} selection(s) @ ${totalOdds}x`,
        },
      });

      return [u, newBet];
    });

    return NextResponse.json({
      success: true,
      message: `Bet of ৳${totalStake.toLocaleString()} placed successfully!`,
      bet,
      newBalance: updatedUser.balance,
    });
  } catch (error) {
    console.error("Bet placement error:", error);
    return NextResponse.json({ error: "Failed to place bet" }, { status: 500 });
  }
}
