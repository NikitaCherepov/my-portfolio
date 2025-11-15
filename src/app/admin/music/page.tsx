'use client';
import { useState } from 'react';
import { useMusic } from '@/app/hooks/useMusic';
import { useGenres } from '@/app/hooks/useGenres';
import MusicTable from './components/MusicTable';
import styles from './admin-music.module.scss';

export default function AdminMusicPage() {
  const { music, loading, error, refreshMusic } = useMusic();
  const { data: genres } = useGenres();

  if (loading) {
    return (
      <div className={styles.music}>
        <div className={styles.music__loading}>
          <img src='/images/loaders/loader.svg' alt="Загрузка" />
          <p>Загрузка музыки...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.music}>
        <div className={styles.music__error}>
          <p>Ошибка при загрузке музыки: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.music}>
      <div className={styles.music__header}>
        <h1>Управление музыкой</h1>
        <div className={styles.music__header_add}>
          <a
            href="/admin/music/add"
            className={styles.music__addButton}
          >
            ➕ Добавить трек
          </a>
        </div>
      </div>

      <div className={styles.music__content}>
        {music && music.length > 0 ? (
          <MusicTable music={music} onRefresh={refreshMusic} />
        ) : (
          <div className={styles.music__empty}>
            <p>Музыкальные треки не найдены</p>
            {(!genres || genres.length === 0) && (
              <p className={styles.music__empty_hint}>
                Сначала добавьте жанры в разделе{' '}
                <a href="/admin/genres" className={styles.music__empty_link}>
                  Управление жанрами
                </a>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}