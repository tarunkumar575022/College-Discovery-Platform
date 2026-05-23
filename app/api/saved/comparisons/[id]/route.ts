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
    const comparisonId = params.id;

    // Verify user exists in database (handles stale session cookies after database re-seeding)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Your session is invalid or has expired. Please log out and log back in.' },
        { status: 401 }
      );
    }

    if (!comparisonId) {
      return NextResponse.json(
        { success: false, message: 'Comparison ID is required.' },
        { status: 400 }
      );
    }

    const comparison = await prisma.savedComparison.findFirst({
      where: {
        id: comparisonId,
        userId,
      },
    });

    if (!comparison) {
      return NextResponse.json(
        { success: false, message: 'Saved comparison set not found.' },
        { status: 404 }
      );
    }

    await prisma.savedComparison.delete({
      where: {
        id: comparisonId,
      },
    });

    return NextResponse.json({
      success: true,
      data: { id: comparisonId },
      message: 'Saved comparison set deleted successfully!',
    });
  } catch (error: any) {
    console.error('Delete saved comparison error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
