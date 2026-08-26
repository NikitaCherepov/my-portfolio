'use client';

import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import Cookies from 'js-cookie';
import i18n, { LANGUAGE_COOKIE, LANGUAGE_STORAGE_KEY, defaultLocale, isLocale } from '@/i18n';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  // Определяем язык после гидратации (не в рендере — иначе рассинхрон с SSR):
  // 1. localStorage / cookie — явный выбор пользователя
  // 2. Язык браузера — автоопределение при первом визите
  // 3. Дефолт — русский
  useEffect(() => {
    const savedStorage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const savedCookie = Cookies.get(LANGUAGE_COOKIE);

    const saved = isLocale(savedStorage)
      ? savedStorage
      : isLocale(savedCookie)
        ? savedCookie
        : null;

    let lng: string;
    if (saved) {
      lng = saved;
    } else {
      // Первый визит — автоопределение по языку браузера
      const browserLangs = navigator.languages?.length
        ? navigator.languages
        : [navigator.language];
      lng = browserLangs.some((l) => (l || '').toLowerCase().startsWith('en'))
        ? 'en'
        : defaultLocale;
    }

    // Держим оба хранилища заполненными (cookie нужен серверу для метадаты)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
    if (lng !== i18n.language) {
      i18n.changeLanguage(lng);
    }
  }, []);

  // Синхронизируем <html lang> и cookie с текущим языком
  useEffect(() => {
    const syncLang = (lng: string) => {
      document.documentElement.lang = lng;
      Cookies.set(LANGUAGE_COOKIE, lng, { expires: 365, sameSite: 'lax' });
    };

    syncLang(i18n.language);
    i18n.on('languageChanged', syncLang);
    return () => i18n.off('languageChanged', syncLang);
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
