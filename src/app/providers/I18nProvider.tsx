'use client';

import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import Cookies from 'js-cookie';
import i18n, { LANGUAGE_COOKIE, LANGUAGE_STORAGE_KEY, isLocale } from '@/i18n';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  // Восстанавливаем сохранённый язык после гидратации,
  // чтобы не было расхождения SSR (ru) и клиента
  useEffect(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isLocale(saved) && saved !== i18n.language) {
      i18n.changeLanguage(saved);
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
