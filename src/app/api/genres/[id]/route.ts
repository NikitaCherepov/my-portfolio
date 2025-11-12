import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@/utils/auth';

const prisma = new PrismaClient();

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await requireAuth(request);

    const { id } = await params;
    const body = await request.json();
    const { name, description } = body;

    // Валидация обязательных полей
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const existingGenre = await prisma.genre.findUnique({
      where: { id },
    });

    if (!existingGenre) {
      return NextResponse.json(
        { error: 'Genre not found' },
        { status: 404 }
      );
    }

    if (name.trim() !== existingGenre.name) {
      const duplicateGenre = await prisma.genre.findUnique({
        where: { name: name.trim() }
      });

      if (duplicateGenre) {
        return NextResponse.json(
          { error: 'Genre with this name already exists' },
          { status: 409 }
        );
      }
    }

    const updatedGenre = await prisma.genre.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
      },
    });

    return NextResponse.json(updatedGenre);
  } catch (error: any) {
    console.error('Error updating genre:', error);

    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Genre not found' },
        { status: 404 }
      );
    }

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Genre with this name already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update genre' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await requireAuth(request);

    const { id } = await params;

    const existingGenre = await prisma.genre.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            music: true
          }
        }
      }
    });

    if (!existingGenre) {
      return NextResponse.json(
        { error: 'Genre not found' },
        { status: 404 }
      );
    }

    if (existingGenre._count.music > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete genre. It has associated music tracks.',
          count: existingGenre._count.music
        },
        { status: 409 }
      );
    }

    await prisma.genre.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Genre deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting genre:', error);

    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Genre not found' },
        { status: 404 }
      );
    }

    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Cannot delete genre. It has associated music tracks.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete genre' },
      { status: 500 }
    );
  }
}