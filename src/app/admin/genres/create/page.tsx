'use client';
import GenreForm from '../components/GenreForm';
import styles from '../admin-genres.module.scss';

export default function CreateGenrePage() {
    return (
        <div className={styles.genres}>
            <div className={styles.genres__header}>
                <h1>Добавление жанра</h1>
            </div>

            <div className={styles.genres__content}>
                <GenreForm mode="create" />
            </div>
        </div>
    );
}