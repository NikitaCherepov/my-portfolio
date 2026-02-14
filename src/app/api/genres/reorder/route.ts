import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@/utils/auth';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    await requireAuth(request);

    const body = await request.json();
    const { genres } = body;

    if (!Array.isArray(genres)) {
      return NextResponse.json(
        { error: 'Invalid request format. Expected an array of genres.' },
        { status: 400 }
      );
    }

    // Обновляем порядок для каждого жанра
    const updatePromises = genres.map((genre: { id: string; order: number }) =>
      prisma.genre.update({
        where: { id: genre.id },
        data: { order: genre.order }
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ message: 'Genres order updated successfully' });
  } catch (error: any) {
    console.error('Error updating genres order:', error);

    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update genres order' },
      { status: 500 }
    );
  }
}
