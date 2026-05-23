import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const location = searchParams.get('location') || '';
    const rating = searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : 0;
    const feesMin = searchParams.get('feesMin') ? parseFloat(searchParams.get('feesMin')!) : 0;
    const feesMax = searchParams.get('feesMax') ? parseFloat(searchParams.get('feesMax')!) : Number.MAX_SAFE_INTEGER;
    const courseType = searchParams.get('courseType') || '';
    const ownership = searchParams.get('ownership') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;
    const skip = (page - 1) * limit;

    // Build the query where clause
    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
      };
    }

    if (location) {
      where.location = {
        contains: location,
      };
    }

    if (rating > 0) {
      where.rating = {
        gte: rating,
      };
    }

    if (feesMin > 0 || feesMax < Number.MAX_SAFE_INTEGER) {
      where.fees = {
        gte: feesMin,
        lte: feesMax,
      };
    }

    if (courseType) {
      where.courseTypes = {
        contains: courseType,
      };
    }

    if (ownership) {
      where.ownership = {
        equals: ownership,
      };
    }

    // Get total count for pagination
    const total = await prisma.college.count({ where });

    // Fetch paginated results
    const colleges = await prisma.college.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        rating: 'desc', // default order by highest rating first
      },
      include: {
        placements: true,
      },
    });

    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        colleges,
        total,
        page,
        pages,
      },
      message: 'Colleges fetched successfully.',
    });
  } catch (error: any) {
    console.error('Fetch colleges API error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
