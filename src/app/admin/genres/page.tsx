'use client';
import { useState, FormEvent } from 'react';
import { useGenres } from '@/app/hooks/useGenres';
import { useCreateGenre } from '@/app/hooks/useGenreMutations';
import GenresTable from './components/GenresTable';
import styles from './admin-genres.module.scss';

export default function AdminGenresPage() {
  const { data: genres, isLoading, isError, refetch } = useGenres();
  const createGenreMutation = useCreateGenre();
  const [newGenreName, setNewGenreName] = useState('');
  const [isAddingGenre, setIsAddingGenre] = useState(false);

  const handleAddGenre = async (e: FormEvent) => {
    e.preventDefault();

    if (!newGenreName.trim()) return;

    setIsAddingGenre(true);
    try {
      await createGenreMutation.mutateAsync({
        name: newGenreName.trim(),
        description: ''
      });
      setNewGenreName('');
      refetch();
    } finally {
      setIsAddingGenre(false);
    }
  };

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
        <div className={styles.genres__header_add}>
          <form className={styles.genres__input} onSubmit={handleAddGenre}>
            <input
              type="text"
              value={newGenreName}
              onChange={(e) => setNewGenreName(e.target.value)}
              placeholder="Название жанра"
              disabled={isAddingGenre || createGenreMutation.isPending}
            />
            <button
              type="submit"
              className={styles.genres__addButton}
              disabled={!newGenreName.trim() || isAddingGenre || createGenreMutation.isPending}
            >
              {isAddingGenre || createGenreMutation.isPending ? 'Добавление...' : 'Добавить'}
            </button>
          </form>
        </div>
      </div>

      <div className={styles.genres__content}>
        {genres && genres.length > 0 ? (
          <GenresTable genres={genres} onRefresh={refetch} />
        ) : (
          <div className={styles.genres__empty}>
            <p>Жанры не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}