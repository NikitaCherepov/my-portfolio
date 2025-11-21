'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import styles from './admin.module.scss';

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();

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
          Проверка аутентификации...
        </div>
      </div>
    );
  }

  return (
    <div className={`mainContainer ${styles.container}`}>
      <div className={styles.container__redirect}>
        {isAuthenticated ? 'Перенаправление в каталог...' : 'Перенаправление на страницу входа...'}
      </div>
    </div>
  );
}