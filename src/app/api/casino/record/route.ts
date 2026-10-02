import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { game, betAmount, multiplier, payout, isWin, details } = body;

    const stake = parseFloat(betAmount);
    const totalPayout = parseFloat(payout) || 0;
    const finalMultiplier = parseFloat(multiplier) || 0;

    if (!stake || stake < 5) {
      return NextResponse.json({ error: "Invalid bet amount" }, { status: 400 });
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

    // Check balance if net negative or if stake needs deduction
    // If win: netChange = totalPayout - stake
    // If loss: netChange = -stake
    const netChange = isWin ? totalPayout - stake : -stake;

    if (!isWin && user.balance < stake) {
      return NextResponse.json(
        { error: `Insufficient balance. Current: ৳${user.balance.toLocaleString()}` },
        { status: 400 }
      );
    }

    const [updatedUser, casinoRound] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          balance: { increment: netChange },
        },
      }),
      prisma.casinoRound.create({
        data: {
          userId: user.id,
          game: game || "CASINO",
          betAmount: stake,
          multiplier: finalMultiplier,
          payout: totalPayout,
          isWin: Boolean(isWin),
          details: typeof details === "object" ? JSON.stringify(details) : String(details || ""),
        },
      }),
      prisma.transaction.create({
        data: {
          userId: user.id,
          type: isWin ? "CASINO_WIN" : "BET_PLACED",
          amount: netChange,
          method: `${game} Casino`,
          status: "COMPLETED",
          note: isWin
            ? `${game} Win: ৳${totalPayout.toLocaleString()} (${finalMultiplier.toFixed(2)}x)`
            : `${game} Round Loss: -৳${stake.toLocaleString()}`,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      newBalance: updatedUser.balance,
      casinoRound,
      netChange,
    });
  } catch (error) {
    console.error("Casino record error:", error);
    return NextResponse.json({ error: "Failed to record casino round" }, { status: 500 });
  }
}
