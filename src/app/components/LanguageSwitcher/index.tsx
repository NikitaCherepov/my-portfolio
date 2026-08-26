'use client';

import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import i18n, { LANGUAGE_COOKIE, LANGUAGE_STORAGE_KEY, locales, type Locale } from '@/i18n';
import styles from './LanguageSwitcher.module.scss';

export default function LanguageSwitcher() {
  const { i18n: inst } = useTranslation();

  const changeLanguage = (lng: Locale) => {
    if (inst.language === lng) return;
    i18n.changeLanguage(lng);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
    Cookies.set(LANGUAGE_COOKIE, lng, { expires: 365, sameSite: 'lax' });
    document.documentElement.lang = lng;
  };

  return (
    <div className={styles.switcher} role="group" aria-label="Language">
      {locales.map((lng) => (
        <button
          key={lng}
          type="button"
          onClick={() => changeLanguage(lng)}
          className={`${styles.switcher__option} ${inst.language === lng ? styles.switcher__option_active : ''}`}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
