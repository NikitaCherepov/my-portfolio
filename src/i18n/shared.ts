/**
 * Чистые константы i18n без библиотечных импортов.
 * Безопасно импортируются и в серверных, и в клиентских компонентах
 * (не тянут react-i18next в react-server сборку).
 */
export const defaultLocale = 'ru';
export const locales = ['ru', 'en'] as const;
export type Locale = (typeof locales)[number];

export const LANGUAGE_COOKIE = 'lang';
export const LANGUAGE_STORAGE_KEY = 'lang';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}
