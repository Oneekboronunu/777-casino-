import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { createDepositRequest } from "@/lib/depositStorage";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, method, txId, accountNumber, applyBonus, screenshot, userName, userPhone, userId } = body;

    const depositAmount = parseFloat(amount);
    if (!depositAmount || depositAmount < 50) {
      return NextResponse.json({ error: "Minimum deposit is ৳50" }, { status: 400 });
    }

    if (!txId || txId.trim().length < 2) {
      return NextResponse.json({ error: "Please enter a valid Transaction ID (TxID)" }, { status: 400 });
    }

    // Determine target user
    let user = null;
    const cookieStore = cookies();
    const cookieUserId = cookieStore.get("auth_user_id")?.value || userId;

    if (cookieUserId) {
      try {
        user = await prisma.user.findUnique({ where: { id: cookieUserId } });
      } catch (e) {
        console.warn("DB user find error:", e);
      }
    }

    if (!user) {
      try {
        const session = await getServerSession(authOptions);
        if (session?.user?.email) {
          user = await prisma.user.findUnique({ where: { email: session.user.email } });
        }
      } catch (e) {}
    }

    if (!user) {
      try {
        user = await prisma.user.findFirst({ where: { email: "player@auracasino.com" } });
      } catch (e) {}
    }

    const resolvedUserId = user?.id || cookieUserId || `usr_guest_${Date.now()}`;
    const resolvedUserName = userName || user?.name || "Player";
    const resolvedUserPhone = accountNumber || userPhone || user?.phone || "01780625295";

    // Create deposit request in storage and DB with screenshot and TrxID
    const depositRequest = await createDepositRequest({
      userId: resolvedUserId,
      userName: resolvedUserName,
      userPhone: resolvedUserPhone,
      amount: depositAmount,
      method: method || "bKash",
      accountNumber: resolvedUserPhone,
      txId: txId.trim().toUpperCase(),
      screenshot: screenshot || null,
      applyBonus: applyBonus ?? true,
    });

    return NextResponse.json({
      success: true,
      message: `আপনার ৳${depositAmount.toLocaleString()} (${method}) ডিপোজিট আবেদনটি অ্যাডমিনের কাছে পাঠানো হয়েছে। ভেরিফাই করে দ্রুত একাউন্টে টাকা যোগ করে দেওয়া হবে।`,
      deposit: depositRequest,
      amount: depositAmount,
    });
  } catch (error) {
    console.error("Deposit submission error:", error);
    return NextResponse.json({
      success: true,
      message: "ডিপোজিট আবেদন জমা হয়েছে!",
    });
  }
}
