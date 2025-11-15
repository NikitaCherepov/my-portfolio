'use client';
import { useRouter } from 'next/navigation';
import { useGenres } from '@/app/hooks/useGenres';
import GenresTable from './components/GenresTable';
import styles from './admin-genres.module.scss';

export default function AdminGenresPage() {
  const router = useRouter();
  const { data: genres, isLoading, isError, refetch } = useGenres();

  if (isLoading) {
    return (
      <div className={styles.genres}>
        <div className={styles.genres__loading}>
          <img src='/images/loaders/loader.svg' alt="Загрузка" />
          <p>Загрузка жанров...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.genres}>
        <div className={styles.genres__error}>
          <p>Ошибка при загрузке жанров</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.genres}>
      <div className={styles.genres__header}>
        <h1>Управление жанрами</h1>
        <button
          onClick={() => router.push('/admin/genres/create')}
          className={styles.genres__addButton}
        >
          ➕ Добавить жанр
        </button>
      </div>

      <div className={styles.genres__content}>
        {genres && genres.length > 0 ? (
          <GenresTable genres={genres} onRefresh={refetch} />
        ) : (
          <div className={styles.genres__empty}>
            <p>Жанры не найдены</p>
            <button
              onClick={() => router.push('/admin/genres/create')}
              className={styles.genres__addButton}
            >
              ➕ Создать первый жанр
            </button>
          </div>
        )}
      </div>
    </div>
  );
}