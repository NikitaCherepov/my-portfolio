import { cookies, headers } from 'next/headers';
import { defaultLocale, isLocale, locales, type Locale } from './shared';

function isEnglishAcceptLanguage(acceptLanguage: string | null): boolean {
  if (!acceptLanguage) return false;
  // "en-US,en;q=0.9,ru;q=0.8" — берём языки по убыванию приоритета,
  // английский должен встретиться раньше любого другого поддерживаемого
  const langs = acceptLanguage
    .split(',')
    .map((part) => part.trim().toLowerCase().split(';')[0]);
  for (const lang of langs) {
    if (lang.startsWith('en')) return true;
    const matchesSupported = locales.some(
      (supported) => lang === supported || lang.startsWith(`${supported}-`)
    );
    if (matchesSupported) return false;
  }
  return false;
}

/**
 * Определяет язык пользователя на сервере (для generateMetadata).
 * 1. Cookie `lang` (явный выбор пользователя через переключатель)
 * 2. Заголовок Accept-Language (первый визит, автоопределение)
 * 3. По умолчанию — русский.
 */
export async function getServerLocale(): Promise<Locale> {
  try {
    const cookieStore = await cookies();
    const value = cookieStore.get('lang')?.value;
    if (isLocale(value)) return value;
  } catch {
    // cookies() недоступен — переходим к следующему способу
  }

  try {
    const headersList = await headers();
    if (isEnglishAcceptLanguage(headersList.get('accept-language'))) {
      return 'en';
    }
  } catch {
    // headers() недоступен — используем дефолт
  }

  return defaultLocale;
}
