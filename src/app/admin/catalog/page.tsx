'use client';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import styles from './admin-catalog.module.scss';

export default function AdminCatalogPage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className={styles.catalog}>
      <div className={styles.catalog__header}>
        <div className={styles.catalog__userInfo}>
          <h2>Управление каталогом</h2>
          <p>Добро пожаловать, {user?.name || user?.login}!</p>
        </div>
      </div>

      <div className={styles.catalog__cards}>
        <div className={styles.catalog__card}>
          <h3>Управление сайтами</h3>
          <p>Добавление, редактирование и удаление сайтов</p>
          <button onClick={() => router.push('/admin/sites')} className={styles.catalog__cardButton}>
            Управление сайтами
          </button>
        </div>

        <div className={styles.catalog__card}>
          <h3>Управление музыкой</h3>
          <p>Добавление, редактирование и удаление музыкальных треков</p>
          <button className={styles.catalog__cardButton}>
            Управление музыкой
          </button>
        </div>

        <div className={styles.catalog__card}>
          <h3>Управление жанрами</h3>
          <p>Добавление и редактирование музыкальных жанров</p>
          <button onClick={() => router.push('/admin/genres')} className={styles.catalog__cardButton}>
            Управление жанрами
          </button>
        </div>
      </div>

      <div className={styles.catalog__stats}>
        <h3 className={styles.catalog__statsTitle}>Статистика</h3>
        <div className={styles.catalog__statsGrid}>
          <div className={`${styles.catalog__statItem} ${styles.catalog__statItem_sites}`}>
            <h4>0</h4>
            <p>Сайтов</p>
          </div>
          <div className={`${styles.catalog__statItem} ${styles.catalog__statItem_music}`}>
            <h4>0</h4>
            <p>Музыкальных треков</p>
          </div>
          <div className={`${styles.catalog__statItem} ${styles.catalog__statItem_genres}`}>
            <h4>0</h4>
            <p>Жанров</p>
          </div>
        </div>
      </div>
    </div>
  );
}