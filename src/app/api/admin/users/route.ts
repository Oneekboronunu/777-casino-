import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { adjustUserBalanceOrCoins } from "@/lib/userStorage";
import { updateDepositStatus } from "@/lib/depositStorage";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId, action, amount, coins, depositId, role } = await req.json();

    // 1. APPROVE DEPOSIT REQUEST (Cash or Coins)
    if (action === "APPROVE_DEPOSIT") {
      const creditCash = parseFloat(amount || "0");
      const creditCoins = parseInt(coins || "0", 10);

      if (depositId) {
        await updateDepositStatus(depositId, "COMPLETED", creditCash > 0 ? "CASH" : "COINS", creditCash || creditCoins);
      }

      if (userId) {
        await adjustUserBalanceOrCoins(userId, creditCash, creditCoins);
      }

      return NextResponse.json({
        success: true,
        message: `Deposit approved! Credited ৳${creditCash.toLocaleString()} Cash & ${creditCoins.toLocaleString()} Coins to player account.`,
      });
    }

    // 2. REJECT DEPOSIT REQUEST
    if (action === "REJECT_DEPOSIT") {
      if (depositId) {
        await updateDepositStatus(depositId, "REJECTED");
      }
      return NextResponse.json({
        success: true,
        message: "Deposit request marked as Rejected.",
      });
    }

    // 3. MANUAL BALANCE OR COIN ADJUSTMENT
    if (action === "ADJUST_BALANCE" || action === "ADJUST_COINS") {
      const deltaCash = action === "ADJUST_BALANCE" ? parseFloat(amount || "0") : 0;
      const deltaCoins = action === "ADJUST_COINS" ? parseInt(coins || amount || "0", 10) : 0;

      const result = await adjustUserBalanceOrCoins(userId, deltaCash, deltaCoins);

      return NextResponse.json({
        message: `Account adjusted: ${deltaCash !== 0 ? `৳${deltaCash.toLocaleString()} Cash` : ""} ${deltaCoins !== 0 ? `${deltaCoins.toLocaleString()} Coins` : ""}`,
        ...result,
      });
    }

    // 4. APPROVE USER ACCOUNT
    if (action === "APPROVE_USER") {
      if (userId) {
        await adjustUserBalanceOrCoins(userId, 10000, 2000);
        try {
          await prisma.user.update({
            where: { id: userId },
            data: { isVerified: true, balance: { increment: 10000.0 } },
          });
        } catch {}
      }

      return NextResponse.json({
        success: true,
        message: "User account verified and activated (+৳10,000 Cash).",
      });
    }

    // 5. UPDATE USER ROLE
    if (action === "UPDATE_ROLE") {
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { role: role || "USER" },
        });
      } catch {}
      return NextResponse.json({ success: true, message: `Role updated to ${role}` });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin action error:", error);
    return NextResponse.json({ error: "Failed to perform admin action" }, { status: 500 });
  }
}
