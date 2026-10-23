import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { recordNewUser } from "@/lib/userStorage";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { name, phone, couponCode, email, password } = await req.json();

    if (!name || (!phone && !email)) {
      return NextResponse.json(
        { error: "Name and Phone Number (bKash/Nagad/WhatsApp) are required" },
        { status: 400 }
      );
    }

    const cleanPhone = phone ? phone.trim() : "";
    const cleanName = name.trim();
    const cleanEmail = email ? email.trim().toLowerCase() : `${cleanPhone || Date.now()}@777casino.com`;
    const cleanCoupon = (couponCode || "").trim().toLowerCase();

    // Check Coupon: "welcomnewbie" gives 20,000 Coins bonus!
    const isWelcomeNewbie = cleanCoupon === "welcomnewbie" || cleanCoupon === "welcome_newbie";
    const initialCoins = isWelcomeNewbie ? 20000 : 1500;
    const initialBalance = 2000.0;
    const initialBonus = 2000.0;

    // Check if user already exists by phone or email
    let existingUser = null;
    try {
      existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            ...(cleanPhone ? [{ phone: cleanPhone }] : []),
            { email: cleanEmail },
          ],
        },
      });
    } catch (e) {
      console.warn("DB check user error:", e);
    }

    if (existingUser) {
      // Auto-login existing user seamlessly!
      const cookieStore = cookies();
      cookieStore.set("auth_user_id", existingUser.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 365 * 24 * 60 * 60, // 1 year permanent login
      });

      return NextResponse.json({
        success: true,
        message: `Welcome back, ${existingUser.name}! Automatically logged into your account.`,
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          phone: existingUser.phone,
          role: existingUser.role,
          balance: existingUser.balance,
          bonusBalance: existingUser.bonusBalance,
          currency: existingUser.currency,
          coins: isWelcomeNewbie ? Math.max(20000, 1500) : 1500,
          couponCode: cleanCoupon || existingUser.referralCode,
        },
      });
    }

    const internalPassword = password || `${cleanPhone || "user"}@777`;
    const passwordHash = await bcrypt.hash(internalPassword, 8);
    const newReferralCode = "AURA" + Math.floor(100000 + Math.random() * 900000);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    let createdUser = null;
    try {
      createdUser = await prisma.user.create({
        data: {
          id: userId,
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone || null,
          passwordHash,
          role: "USER",
          isVerified: true,
          balance: initialBalance,
          bonusBalance: initialBonus,
          currency: "BDT",
          referralCode: newReferralCode,
        },
      });

      await prisma.transaction.create({
        data: {
          userId: createdUser.id,
          type: "BONUS_CLAIM",
          amount: initialBonus,
          method: isWelcomeNewbie ? "Coupon welcomnewbie (20k Coins + ৳2k)" : "Welcome Bonus",
          status: "COMPLETED",
          note: isWelcomeNewbie ? "Coupon 'welcomnewbie' activated: +20,000 Coins & ৳2,000 Bonus" : "Welcome Bonus credited on signup",
        },
      });
    } catch (dbErr) {
      console.warn("DB user create failed, falling back to storage:", dbErr);
    }

    // Always record in storage for instant Admin Panel visibility
    const stored = await recordNewUser({
      id: createdUser?.id || userId,
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      role: "USER",
      balance: initialBalance,
      bonusBalance: initialBonus,
      coins: initialCoins,
      couponCode: cleanCoupon || null,
    });

    // Set cookie for 1 year so user never has to re-login!
    const cookieStore = cookies();
    cookieStore.set("auth_user_id", stored.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 365 * 24 * 60 * 60, // 1 year
    });

    const successMessage = isWelcomeNewbie
      ? `🎉 একাউন্ট তৈরি সফল হয়েছে! কুপন কোড 'welcomnewbie' সফলভাবে যোগ হয়েছে: ২০,০০০ কয়েন এবং ৳২,০০০ বোনাস আপনার একাউন্টে জমা হয়েছে!`
      : `স্বাগতম ${cleanName}! আপনার একাউন্ট সফলভাবে তৈরি হয়েছে এবং ৳২,০০০ ওয়েলকাম বোনাস যোগ হয়েছে।`;

    return NextResponse.json({
      success: true,
      message: successMessage,
      couponApplied: isWelcomeNewbie,
      coinsBonus: isWelcomeNewbie ? 20000 : 0,
      user: {
        id: stored.id,
        name: stored.name,
        email: stored.email,
        phone: stored.phone,
        role: stored.role,
        balance: stored.balance,
        bonusBalance: stored.bonusBalance,
        currency: "BDT",
        coins: stored.coins,
        referralCode: newReferralCode,
        couponCode: cleanCoupon,
      },
    });
  } catch (error) {
    console.error("Simplified registration error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
