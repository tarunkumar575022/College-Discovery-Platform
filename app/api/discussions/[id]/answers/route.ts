import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const questionId = params.id;
    const { content } = await req.json().catch(() => ({}));

    // Verify user exists in database (handles stale session cookies after database re-seeding)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Your session is invalid or has expired. Please log out and log back in.' },
        { status: 401 }
      );
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, message: 'Answer content is required.' },
        { status: 400 }
      );
    }

    // Verify question exists
    const questionExists = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!questionExists) {
      return NextResponse.json(
        { success: false, message: 'Question not found.' },
        { status: 404 }
      );
    }

    const newAnswer = await prisma.answer.create({
      data: {
        content: content.trim(),
        userId,
        questionId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, data: newAnswer, message: 'Answer posted successfully!' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Post answer error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
