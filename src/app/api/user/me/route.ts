import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = cookies();
    const cookieUserId = cookieStore.get("auth_user_id")?.value;

    // 1. Check direct cookie user
    if (cookieUserId) {
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
    }

    // 2. Check NextAuth session
    const session = await getServerSession(authOptions);
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

    // 3. Default demo player
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
