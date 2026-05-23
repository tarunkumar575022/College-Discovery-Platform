import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET all saved colleges for the logged-in user
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;

    const savedColleges = await prisma.savedCollege.findMany({
      where: { userId },
      include: {
        college: {
          include: {
            placements: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: savedColleges,
      message: 'Saved colleges retrieved successfully.',
    });
  } catch (error: any) {
    console.error('Get saved colleges error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

// POST to save a college
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const { collegeId } = await req.json().catch(() => ({}));

    // Verify user exists in database (handles stale session cookies after database re-seeding)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Your session is invalid or has expired. Please log out and log back in.' },
        { status: 401 }
      );
    }

    if (!collegeId) {
      return NextResponse.json(
        { success: false, message: 'College ID is required.' },
        { status: 400 }
      );
    }

    // Verify college exists
    const collegeExists = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!collegeExists) {
      return NextResponse.json(
        { success: false, message: 'College not found.' },
        { status: 404 }
      );
    }

    // Check if duplicate exists (handle duplicate gracefully)
    const existingBookmark = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId,
          collegeId,
        },
      },
    });

    if (existingBookmark) {
      return NextResponse.json({
        success: true,
        data: existingBookmark,
        message: 'College is already saved.',
      });
    }

    // Create bookmark
    const saved = await prisma.savedCollege.create({
      data: {
        userId,
        collegeId,
      },
      include: {
        college: true,
      },
    });

    return NextResponse.json(
      { success: true, data: saved, message: 'College saved successfully!' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Save college error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
