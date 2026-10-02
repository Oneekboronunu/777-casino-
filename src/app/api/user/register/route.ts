import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, phone, password, referralCode } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          ...(phone ? [{ phone: phone.trim() }] : []),
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account already exists with this email or phone number" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newReferralCode = "AURA" + Math.floor(100000 + Math.random() * 900000);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        phone: phone ? phone.trim() : null,
        passwordHash,
        role: "USER",
        balance: 10000.0, // Welcome signup demo cash
        bonusBalance: 2000.0, // 2,000 Welcome Bonus
        currency: "BDT",
        referralCode: newReferralCode,
        referredBy: referralCode ? referralCode.trim() : null,
      },
    });

    // Create a welcome transaction record
    await prisma.transaction.create({
      data: {
        userId: user.id,
        type: "BONUS_CLAIM",
        amount: 2000.0,
        method: "System",
        status: "COMPLETED",
        note: "Welcome Registration Bonus credited",
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        bonusBalance: user.bonusBalance,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
