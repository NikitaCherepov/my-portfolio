import { access, mkdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';

const prisma = new PrismaClient();
const projectRoot = process.cwd();
const uploadRoot = process.env.PORTFOLIO_UPLOAD_DIR || '/var/www/uploadsportfolio/sites';

function resolvePublicFile(url) {
  if (!url || !url.startsWith('/') || url.includes('..')) return null;

  const pathname = url.split(/[?#]/, 1)[0];

  if (pathname.startsWith('/uploads/sites/')) {
    return path.join(uploadRoot, pathname.slice('/uploads/sites/'.length));
  }

  return path.join(projectRoot, 'public', pathname.slice(1));
}

function toWebpUrl(url) {
  const suffixIndex = url.search(/[?#]/);
  const pathname = suffixIndex === -1 ? url : url.slice(0, suffixIndex);
  const suffix = suffixIndex === -1 ? '' : url.slice(suffixIndex);

  if (!/\.(?:jpe?g|png)$/i.test(pathname)) return null;
  return `${pathname.replace(/\.(?:jpe?g|png)$/i, '.webp')}${suffix}`;
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

async function convertJpegOrPng(url) {
  const nextUrl = toWebpUrl(url);
  if (!nextUrl) return null;

  const sourcePath = resolvePublicFile(url);
  const targetPath = resolvePublicFile(nextUrl);
  if (!sourcePath || !targetPath) return null;

  if (!(await exists(sourcePath))) {
    if (await exists(targetPath)) {
      return { nextUrl, sourcePath: null };
    }

    console.warn(`[startup migration] Image not found: ${url}`);
    return null;
  }

  const metadata = await sharp(sourcePath).metadata();
  if (metadata.format !== 'jpeg' && metadata.format !== 'png') {
    console.warn(`[startup migration] Skipping non-JPEG/PNG image: ${url}`);
    return null;
  }

  await mkdir(path.dirname(targetPath), { recursive: true });
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

  return { nextUrl, sourcePath };
}

async function getConversion(cache, url) {
  if (cache.has(url)) return cache.get(url);

  const result = await convertJpegOrPng(url);
  cache.set(url, result);
  return result;
}

async function removeConvertedSources(cache) {
  const sourcePaths = new Set(
    [...cache.values()]
      .map(result => result?.sourcePath)
      .filter(Boolean)
  );

  for (const sourcePath of sourcePaths) {
    await unlink(sourcePath).catch((error) => {
      console.warn(`[startup migration] Could not remove ${sourcePath}:`, error);
    });
  }
}

async function migrateMusicImages() {
  const tracks = await prisma.music.findMany({
    select: { id: true, mainImage: true },
  });

  let converted = 0;
  const conversions = new Map();

  for (const track of tracks) {
    if (!track.mainImage) continue;

    const result = await getConversion(conversions, track.mainImage);
    if (!result) continue;

    await prisma.music.update({
      where: { id: track.id },
      data: { mainImage: result.nextUrl },
    });

    converted += 1;
  }

  await removeConvertedSources(conversions);

  console.log(`[startup migration] Music images converted: ${converted}`);
}

async function migrateSiteImages() {
  const sites = await prisma.site.findMany({
    select: { id: true, mainImage: true, gallery: true },
  });

  const conversions = new Map();
  let updatedSites = 0;

  for (const site of sites) {
    const mainResult = site.mainImage
      ? await getConversion(conversions, site.mainImage)
      : null;

    const gallery = [];
    let galleryChanged = false;
    for (const url of site.gallery || []) {
      const result = await getConversion(conversions, url);
      gallery.push(result?.nextUrl || url);
      galleryChanged ||= Boolean(result);
    }

    if (!mainResult && !galleryChanged) continue;

    await prisma.site.update({
      where: { id: site.id },
      data: {
        ...(mainResult ? { mainImage: mainResult.nextUrl } : {}),
        ...(galleryChanged ? { gallery } : {}),
      },
    });

    updatedSites += 1;
  }

  await removeConvertedSources(conversions);

  const convertedFiles = [...conversions.values()].filter(Boolean).length;
  console.log(
    `[startup migration] Site images converted: ${convertedFiles}; sites updated: ${updatedSites}`
  );
}

try {
  await ensureParticipationColumns();
  await ensureLocalizationColumns();
  await migrateMusicImages();
  await migrateSiteImages();
} catch (error) {
  console.error('[startup migration] Failed:', error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
