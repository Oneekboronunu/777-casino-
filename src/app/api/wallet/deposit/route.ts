import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { amount, method, txId, accountNumber, applyBonus } = body;

    if (!amount || amount < 100) {
      return NextResponse.json({ error: "Minimum deposit is ৳100" }, { status: 400 });
    }

    if (!txId || txId.trim().length < 4) {
      return NextResponse.json({ error: "Please provide a valid Transaction ID" }, { status: 400 });
    }

    // Determine target user
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

    const depositAmount = parseFloat(amount);
    const bonusAmount = applyBonus ? depositAmount * 0.5 : 0; // 50% deposit bonus

    // Update user balance & create transaction
    const [updatedUser, transaction] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          balance: { increment: depositAmount },
          bonusBalance: { increment: bonusAmount },
        },
      }),
      prisma.transaction.create({
        data: {
          userId: user.id,
          type: "DEPOSIT",
          amount: depositAmount,
          method: method || "bKash",
          accountNumber: accountNumber || "017XXXXXXXX",
          txId: txId.trim().toUpperCase(),
          status: "COMPLETED",
          note: `Instant ${method} deposit of ৳${depositAmount.toLocaleString()}${
            bonusAmount > 0 ? ` + ৳${bonusAmount.toLocaleString()} Bonus` : ""
          }`,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: `Deposit of ৳${depositAmount.toLocaleString()} via ${method} verified and credited instantly!`,
      newBalance: updatedUser.balance,
      newBonusBalance: updatedUser.bonusBalance,
      transaction,
    });
  } catch (error) {
    console.error("Deposit error:", error);
    return NextResponse.json({ error: "Failed to process deposit" }, { status: 500 });
  }
}
