'use client';
import { useAuth } from '../../../hooks/useAuth';
import { useLogoutMutation } from '@/app/hooks/useLogoutMutation';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import styles from './AdminHeader.module.scss';

interface AdminHeaderProps {
  pathname: string;
}

export default function AdminHeader({ pathname }: AdminHeaderProps) {
  const { user } = useAuth();
  const logoutMutation = useLogoutMutation();
  const router = useRouter();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('Выход выполнен успешно');
        router.push('/admin');
      },
      onError: (error: any) => {
        toast.error('Ошибка при выходе');
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
        <h1 className={styles.header__title}>Админ-панель</h1>
        <nav className={styles.header__nav}>
          <button
            onClick={() => router.push('/admin/catalog')}
            className={`${styles.header__navLink} ${isActiveLink('/admin/catalog') ? styles.header__navLink_active : ''}`}
          >
            Каталог
          </button>
          <button
            onClick={() => router.push('/admin/sites')}
            className={`${styles.header__navLink} ${isActiveLink('/admin/sites') ? styles.header__navLink_active : ''}`}
          >
            Сайты
          </button>
          <button
            onClick={() => router.push('/admin/genres')}
            className={`${styles.header__navLink} ${isActiveLink('/admin/genres') ? styles.header__navLink_active : ''}`}
          >
            Жанры
          </button>
          <button
            onClick={() => router.push('/admin/music')}
            className={`${styles.header__navLink} ${isActiveLink('/admin/music') ? styles.header__navLink_active : ''}`}
          >
            Музыка
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
            {logoutMutation.isPending ? 'Выход...' : 'Выйти'}
          </button>
        </nav>
      </div>
    </header>
  );
}