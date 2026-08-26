import { access, unlink } from 'node:fs/promises';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';

const prisma = new PrismaClient();
const projectRoot = process.cwd();
const uploadRoot = process.env.PORTFOLIO_UPLOAD_DIR || '/var/www/uploadsportfolio/sites';

function resolvePublicFile(url) {
  if (!url || !url.startsWith('/') || url.includes('..')) return null;

  if (url.startsWith('/uploads/sites/')) {
    return path.join(uploadRoot, url.slice('/uploads/sites/'.length));
  }

  return path.join(projectRoot, 'public', url.slice(1));
}

function toWebpUrl(url) {
  return url.replace(/\.[^./?]+$/, '.webp');
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureParticipationColumns() {
  await prisma.$executeRawUnsafe(
    'ALTER TABLE "sites" ADD COLUMN IF NOT EXISTS "companyName" TEXT'
  );
  await prisma.$executeRawUnsafe(
    'ALTER TABLE "sites" ADD COLUMN IF NOT EXISTS "companyUrl" TEXT'
  );
}

// Колонки английских переводов (i18n). Русский остаётся в базовых колонках.
async function ensureLocalizationColumns() {
  const statements = [
    'ALTER TABLE "sites" ADD COLUMN IF NOT EXISTS "nameEn" TEXT',
    'ALTER TABLE "sites" ADD COLUMN IF NOT EXISTS "descriptionEn" TEXT',
    'ALTER TABLE "sites" ADD COLUMN IF NOT EXISTS "companyNameEn" TEXT',
    "ALTER TABLE \"sites\" ADD COLUMN IF NOT EXISTS \"featuresEn\" TEXT[] DEFAULT '{}'",
    'ALTER TABLE "genres" ADD COLUMN IF NOT EXISTS "nameEn" TEXT',
    'ALTER TABLE "genres" ADD COLUMN IF NOT EXISTS "descriptionEn" TEXT',
    'ALTER TABLE "music" ADD COLUMN IF NOT EXISTS "nameEn" TEXT',
  ];

  for (const sql of statements) {
    await prisma.$executeRawUnsafe(sql);
  }
}

async function migrateMusicImages() {
  const tracks = await prisma.music.findMany({
    select: { id: true, mainImage: true },
  });

  let converted = 0;

  for (const track of tracks) {
    if (!track.mainImage || /\.webp(?:\?|$)/i.test(track.mainImage)) continue;

    const sourcePath = resolvePublicFile(track.mainImage);
    if (!sourcePath || !(await exists(sourcePath))) {
      console.warn(`[startup migration] Image not found: ${track.mainImage}`);
      continue;
    }

    const nextUrl = toWebpUrl(track.mainImage);
    const targetPath = resolvePublicFile(nextUrl);
    if (!targetPath) continue;

    await sharp(sourcePath)
      .rotate()
      .resize({
        width: 1200,
        height: 1200,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 78, effort: 4 })
      .toFile(targetPath);

    await prisma.music.update({
      where: { id: track.id },
      data: { mainImage: nextUrl },
    });

    if (sourcePath !== targetPath) {
      await unlink(sourcePath).catch((error) => {
        console.warn(`[startup migration] Could not remove ${sourcePath}:`, error);
      });
    }

    converted += 1;
  }

  console.log(`[startup migration] Music images converted: ${converted}`);
}

try {
  await ensureParticipationColumns();
  await ensureLocalizationColumns();
  await migrateMusicImages();
} catch (error) {
  console.error('[startup migration] Failed:', error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
