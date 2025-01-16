import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      name,
      organizerName,
      location,
      contactName,
      contactPhone,
      contactEmail,
      contactDesignation,
      freeOrPaid,
      category,
      interests,
      startDate,
      endDate,
      durationInDays,
      eligibility,
      prize,
      stream,
      description,
      hostId,
    } = await req.json();

    // Validate required fields
    if (
      !name ||
      !organizerName ||
      !location ||
      !contactName ||
      !contactPhone ||
      !contactEmail ||
      !contactDesignation ||
      !freeOrPaid ||
      !category ||
      !startDate ||
      !endDate ||
      !durationInDays ||
      !eligibility ||
      !prize ||
      !stream ||
      !description ||
      !hostId
    ) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const uid = Number(hostId);

    // Create a new event in the database
    const newEvent = await prisma.event.create({
      data: {
        name,
        organizerName,
        location,
        contactName,
        contactPhone,
        contactEmail,
        contactDesignation,
        freeOrPaid,
        category,
        interests,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        durationInDays: Number(durationInDays),
        eligibility,
        prize,
        stream,
        description,
        hostId: uid,
      },
    });

    return NextResponse.json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ message: "Error creating event" }, { status: 500 });
  }
}
