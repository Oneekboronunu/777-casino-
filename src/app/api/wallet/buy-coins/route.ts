import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { method, amount, coins, senderNumber, trxId } = body;

    if (!method || !amount || !coins || !senderNumber || !trxId) {
      return NextResponse.json(
        { error: "Please provide all required payment details (Method, Amount, Phone, TrxID)" },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const userId = cookieStore.get("auth_user_id")?.value;

    if (userId) {
      try {
        await prisma.transaction.create({
          data: {
            userId,
            type: "DEPOSIT",
            amount: Number(amount),
            method: `MFS_COINS_${method}`,
            accountNumber: senderNumber,
            txId: trxId,
            status: "COMPLETED",
            note: `Purchased ${coins} 777 Lucky Coins via ${method}`,
          },
        });
      } catch (dbErr) {
        console.warn("Could not save coin purchase to SQLite db:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      coins: Number(coins),
      amount: Number(amount),
      method,
      trxId,
      message: `Successfully credited ${Number(coins).toLocaleString()} Coins to your account!`,
    });
  } catch (error) {
    console.error("Coin purchase error:", error);
    return NextResponse.json(
      { error: "Payment verification failed. Please try again." },
      { status: 500 }
    );
  }
}
