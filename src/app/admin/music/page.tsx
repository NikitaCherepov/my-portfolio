'use client';
import { useState } from 'react';
import { useMusic } from '@/app/hooks/useMusic';
import { useGenres } from '@/app/hooks/useGenres';
import { useTranslation } from 'react-i18next';
import MusicTable from './components/MusicTable';
import styles from './admin-music.module.scss';

export default function AdminMusicPage() {
  const { data: music, isLoading: loading, isError: error, refetch: refreshMusic } = useMusic();
  const { data: genres } = useGenres();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className={styles.music}>
        <div className={styles.music__loading}>
          <img src='/images/loaders/loader.svg' alt={t('common.loadingAlt')} />
          <p>{t('admin.music.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.music}>
        <div className={styles.music__error}>
          <p>{t('admin.music.loadError')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.music}>
      <div className={styles.music__header}>
        <h1>{t('admin.music.title')}</h1>
        <div className={styles.music__header_add}>
          <a
            href="/admin/music/add"
            className={styles.music__addButton}
          >
            {t('admin.music.add')}
          </a>
        </div>
      </div>

      <div className={styles.music__content}>
        {music && music.length > 0 ? (
          <MusicTable music={music} onRefresh={refreshMusic} />
        ) : (
          <div className={styles.music__empty}>
            <p>{t('admin.music.notFound')}</p>
            {(!genres || genres.length === 0) && (
              <p className={styles.music__empty_hint}>
                {t('admin.music.addGenresFirst')}{' '}
                <a href="/admin/genres" className={styles.music__empty_link}>
                  {t('admin.genres.title')}
                </a>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}