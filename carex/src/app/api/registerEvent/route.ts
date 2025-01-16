// app/api/registerEvent/route.ts

import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId, eventId, role } = await request.json();

    if (!userId || !eventId || !role) {
      return NextResponse.json({ message: "User ID, Event ID, and Role are required" }, { status: 400 });
    }

    // Check if the role is 'STUDENT'
    if (role !== "student") {
      return NextResponse.json({ message: "Only students can register for events" }, { status: 403 });
    }

    // Register the student for the event
    const updatedEvent = await prisma.event.update({
      where: { id: Number(eventId) },
      data: {
        participants: {
          connect: { id: Number(userId) },
        },
      },
    });

    return NextResponse.json({ message: "Registration successful", event: updatedEvent });
  } catch (error) {
    console.error("Error registering for the event:", error);
    return NextResponse.json({ message: "Error registering for the event" }, { status: 500 });
  }
}
