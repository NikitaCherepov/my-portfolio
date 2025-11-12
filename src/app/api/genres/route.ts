import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@/utils/auth';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const genres = await prisma.genre.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(genres);
  } catch (error) {
    console.error('Error fetching genres:', error);
    return NextResponse.json(
      { error: 'Failed to fetch genres' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);

    const body = await request.json();
    const { name, description } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const existingGenre = await prisma.genre.findUnique({
      where: { name: name.trim() }
    });

    if (existingGenre) {
      return NextResponse.json(
        { error: 'Genre with this name already exists' },
        { status: 409 }
      );
    }

    const genre = await prisma.genre.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
      },
    });

    return NextResponse.json(genre, { status: 201 });
  } catch (error: any) {
    console.error('Error creating genre:', error);

    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Genre with this name already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create genre' },
      { status: 500 }
    );
  }
}