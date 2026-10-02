import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const match = await prisma.sportMatch.findUnique({
      where: { id },
      include: {
        markets: {
          include: {
            outcomes: true,
          },
        },
      },
    });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    return NextResponse.json({ match });
  } catch (error) {
    console.error("Match detail error:", error);
    return NextResponse.json({ error: "Failed to load match detail" }, { status: 500 });
  }
}
