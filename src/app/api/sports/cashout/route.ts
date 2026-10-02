import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { betId } = await req.json();

    if (!betId) {
      return NextResponse.json({ error: "Bet ID is required" }, { status: 400 });
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

    const bet = await prisma.bet.findFirst({
      where: {
        id: betId,
        userId: user.id,
        status: "PENDING",
      },
    });

    if (!bet) {
      return NextResponse.json({ error: "Bet is not eligible for cash out" }, { status: 400 });
    }

    const cashoutAmount = bet.cashoutValue || Math.round(bet.stake * 0.9);

    const [updatedUser, updatedBet] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          balance: { increment: cashoutAmount },
        },
      }),
      prisma.bet.update({
        where: { id: bet.id },
        data: {
          status: "CASHED_OUT",
          isCashedOut: true,
          returnAmount: cashoutAmount,
        },
      }),
      prisma.transaction.create({
        data: {
          userId: user.id,
          type: "BET_WIN",
          amount: cashoutAmount,
          method: "Sportsbook Cashout",
          status: "COMPLETED",
          note: `Early cashout for ticket #${bet.id.slice(-6)}`,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: `Cashed out ৳${cashoutAmount.toLocaleString()} successfully!`,
      newBalance: updatedUser.balance,
      bet: updatedBet,
    });
  } catch (error) {
    console.error("Cashout error:", error);
    return NextResponse.json({ error: "Failed to process cashout" }, { status: 500 });
  }
}
