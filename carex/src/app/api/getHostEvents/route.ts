// pages/api/getHostEvents.ts

import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { hostId } = await req.json();
    
    if (!hostId) {
      return NextResponse.json({ message: "Host ID is required" }, { status: 400 });
    }

    const events = await prisma.event.findMany({
      where: {
        hostId: Number(hostId),
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ message: "Error fetching events" }, { status: 500 });
  }
}
