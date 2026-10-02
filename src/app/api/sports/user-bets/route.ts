import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    let user = null;

    if (session?.user?.email) {
      user = await prisma.user.findUnique({ where: { email: session.user.email } });
    }
    if (!user) {
      user = await prisma.user.findFirst({ where: { email: "player@auracasino.com" } });
    }

    if (!user) {
      return NextResponse.json({ bets: [] });
    }

    const bets = await prisma.bet.findMany({
      where: { userId: user.id },
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ bets });
  } catch (error) {
    console.error("User bets error:", error);
    return NextResponse.json({ error: "Failed to fetch bets" }, { status: 500 });
  }
}
