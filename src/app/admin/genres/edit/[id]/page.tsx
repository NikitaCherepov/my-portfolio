'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGenres } from '@/app/hooks/useGenres';
import { useTranslation } from 'react-i18next';
import GenreForm from '../../components/GenreForm';
import styles from '../../admin-genres.module.scss';

export default function EditGenrePage() {
    const params = useParams();
    const router = useRouter();
    const genreId = params.id as string;
    const { data: genres, isLoading, isError } = useGenres();
    const { t } = useTranslation();

    // Находим текущий жанр
    const currentGenre = genres?.find(genre => genre.id === genreId);

    if (isLoading) {
        return (
            <div className={styles.genres}>
                <div className={styles.genres__loading}>
                    <img src='/images/loaders/loader.svg' alt={t('common.loadingAlt')} />
                    <p>{t('admin.genres.editLoading')}</p>
                </div>
            </div>
        );
    }

    if (isError || !currentGenre) {
        return (
            <div className={styles.genres}>
                <div className={styles.genres__error}>
                    <p>{t('admin.genres.genreNotFound')}</p>
                    <button
                        onClick={() => router.push('/admin/genres')}
                        className={styles.genres__backButton}
                    >
                        {t('admin.genres.backToList')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.genres}>
            <div className={styles.genres__header}>
                <h1>{t('admin.genres.editTitle')}</h1>
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