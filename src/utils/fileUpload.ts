import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = 'public/uploads/sites';

export interface UploadedFile {
  filename: string;
  filepath: string;
  url: string;
}

/**
 * Сохраняет загруженный файл и возвращает информацию о нем
 */
export async function saveUploadedFile(file: File | Blob, subfolder: string = ''): Promise<UploadedFile> {
  try {
    // Создаем директорию для загрузки, если она не существует
    const fullPath = join(process.cwd(), UPLOAD_DIR, subfolder);
    await mkdir(fullPath, { recursive: true });

    // Генерируем уникальное имя файла
    const timestamp = Date.now();
    const uniqueId = uuidv4().slice(0, 8);
    const originalName = (file as File).name || 'file';
    const extension = originalName.split('.').pop() || 'jpg';
    const filename = `${timestamp}_${uniqueId}.${extension}`;

    // Получаем файл как буфер
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Сохраняем файл
    const filepath = join(fullPath, filename);
    await writeFile(filepath, buffer);

    // Возвращаем URL для доступа к файлу
    const url = `/uploads/sites/${subfolder ? subfolder + '/' : ''}${filename}`;

    return {
      filename,
      filepath,
      url
    };
  } catch (error) {
    console.error('Error saving file:', error);
    throw new Error('Failed to save file');
  }
}

/**
 * Сохраняет несколько файлов и возвращает массив URL
 */
export async function saveMultipleFiles(files: File[] | Blob[], subfolder: string = ''): Promise<string[]> {
  try {
    const uploadedFiles = await Promise.all(
      files.map(file => saveUploadedFile(file, subfolder))
    );

    return uploadedFiles.map(file => file.url);
  } catch (error) {
    console.error('Error saving multiple files:', error);
    throw new Error('Failed to save files');
  }
}

/**
 * Валидация типа файла
 */
export function validateImageFile(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
  }

  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum size is 5MB.');
  }

  return true;
}

/**
 * Валидация нескольких файлов
 */
export function validateMultipleFiles(files: File[]): boolean {
  const maxFiles = 10; // Максимум 10 файлов в галерее

  if (files.length > maxFiles) {
    throw new Error(`Too many files. Maximum ${maxFiles} files allowed.`);
  }

  files.forEach(file => validateImageFile(file));

  return true;
}