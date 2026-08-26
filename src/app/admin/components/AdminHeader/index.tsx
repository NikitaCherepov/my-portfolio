'use client';
import { useAuth } from '../../../hooks/useAuth';
import { useLogoutMutation } from '@/app/hooks/useLogoutMutation';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import styles from './AdminHeader.module.scss';

interface AdminHeaderProps {
  pathname: string;
}

export default function AdminHeader({ pathname }: AdminHeaderProps) {
  const { user } = useAuth();
  const logoutMutation = useLogoutMutation();
  const router = useRouter();
  const { t } = useTranslation();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(t('admin.header.logoutSuccess'));
        router.push('/admin');
      },
      onError: (error: any) => {
        toast.error(t('admin.header.logoutError'));
        console.error('Logout error:', error);
      }
    });
  };

  const isActiveLink = (href: string) => {
    return pathname === href;
  };

  return (
    <header className={styles.header}>
      <div className={styles.header__navGroup}>
        <h1 className={styles.header__title}>{t('admin.header.title')}</h1>
        <nav className={styles.header__nav}>
          <button
            onClick={() => router.push('/admin/catalog')}
            className={`${styles.header__navLink} ${isActiveLink('/admin/catalog') ? styles.header__navLink_active : ''}`}
          >
            {t('admin.header.catalog')}
          </button>
          <button
            onClick={() => router.push('/admin/sites')}
            className={`${styles.header__navLink} ${isActiveLink('/admin/sites') ? styles.header__navLink_active : ''}`}
          >
            {t('admin.header.sites')}
          </button>
          <button
            onClick={() => router.push('/admin/genres')}
            className={`${styles.header__navLink} ${isActiveLink('/admin/genres') ? styles.header__navLink_active : ''}`}
          >
            {t('admin.header.genres')}
          </button>
          <button
            onClick={() => router.push('/admin/music')}
            className={`${styles.header__navLink} ${isActiveLink('/admin/music') ? styles.header__navLink_active : ''}`}
          >
            {t('admin.header.music')}
          </button>
        </nav>
      </div>

      <div className={styles.header__navGroup}>
        {user && (
          <div className={styles.header__userInfo}>
            <span className={styles.header__userInfoText}>
              {user?.name || user?.login}
            </span>
          </div>
        )}
        <nav className={styles.header__nav}>
          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className={styles.header__logoutButton}
          >
            {logoutMutation.isPending ? t('admin.header.loggingOut') : t('admin.header.logout')}
          </button>
        </nav>
      </div>
    </header>
  );
}