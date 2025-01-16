import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // Fetch events where the user is a participant
    const participatedEvents = await prisma.event.findMany({
      where: {
        participants: {
          some: { id: Number(userId) },
        },
      },
      include: {
        host: true,
      },
    });

    return NextResponse.json(participatedEvents);
  } catch (error) {
    console.error("Error fetching participated events:", error);
    return NextResponse.json({ message: "Error fetching participated events" }, { status: 500 });
  }
}