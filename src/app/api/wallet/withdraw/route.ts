import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { amount, method, accountNumber } = body;

    const withdrawAmount = parseFloat(amount);
    if (!withdrawAmount || withdrawAmount < 500) {
      return NextResponse.json({ error: "Minimum withdrawal is ৳500" }, { status: 400 });
    }

    if (!accountNumber || accountNumber.trim().length < 8) {
      return NextResponse.json({ error: "Please enter a valid recipient account number" }, { status: 400 });
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

    if (user.balance < withdrawAmount) {
      return NextResponse.json(
        { error: `Insufficient funds. Your current balance is ৳${user.balance.toLocaleString()}` },
        { status: 400 }
      );
    }

    // Process withdrawal
    const [updatedUser, transaction] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          balance: { decrement: withdrawAmount },
        },
      }),
      prisma.transaction.create({
        data: {
          userId: user.id,
          type: "WITHDRAWAL",
          amount: withdrawAmount,
          method: method || "bKash",
          accountNumber: accountNumber.trim(),
          status: "COMPLETED",
          note: `Withdrawal of ৳${withdrawAmount.toLocaleString()} to ${accountNumber.trim()} via ${method}`,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: `Withdrawal request for ৳${withdrawAmount.toLocaleString()} processed successfully!`,
      newBalance: updatedUser.balance,
      transaction,
    });
  } catch (error) {
    console.error("Withdrawal error:", error);
    return NextResponse.json({ error: "Failed to process withdrawal" }, { status: 500 });
  }
}
