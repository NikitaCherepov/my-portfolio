'use client';
import { useSites } from '../../hooks/useSites';
import styles from './admin-sites.module.scss';
import SitesTable from './components/SitesTable';

export default function AdminSitesPage() {
  const { data: sites, isLoading, isError, refetch } = useSites();

  if (isLoading) {
    return (
      <div className={styles.sites}>
        <div className={styles.sites__loading}>
          <img src='/images/loaders/loader.svg' alt="Загрузка" />
          <p>Загрузка сайтов...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.sites}>
        <div className={styles.sites__error}>
          <p>Ошибка при загрузке сайтов</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.sites}>
      <div className={styles.sites__header}>
        <h1>Управление сайтами</h1>
        <button className={styles.sites__addButton}>
          Добавить сайт
        </button>
      </div>

      <div className={styles.sites__content}>
        {sites && sites.length > 0 ? (
          <SitesTable sites={sites} onRefresh={refetch} />
        ) : (
          <div className={styles.sites__empty}>
            <p>Сайты не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}