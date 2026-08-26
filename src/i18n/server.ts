import { cookies } from 'next/headers';
import { defaultLocale, isLocale } from './shared';

/**
 * Определяет язык пользователя на сервере (для generateMetadata).
 * Читает cookie `lang`, который выставляет клиентский переключатель.
 * По умолчанию — русский.
 */
export async function getServerLocale(): Promise<string> {
  try {
    const cookieStore = await cookies();
    const value = cookieStore.get('lang')?.value;
    return isLocale(value) ? value : defaultLocale;
  } catch {
    return defaultLocale;
  }
}
