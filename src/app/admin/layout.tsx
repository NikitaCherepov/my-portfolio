'use client';
import { useAuth } from '../hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import styles from './admin.module.scss';
import AdminHeader from './components/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.includes('login') && !isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className={`mainContainer ${styles.admin}`}>
        <div className={styles.admin__loading}>
          Проверка доступа...
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !pathname.includes('login')) {
    return null;
  }

  return (
    <div className={`mainContainer ${styles.admin}`}>
      {/* Показываем header только если это не страница входа */}
      {!pathname.includes('login') && <AdminHeader pathname={pathname} />}

      <main className={styles.admin__main}>
        {children}
      </main>
    </div>
  );
}