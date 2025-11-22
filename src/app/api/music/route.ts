import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@/utils/auth';
import { saveUploadedFile, validateImageFile, saveAudioFile, validateAudioFile } from '@/utils/fileUpload';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

const prisma = new PrismaClient();

export async function GET() {
  try {
    const music = await prisma.music.findMany({
      include: {
        genre: true
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json(music);
  } catch (error) {
    console.error('Error fetching music:', error);
    return NextResponse.json(
      { error: 'Failed to fetch music' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Проверяем аутентификацию
    await requireAuth(request);

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

    // Получаем файл обложки
    const mainImageFile = formData.get('mainImage') as File;
    const previewFile = formData.get('preview') as File | null;

    // Валидация обязательных полей
    if (!name || !genreId || !date || !mainImageFile) {
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

    // Валидация файлов
    validateImageFile(mainImageFile);

    if (previewFile) {
      validateAudioFile(previewFile);
    }

    // Сохраняем обложку
    const mainImageData = await saveUploadedFile(mainImageFile, 'music');

    // Сохраняем превью если есть
    let previewUrl = preview || '';
    if (previewFile) {
      const previewData = await saveAudioFile(previewFile);
      previewUrl = previewData.url;
    }

    // Создаем музыку в базе данных
    const music = await prisma.music.create({
      data: {
        name,
        mainImage: mainImageData.url,
        youtube,
        spotify,
        vkmusic,
        ymusic,
        preview: previewUrl,
        date: new Date(date),
        genreId,
      },
      include: {
        genre: true
      }
    });

    return NextResponse.json(music, { status: 201 });
  } catch (error: any) {
    console.error('Error creating music:', error);

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

    return NextResponse.json(
      { error: 'Failed to create music' },
      { status: 500 }
    );
  }
}