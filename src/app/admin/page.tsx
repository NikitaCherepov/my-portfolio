'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import styles from './admin.module.scss';

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      router.push('/admin/catalog');
    } else {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className={`mainContainer ${styles.container}`}>
        <div className={styles.container__redirect}>
          {t('admin.checkingAuth')}
        </div>
      </div>
    );
  }

  return (
    <div className={`mainContainer ${styles.container}`}>
      <div className={styles.container__redirect}>
        {isAuthenticated ? t('admin.redirectCatalog') : t('admin.redirectLogin')}
      </div>
    </div>
  );
}