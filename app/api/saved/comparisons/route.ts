import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET all saved comparisons for logged in user
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

    const savedComparisons = await prisma.savedComparison.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Resolve college details for each saved comparison to make the UI stunning
    const resolvedComparisons = await Promise.all(
      savedComparisons.map(async (comparison) => {
        const idArray = comparison.collegeIds
          .split(',')
          .map((id) => id.trim())
          .filter(Boolean);

        const colleges = await prisma.college.findMany({
          where: {
            id: { in: idArray },
          },
          select: {
            id: true,
            name: true,
            location: true,
            rating: true,
            fees: true,
            image: true,
          },
        });

        // Maintain the ordering of colleges
        const orderedColleges = idArray
          .map((id) => colleges.find((c) => c.id === id))
          .filter((c): c is NonNullable<typeof c> => !!c);

        return {
          ...comparison,
          colleges: orderedColleges,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: resolvedComparisons,
      message: 'Saved comparisons retrieved successfully.',
    });
  } catch (error: any) {
    console.error('Get saved comparisons error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

// POST to save a comparison set
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
    const body = await req.json().catch(() => ({}));

    // Verify user exists in database (handles stale session cookies after database re-seeding)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Your session is invalid or has expired. Please log out and log back in.' },
        { status: 401 }
      );
    }
    let collegeIdsStr = '';

    if (body.collegeIds) {
      if (Array.isArray(body.collegeIds)) {
        collegeIdsStr = body.collegeIds.join(',');
      } else if (typeof body.collegeIds === 'string') {
        collegeIdsStr = body.collegeIds;
      }
    }

    if (!collegeIdsStr) {
      return NextResponse.json(
        { success: false, message: 'College IDs list is required.' },
        { status: 400 }
      );
    }

    // Optional check: check if comparison with same collegeIds already exists for this user
    const existingComp = await prisma.savedComparison.findFirst({
      where: {
        userId,
        collegeIds: collegeIdsStr,
      },
    });

    if (existingComp) {
      return NextResponse.json({
        success: true,
        data: existingComp,
        message: 'This comparison set is already saved.',
      });
    }

    const savedComp = await prisma.savedComparison.create({
      data: {
        userId,
        collegeIds: collegeIdsStr,
      },
    });

    return NextResponse.json(
      { success: true, data: savedComp, message: 'Comparison set saved successfully!' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Save comparison error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
