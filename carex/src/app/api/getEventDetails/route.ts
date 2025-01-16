import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Event ID is required" }, { status: 400 });
    }

    // Fetch the event and its participants
    const event = await prisma.event.findUnique({
      where: { id: Number(id) },
      include: {
        participants: {
          select: {
            id: true,
            email: true,
            data: true, // Assuming `data` contains additional details
            role: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error("Error fetching event details:", error);
    return NextResponse.json({ message: "Error fetching event details" }, { status: 500 });
  }
}
