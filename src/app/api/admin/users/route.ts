import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, action, amount, role } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

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
