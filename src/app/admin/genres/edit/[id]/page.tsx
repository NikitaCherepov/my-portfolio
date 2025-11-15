'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGenres } from '@/app/hooks/useGenres';
import GenreForm from '../../components/GenreForm';
import styles from '../../admin-genres.module.scss';

export default function EditGenrePage() {
    const params = useParams();
    const router = useRouter();
    const genreId = params.id as string;
    const { data: genres, isLoading, isError } = useGenres();

    // Находим текущий жанр
    const currentGenre = genres?.find(genre => genre.id === genreId);

    if (isLoading) {
        return (
            <div className={styles.genres}>
                <div className={styles.genres__loading}>
                    <img src='/images/loaders/loader.svg' alt="Загрузка" />
                    <p>Загрузка жанра...</p>
                </div>
            </div>
        );
    }

    if (isError || !currentGenre) {
        return (
            <div className={styles.genres}>
                <div className={styles.genres__error}>
                    <p>Жанр не найден</p>
                    <button
                        onClick={() => router.push('/admin/genres')}
                        className={styles.genres__backButton}
                    >
                        Вернуться к списку жанров
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.genres}>
            <div className={styles.genres__header}>
                <h1>Редактирование жанра</h1>
            </div>

            <div className={styles.genres__content}>
                <GenreForm
                    mode="edit"
                    initialData={currentGenre}
                    genreId={genreId}
                />
            </div>
        </div>
    );
}