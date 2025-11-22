import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@/utils/auth';
import { saveUploadedFile, saveMultipleFiles, validateImageFile, validateMultipleFiles } from '@/utils/fileUpload';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const sites = await prisma.site.findMany({
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json(sites);
  } catch (error) {
    console.error('Error fetching sites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sites' },
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
    const directLink = formData.get('directLink') as string;
    const github = formData.get('github') as string || '';
    const description = formData.get('description') as string;
    const stack = JSON.parse(formData.get('stack') as string || '[]');
    const features = JSON.parse(formData.get('features') as string || '[]');
    const date = formData.get('date') as string;

    // Получаем файлы
    const mainImageFile = formData.get('mainImage') as File;
    const galleryFiles = formData.getAll('gallery') as File[];

    // Валидация обязательных полей
    if (!name || !directLink || !description || !date || !mainImageFile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Валидация файлов
    validateImageFile(mainImageFile);

    if (galleryFiles.length > 0) {
      validateMultipleFiles(galleryFiles);
    }

    // Сохраняем главное изображение
    const mainImageData = await saveUploadedFile(mainImageFile, 'main');

    // Сохраняем изображения галереи
    let galleryUrls: string[] = [];
    if (galleryFiles.length > 0) {
      galleryUrls = await saveMultipleFiles(galleryFiles, 'gallery');
    }

    // Создаем сайт в базе данных
    const site = await prisma.site.create({
      data: {
        name,
        mainImage: mainImageData.url,
        directLink,
        github,
        description,
        stack,
        features,
        gallery: galleryUrls,
        date: new Date(date),
      },
    });

    return NextResponse.json(site, { status: 201 });
  } catch (error: any) {
    console.error('Error creating site:', error);

    // Если ошибка связана с аутентификацией
    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    // Если ошибка валидации файлов
    if (error.message.includes('Invalid file type') || error.message.includes('File size too large') || error.message.includes('Too many files')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create site' },
      { status: 500 }
    );
  }
}