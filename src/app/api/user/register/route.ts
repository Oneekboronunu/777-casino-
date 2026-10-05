import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

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

    // Create user with instant verification
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        phone: phone ? phone.trim() : null,
        passwordHash,
        role: "USER",
        isVerified: true,
        balance: 2000.0,
        bonusBalance: 2000.0,
        currency: "BDT",
        referralCode: newReferralCode,
        referredBy: referralCode ? referralCode.trim() : null,
      },
    });

    // Create initial Welcome Bonus transaction
    await prisma.transaction.create({
      data: {
        userId: user.id,
        type: "BONUS_CLAIM",
        amount: 2000.0,
        method: "Welcome Bonus",
        status: "COMPLETED",
        note: `Welcome Bonus ৳2,000 credited on signup.`,
      },
    });

    // Set cookie session
    const cookieStore = cookies();
    cookieStore.set("auth_user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully! ৳2,000 Welcome Bonus has been credited.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        balance: user.balance,
        bonusBalance: user.bonusBalance,
        currency: user.currency,
        referralCode: user.referralCode,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}

