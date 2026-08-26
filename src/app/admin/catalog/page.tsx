'use client';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import styles from './admin-catalog.module.scss';

export default function AdminCatalogPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className={styles.catalog}>
      <div className={styles.catalog__header}>
        <div className={styles.catalog__userInfo}>
          <h2>{t('admin.catalog.manageCatalog')}</h2>
          <p>{t('admin.catalog.welcome', { name: user?.name || user?.login || '' })}</p>
        </div>
      </div>

      <div className={styles.catalog__cards}>
        <div className={styles.catalog__card}>
          <h3>{t('admin.catalog.sitesTitle')}</h3>
          <p>{t('admin.catalog.sitesDesc')}</p>
          <button onClick={() => router.push('/admin/sites')} className={styles.catalog__cardButton}>
            {t('admin.catalog.sitesTitle')}
          </button>
        </div>

        <div className={styles.catalog__card}>
          <h3>{t('admin.catalog.musicTitle')}</h3>
          <p>{t('admin.catalog.musicDesc')}</p>
          <button onClick={() => router.push('/admin/music')} className={styles.catalog__cardButton}>
            {t('admin.catalog.musicTitle')}
          </button>
        </div>

        <div className={styles.catalog__card}>
          <h3>{t('admin.catalog.genresTitle')}</h3>
          <p>{t('admin.catalog.genresDesc')}</p>
          <button onClick={() => router.push('/admin/genres')} className={styles.catalog__cardButton}>
            {t('admin.catalog.genresTitle')}
          </button>
        </div>
      </div>

      <div className={styles.catalog__stats}>
        <h3 className={styles.catalog__statsTitle}>{t('admin.catalog.stats')}</h3>
        <div className={styles.catalog__statsGrid}>
          <div className={`${styles.catalog__statItem} ${styles.catalog__statItem_sites}`}>
            <h4>0</h4>
            <p>{t('admin.catalog.sitesCount')}</p>
          </div>
          <div className={`${styles.catalog__statItem} ${styles.catalog__statItem_music}`}>
            <h4>0</h4>
            <p>{t('admin.catalog.tracksCount')}</p>
          </div>
          <div className={`${styles.catalog__statItem} ${styles.catalog__statItem_genres}`}>
            <h4>0</h4>
            <p>{t('admin.catalog.genresCount')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}