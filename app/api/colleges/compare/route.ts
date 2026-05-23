import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    let collegeIds: string[] = [];

    if (body.collegeIds) {
      if (Array.isArray(body.collegeIds)) {
        collegeIds = body.collegeIds;
      } else if (typeof body.collegeIds === 'string') {
        collegeIds = body.collegeIds.split(',').map((id: string) => id.trim()).filter(Boolean);
      }
    }

    if (collegeIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'At least one college ID is required for comparison.' },
        { status: 400 }
      );
    }

    const colleges = await prisma.college.findMany({
      where: {
        id: {
          in: collegeIds,
        },
      },
      include: {
        courses: true,
        placements: true,
        reviews: true,
      },
    });

    // Keep the ordering consistent with the requested list
    const orderedColleges = collegeIds
      .map((id) => colleges.find((c) => c.id === id))
      .filter((c): c is NonNullable<typeof c> => !!c);

    return NextResponse.json({
      success: true,
      data: orderedColleges,
      message: 'Comparison data retrieved successfully.',
    });
  } catch (error: any) {
    console.error('Compare colleges API error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
