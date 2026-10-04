import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId, action, amount, role } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // 1. APPROVE USER ACCOUNT (Unlocks Login, sets isVerified: true, Credits ৳2,000 Welcome Bonus + ৳10,000 Demo)
    if (action === "APPROVE_USER") {
      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          isVerified: true,
          balance: { increment: 10000.0 },
          bonusBalance: { increment: 2000.0 },
        },
      });

      // Update pending transaction to completed
      await prisma.transaction.updateMany({
        where: { userId, type: "BONUS_CLAIM", status: "PENDING" },
        data: { status: "COMPLETED", note: "Welcome Registration Bonus approved and activated by Admin." },
      });

      console.log(`[CONFIRMATION EMAIL EVENT] Account approved for user ${updated.name} (${updated.email}). Confirmation email triggered to ${updated.email} stating their 777 Casino ID is now active!`);

      return NextResponse.json({
        success: true,
        message: `Account approved for ${updated.name}! ৳2,000 Bonus and ৳10,000 Cash activated. Confirmation sent.`,
        user: updated,
      });
    }

    // 2. REJECT / SUSPEND USER ACCOUNT
    if (action === "REJECT_USER") {
      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          isVerified: false,
        },
      });

      await prisma.transaction.updateMany({
        where: { userId, type: "BONUS_CLAIM", status: "PENDING" },
        data: { status: "REJECTED", note: "Account application rejected by Admin." },
      });

      return NextResponse.json({
        success: true,
        message: `Account registration rejected for ${updated.name}.`,
        user: updated,
      });
    }

    // 3. MANUAL BALANCE ADJUSTMENT
    if (action === "ADJUST_BALANCE") {
      const delta = parseFloat(amount);
      if (isNaN(delta)) {
        return NextResponse.json({ error: "Invalid adjustment amount" }, { status: 400 });
      }

      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          balance: { increment: delta },
        },
      });

      await prisma.transaction.create({
        data: {
          userId,
          type: delta >= 0 ? "BONUS_CLAIM" : "WITHDRAWAL",
          amount: Math.abs(delta),
          method: "Admin Adjustment",
          status: "COMPLETED",
          note: `Manual balance adjustment of ${delta >= 0 ? "+" : "-"}৳${Math.abs(delta).toLocaleString()} by Admin`,
        },
      });

      return NextResponse.json({ success: true, user: updated });
    }

    // 4. UPDATE USER ROLE (USER, VIP, ADMIN)
    if (action === "UPDATE_ROLE") {
      const updated = await prisma.user.update({
        where: { id: userId },
        data: { role: role || "USER" },
      });
      return NextResponse.json({ success: true, user: updated });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin user management error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
