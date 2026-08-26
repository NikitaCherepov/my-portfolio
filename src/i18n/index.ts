import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ru from './locales/ru/translation.json';
import en from './locales/en/translation.json';

import { defaultLocale, locales } from './shared';

export { defaultLocale, locales, isLocale, LANGUAGE_COOKIE, LANGUAGE_STORAGE_KEY } from './shared';
export type { Locale } from './shared';

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      ru: { translation: ru },
      en: { translation: en },
    },
    lng: defaultLocale,
    fallbackLng: defaultLocale,
    supportedLngs: locales as unknown as string[],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    returnNull: false,
  });
}

export default i18n;
