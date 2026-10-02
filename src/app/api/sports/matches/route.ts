import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sport = searchParams.get("sport"); // CRICKET, FOOTBALL, or null
    const status = searchParams.get("status"); // LIVE, UPCOMING, or null

    const whereClause: any = {};
    if (sport && sport !== "ALL") {
      whereClause.sport = sport.toUpperCase();
    }
    if (status) {
      whereClause.status = status.toUpperCase();
    }

    const matches = await prisma.sportMatch.findMany({
      where: whereClause,
      include: {
        markets: {
          include: {
            outcomes: true,
          },
        },
      },
      orderBy: [
        { status: "asc" }, // LIVE comes before UPCOMING
        { isHot: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ matches });
  } catch (error) {
    console.error("Matches fetch error:", error);
    return NextResponse.json({ error: "Failed to load matches" }, { status: 500 });
  }
}
