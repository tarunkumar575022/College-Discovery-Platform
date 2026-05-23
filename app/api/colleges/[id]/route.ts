import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'College ID is required.' },
        { status: 400 }
      );
    }

    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        courses: true,
        placements: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!college) {
      return NextResponse.json(
        { success: false, message: 'College not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: college,
      message: 'College details retrieved successfully.',
    });
  } catch (error: any) {
    console.error('Fetch college detail error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

// Allow logged in users to submit a review
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const collegeId = params.id;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'You must be logged in to submit a review.' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const { rating, comment } = await req.json();

    if (!rating || !comment) {
      return NextResponse.json(
        { success: false, message: 'Rating (1-5) and comment are required.' },
        { status: 400 }
      );
    }

    const parsedRating = parseInt(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json(
        { success: false, message: 'Rating must be an integer between 1 and 5.' },
        { status: 400 }
      );
    }

    // Verify user exists in database (handles stale session cookies after database re-seeding)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Your session is invalid or has expired. Please log out and log back in.' },
        { status: 401 }
      );
    }

    // Verify college exists
    const college = await prisma.college.findUnique({ where: { id: collegeId } });
    if (!college) {
      return NextResponse.json(
        { success: false, message: 'College not found.' },
        { status: 404 }
      );
    }

    // Check if user already reviewed this college (optional: allow multiple or update, let's just create a new one)
    const newReview = await prisma.review.create({
      data: {
        rating: parsedRating,
        comment,
        userId,
        collegeId,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Update the college's average rating in the background
    const allReviews = await prisma.review.findMany({
      where: { collegeId },
      select: { rating: true },
    });
    
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await prisma.college.update({
      where: { id: collegeId },
      data: { rating: parseFloat(avgRating.toFixed(1)) },
    });

    return NextResponse.json({
      success: true,
      data: newReview,
      message: 'Review submitted successfully!',
    });
  } catch (error: any) {
    console.error('Submit review error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
