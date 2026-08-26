'use client';
import { useRouter } from 'next/navigation';
import { useGenres } from '@/app/hooks/useGenres';
import { useTranslation } from 'react-i18next';
import GenresTable from './components/GenresTable';
import styles from './admin-genres.module.scss';

export default function AdminGenresPage() {
  const router = useRouter();
  const { data: genres, isLoading, isError, refetch } = useGenres();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className={styles.genres}>
        <div className={styles.genres__loading}>
          <img src='/images/loaders/loader.svg' alt={t('common.loadingAlt')} />
          <p>{t('admin.genres.loading')}</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.genres}>
        <div className={styles.genres__error}>
          <p>{t('admin.genres.loadError')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.genres}>
      <div className={styles.genres__header}>
        <h1>{t('admin.genres.title')}</h1>
        <button
          onClick={() => router.push('/admin/genres/create')}
          className={styles.genres__addButton}
        >
          {t('admin.genres.add')}
        </button>
      </div>

      <div className={styles.genres__content}>
        {genres && genres.length > 0 ? (
          <GenresTable genres={genres} onRefresh={refetch} />
        ) : (
          <div className={styles.genres__empty}>
            <p>{t('admin.genres.notFound')}</p>
            <button
              onClick={() => router.push('/admin/genres/create')}
              className={styles.genres__addButton}
            >
              {t('admin.genres.createFirst')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}