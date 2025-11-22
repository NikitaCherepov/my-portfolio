import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@/utils/auth';
import { saveUploadedFile, validateImageFile, saveAudioFile, validateAudioFile } from '@/utils/fileUpload';

const prisma = new PrismaClient();

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    // Проверяем аутентификацию
    await requireAuth(request);

    const { id } = await params;

    // Проверяем, существует ли музыка
    const existingMusic = await prisma.music.findUnique({
      where: { id },
      include: {
        genre: true
      }
    });

    if (!existingMusic) {
      return NextResponse.json(
        { error: 'Music not found' },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    // Получаем данные из формы
    const name = formData.get('name') as string;
    const genreId = formData.get('genreId') as string;
    const youtube = formData.get('youtube') as string || '';
    const spotify = formData.get('spotify') as string || '';
    const vkmusic = formData.get('vkmusic') as string || '';
    const ymusic = formData.get('ymusic') as string || '';
    const preview = formData.get('preview') as string || '';
    const date = formData.get('date') as string;

    // Получаем файлы
    const mainImageFile = formData.get('mainImage') as File | null;
    const previewFile = formData.get('preview') as File | null;

    // Валидация обязательных полей
    if (!name || !genreId || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Проверяем, существует ли жанр
    const genre = await prisma.genre.findUnique({
      where: { id: genreId }
    });

    if (!genre) {
      return NextResponse.json(
        { error: 'Genre not found' },
        { status: 404 }
      );
    }

    // Подготавливаем данные для обновления
    const updateData: any = {
      name,
      youtube,
      spotify,
      vkmusic,
      ymusic,
      preview,
      date: new Date(date),
      genreId,
    };

    // Обрабатываем обложку, если она была загружена
    if (mainImageFile && mainImageFile.size > 0) {
      validateImageFile(mainImageFile);
      const mainImageData = await saveUploadedFile(mainImageFile, 'music');
      updateData.mainImage = mainImageData.url;
    }

    // Обрабатываем превью, если оно было загружено
    if (previewFile && previewFile.size > 0) {
      validateAudioFile(previewFile);
      const previewData = await saveAudioFile(previewFile);
      updateData.preview = previewData.url;
    }

    // Обновляем музыку в базе данных
    const updatedMusic = await prisma.music.update({
      where: { id },
      data: updateData,
      include: {
        genre: true
      }
    });

    return NextResponse.json(updatedMusic);
  } catch (error: any) {
    console.error('Error updating music:', error);

    // Если ошибка связана с аутентификацией
    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    // Если ошибка валидации файла
    if (error.message.includes('Invalid file type') || error.message.includes('File size too large')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Если музыка не найдена
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Music not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update music' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Проверяем аутентификацию
    await requireAuth(request);

    const { id } = await params;

    // Проверяем, существует ли музыка
    const existingMusic = await prisma.music.findUnique({
      where: { id },
    });

    if (!existingMusic) {
      return NextResponse.json(
        { error: 'Music not found' },
        { status: 404 }
      );
    }

    // Удаляем музыку
    await prisma.music.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Music deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting music:', error);

    // Если ошибка связана с аутентификацией
    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    // Если музыка не найдена
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Music not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete music' },
      { status: 500 }
    );
  }
}