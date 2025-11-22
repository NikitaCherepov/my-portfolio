import { writeFile, mkdir } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = '/var/www/uploadsportfolio/sites';
const AUDIO_UPLOAD_DIR = '/var/www/uploadsportfolio/audio';

function buildPath(base: string, subfolder: string) {
  return subfolder ? `${base}/${subfolder}` : base;
}

export interface UploadedFile {
  filename: string;
  filepath: string;
  url: string;
}

/**
 * Сохраняет загруженный файл и возвращает информацию о нем
 */
export async function saveUploadedFile(file: File | Blob, subfolder = ''): Promise<UploadedFile> {
  console.log('saveUploadedFile start', { subfolder, uploadDir: UPLOAD_DIR });
  try {
    const fullPath = buildPath(UPLOAD_DIR, subfolder);
    await mkdir(fullPath, { recursive: true });

    const timestamp = Date.now();
    const uniqueId = uuidv4().slice(0, 8);
    const originalName = (file as File).name || 'file';
    const extension = originalName.split('.').pop() || 'jpg';
    const filename = `${timestamp}_${uniqueId}.${extension}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filepath = `${fullPath}/${filename}`;
    console.log('target path', filepath);
    await writeFile(filepath, buffer);

    const url = `/uploads/sites/${subfolder ? `${subfolder}/` : ''}${filename}`;
    return { filename, filepath, url };
  } catch (error) {
    console.error('saveUploadedFile error', error);
    throw new Error('Failed to save file');
  }
}

/**
 * Сохраняет несколько файлов и возвращает массив URL
 */
export async function saveMultipleFiles(files: File[] | Blob[], subfolder = ''): Promise<string[]> {
  try {
    const fullPath = buildPath(UPLOAD_DIR, subfolder);
    await mkdir(fullPath, { recursive: true });
    const uploaded = await Promise.all(files.map(file => saveUploadedFile(file, subfolder)));
    return uploaded.map(f => f.url);
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

/**
 * Сохраняет аудиофайл и возвращает информацию о нем
 */
export async function saveAudioFile(file: File | Blob): Promise<UploadedFile> {
  try {
    const fullPath = AUDIO_UPLOAD_DIR;
    await mkdir(fullPath, { recursive: true });

    const timestamp = Date.now();
    const uniqueId = uuidv4().slice(0, 8);
    const originalName = (file as File).name || 'audio';
    const extension = originalName.split('.').pop() || 'mp3';
    const filename = `${timestamp}_${uniqueId}.${extension}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filepath = `${fullPath}/${filename}`;
    await writeFile(filepath, buffer);

    const url = `/uploads/audio/${filename}`;

    return {
      filename,
      filepath,
      url
    };
  } catch (error) {
    console.error('Error saving audio file:', error);
    throw new Error('Failed to save audio file');
  }
}

/**
 * Валидация аудиофайла
 */
export function validateAudioFile(file: File): boolean {
  const allowedTypes = [
    'audio/mpeg',     // MP3
    'audio/wav',      // WAV
    'audio/ogg',      // OGG
    'audio/m4a',      // M4A/AAC
    'audio/mp3',      // MP3 (alternative)
    'audio/x-wav'     // WAV (alternative)
  ];
  const maxSize = 50 * 1024 * 1024; // 50MB для аудио

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only MP3, WAV, OGG, and M4A audio files are allowed.');
  }

  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum size is 50MB.');
  }

  return true;
}