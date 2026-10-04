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

    // Create user with PENDING verification status (isVerified: false)
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        phone: phone ? phone.trim() : null,
        passwordHash,
        role: "USER",
        isVerified: false, // Requires Admin Approval
        balance: 0.0,
        bonusBalance: 0.0,
        currency: "BDT",
        referralCode: newReferralCode,
        referredBy: referralCode ? referralCode.trim() : null,
      },
    });

    // Create initial Pending Registration transaction
    await prisma.transaction.create({
      data: {
        userId: user.id,
        type: "BONUS_CLAIM",
        amount: 2000.0,
        method: "Admin Verification",
        status: "PENDING",
        note: `Registration received. Pending verification by Admin (notified at yasinworks925@gmail.com).`,
      },
    });

    console.log(`[ADMIN NOTIFICATION EVENT] New user registered: ${name} (${normalizedEmail}, Phone: ${phone || 'N/A'}). Sent notification to admin: yasinworks925@gmail.com`);

    return NextResponse.json({
      success: true,
      pendingApproval: true,
      message: "Registration submitted successfully! Your account has been sent to the Admin for approval. You will receive confirmation once approved.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isVerified: false,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
