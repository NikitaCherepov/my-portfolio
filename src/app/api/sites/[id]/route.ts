import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@/utils/auth';
import { saveUploadedFile, saveMultipleFiles, validateImageFile, validateMultipleFiles } from '@/utils/fileUpload';

const prisma = new PrismaClient();

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    // Проверяем аутентификацию
    await requireAuth(request);

    const { id } = await params;

    // Проверяем, существует ли сайт
    const existingSite = await prisma.site.findUnique({
      where: { id },
    });

    if (!existingSite) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

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
    const mainImageFile = formData.get('mainImage') as File | null;
    const galleryFiles = formData.getAll('gallery') as File[];
    const removeGallery = JSON.parse(formData.get('removeGallery') as string || '[]');

    // Логирование перед валидацией
    console.log('mainImage', mainImageFile?.name, mainImageFile?.size);
    console.log('gallery count', galleryFiles.length);

    // Валидация обязательных полей
    if (!name || !directLink || !description || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Подготавливаем данные для обновления
    const updateData: any = {
      name,
      directLink,
      github,
      description,
      stack,
      features,
      date: new Date(date),
    };

    // Обрабатываем главное изображение, если оно было загружено
    if (mainImageFile && mainImageFile.size > 0) {
      validateImageFile(mainImageFile);
      const mainImageData = await saveUploadedFile(mainImageFile, 'main');
      updateData.mainImage = mainImageData.url;
    }

    // Обрабатываем галерею
    let currentGallery = existingSite.gallery || [];

    // Удаляем отмеченные изображения
    if (removeGallery.length > 0) {
      currentGallery = currentGallery.filter((url: string) => !removeGallery.includes(url));
    }

    // Добавляем новые изображения в галерею
    if (galleryFiles.length > 0 && galleryFiles[0].size > 0) {
      validateMultipleFiles(galleryFiles);
      const newGalleryUrls = await saveMultipleFiles(galleryFiles, 'gallery');
      currentGallery = [...currentGallery, ...newGalleryUrls];
    }

    updateData.gallery = currentGallery;

    // Обновляем сайт в базе данных
    const updatedSite = await prisma.site.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedSite);
  } catch (error: any) {
    console.error('Error updating site:', error);

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

    // Если сайт не найден
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update site' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Проверяем аутентификацию
    await requireAuth(request);

    const { id } = await params;

    // Проверяем, существует ли сайт
    const existingSite = await prisma.site.findUnique({
      where: { id },
    });

    if (!existingSite) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

    // Удаляем сайт
    await prisma.site.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Site deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting site:', error);

    // Если ошибка связана с аутентификацией
    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    // Если сайт не найден
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete site' },
      { status: 500 }
    );
  }
}