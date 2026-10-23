import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { getAllUsers } from "@/lib/userStorage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = cookies();
    const cookieUserId = cookieStore.get("auth_user_id")?.value;

    // 1. Check direct cookie user in DB
    if (cookieUserId) {
      try {
        const dbUser = await prisma.user.findUnique({
          where: { id: cookieUserId },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            balance: true,
            bonusBalance: true,
            currency: true,
            referralCode: true,
          },
        });

        if (dbUser) {
          return NextResponse.json({ user: dbUser });
        }
      } catch (dbErr) {
        console.warn("DB user query error:", dbErr);
      }

      // Check fallback userStorage
      const storedUsers = await getAllUsers();
      const match = storedUsers.find((u) => u.id === cookieUserId || u.phone === cookieUserId);
      if (match) {
        return NextResponse.json({
          user: {
            id: match.id,
            name: match.name,
            email: match.email,
            phone: match.phone,
            role: match.role,
            balance: match.balance,
            bonusBalance: match.bonusBalance,
            currency: "BDT",
            referralCode: "WELCOME777",
            coins: match.coins || 1500,
          },
        });
      }
    }

    // 2. Default demo fallback user (ensures instant UI responsiveness)
    try {
      const defaultUser = await prisma.user.findFirst({
        where: { email: "player@auracasino.com" },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          balance: true,
          bonusBalance: true,
          currency: true,
          referralCode: true,
        },
      });

      if (defaultUser) {
        return NextResponse.json({ user: defaultUser });
      }
    } catch (fallbackErr) {
      console.warn("Fallback query error:", fallbackErr);
    }

    return NextResponse.json({
      user: {
        id: "demo_vip_user",
        name: "Demo Player",
        email: "player@auracasino.com",
        phone: "01788992211",
        role: "USER",
        balance: 24500,
        bonusBalance: 2000,
        currency: "BDT",
        referralCode: "WELCOME777",
        coins: 1500,
        equippedFrame: "frame-classic",
        equippedGameSkin: "skin-felt-green",
        inventory: ["frame-classic", "skin-felt-green"],
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({
      user: {
        id: "demo_vip_user",
        name: "Demo Player",
        email: "player@auracasino.com",
        phone: "01788992211",
        role: "USER",
        balance: 24500,
        bonusBalance: 2000,
        currency: "BDT",
        referralCode: "WELCOME777",
        coins: 1500,
        equippedFrame: "frame-classic",
        equippedGameSkin: "skin-felt-green",
        inventory: ["frame-classic", "skin-felt-green"],
      },
    });
  }
}
