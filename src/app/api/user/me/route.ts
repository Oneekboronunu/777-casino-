import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // If logged in via session
    if (session?.user?.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
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
    }

    // Default fallback demo user for frictionless local experience
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

    return NextResponse.json({ user: defaultUser });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
