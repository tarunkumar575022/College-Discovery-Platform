import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET all discussions, optionally filtered by collegeId
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const collegeId = searchParams.get('collegeId');

    const filter: any = {};
    if (collegeId) {
      filter.collegeId = collegeId;
    }

    const questions = await prisma.question.findMany({
      where: filter,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        college: {
          select: {
            id: true,
            name: true,
          },
        },
        answers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: questions,
      message: 'Questions retrieved successfully.',
    });
  } catch (error: any) {
    console.error('Get discussions error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

// POST a new question
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
    const { title, content, collegeId } = await req.json().catch(() => ({}));

    // Verify user exists in database (handles stale session cookies after database re-seeding)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Your session is invalid or has expired. Please log out and log back in.' },
        { status: 401 }
      );
    }

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, message: 'Question title is required.' },
        { status: 400 }
      );
    }

    const newQuestion = await prisma.question.create({
      data: {
        title: title.trim(),
        content: content?.trim() || null,
        userId,
        collegeId: collegeId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        college: {
          select: {
            id: true,
            name: true,
          },
        },
        answers: true,
      },
    });

    return NextResponse.json(
      { success: true, data: newQuestion, message: 'Question posted successfully!' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Post question error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'An internal server error occurred.', stack: error.stack },
      { status: 500 }
    );
  }
}
