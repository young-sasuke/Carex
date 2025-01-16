import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { Prisma } from '@prisma/client';

interface UserPostRequest {
  username: string;
  email: string;
  role: 'student' | 'host';
  age?: number;
  schoolName?: string;
  stream?: string;
  grade?: string;
  preferences?: {
    freeOrPaid: string;
    location: string;
    category: string;
    interests: string;
  };
}

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const {
      username,
      email,
      role,
      age,
      schoolName,
      stream,
      grade,
      preferences,
    }: UserPostRequest = body;

    // Validate required fields
    if (!username || !email || !role) {
      return NextResponse.json(
        { error: 'Username, email, and role are required' },
        { status: 400 }
      );
    }

    // Create the user data object
    const userData: Record<string, any> = {
      username,
      createdAt: new Date().toISOString(),
    };

    // Add optional fields to the data object for 'student' role
    if (role === 'student') {
      userData.age = age || null;
      userData.schoolName = schoolName || null;
      userData.stream = stream || null;
      userData.grade = grade || null;
      userData.preferences = preferences || null;
    }

    // Log the attempt for debugging
    console.log('Attempting to create user with data:', {
      email,
      role: role.toUpperCase(),
      userData,
    });

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        role: role.toUpperCase(),
        data: userData,
      },
    });

    // Log successful creation
    console.log('User created successfully:', newUser);

    // Return success response
    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role.toLowerCase(),
          username: (newUser.data as any).username,
          additionalData: newUser.data, // Include all additional data
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST handler:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle Prisma-specific errors
      switch (error.code) {
        case 'P2002':
          return NextResponse.json(
            { error: 'An account with this email already exists' },
            { status: 409 }
          );
        default:
          return NextResponse.json(
            { error: `Database error: ${error.code}` },
            { status: 500 }
          );
      }
    }

    return NextResponse.json(
      { error: 'Failed to create user account' },
      { status: 500 }
    );
  }
}
