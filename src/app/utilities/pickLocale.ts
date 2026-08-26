/**
 * Выбирает локализованное значение поля из БД с фолбэком на русское.
 * Русские значения остаются в базовых колонках (name, description, ...),
 * английские — в колонках *_en (nameEn, descriptionEn, ...).
 */
export function pickLocale(
  ru: string | null | undefined,
  en: string | null | undefined,
  lang: string
): string | null {
  const base = ru != null && ru.trim() !== '' ? ru : null;
  if (lang === 'en') {
    const translated = en != null && en.trim() !== '' ? en : null;
    return translated ?? base;
  }
  return base;
}

/**
 * Тот же pickLocale для массивов (features и т.п.).
 */
export function pickLocaleArray(
  ru: string[] | null | undefined,
  en: string[] | null | undefined,
  lang: string
): string[] {
  const base = Array.isArray(ru) ? ru.filter((v) => v != null && v !== '') : [];
  if (lang === 'en' && Array.isArray(en) && en.some((v) => v != null && v !== '')) {
    return en.filter((v) => v != null && v !== '');
  }
  return base;
}
