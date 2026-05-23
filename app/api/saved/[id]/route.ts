import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const targetId = params.id;

    // Verify user exists in database (handles stale session cookies after database re-seeding)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Your session is invalid or has expired. Please log out and log back in.' },
        { status: 401 }
      );
    }

    if (!targetId) {
      return NextResponse.json(
        { success: false, message: 'ID is required.' },
        { status: 400 }
      );
    }

    // Bulletproof deletion check: check if targetId matches SavedCollege.id OR College.id
    const bookmark = await prisma.savedCollege.findFirst({
      where: {
        OR: [
          { id: targetId, userId },
          { collegeId: targetId, userId }
        ]
      }
    });

    if (!bookmark) {
      return NextResponse.json(
        { success: false, message: 'Saved college entry not found.' },
        { status: 404 }
      );
    }

    await prisma.savedCollege.delete({
      where: {
        id: bookmark.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: { id: bookmark.id, collegeId: bookmark.collegeId },
      message: 'College unsaved successfully!',
    });
  } catch (error: any) {
    console.error('Delete saved college error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
