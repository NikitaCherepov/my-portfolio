'use client';
import { useSites } from '../../hooks/useSites';
import { useTranslation } from 'react-i18next';
import styles from './admin-sites.module.scss';
import SitesTable from './components/SitesTable';

export default function AdminSitesPage() {
  const { data: sites, isLoading, isError, refetch } = useSites();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className={styles.sites}>
        <div className={styles.sites__loading}>
          <img src='/images/loaders/loader.svg' alt={t('common.loadingAlt')} />
          <p>{t('admin.sites.loading')}</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.sites}>
        <div className={styles.sites__error}>
          <p>{t('admin.sites.loadError')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.sites}>
      <div className={styles.sites__header}>
        <h1>{t('admin.sites.title')}</h1>
        <a href="/admin/sites/create" className={styles.sites__addButton}>
          {t('admin.sites.add')}
        </a>
      </div>

      <div className={styles.sites__content}>
        {sites && sites.length > 0 ? (
          <SitesTable sites={sites} onRefresh={refetch} />
        ) : (
          <div className={styles.sites__empty}>
            <p>{t('admin.sites.notFound')}</p>
          </div>
        )}
      </div>
    </div>
  );
}