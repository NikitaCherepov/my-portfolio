'use client';
import { useTranslation } from 'react-i18next';
import GenreForm from '../components/GenreForm';
import styles from '../admin-genres.module.scss';

export default function CreateGenrePage() {
    const { t } = useTranslation();

    return (
        <div className={styles.genres}>
            <div className={styles.genres__header}>
                <h1>{t('admin.genres.createTitle')}</h1>
            </div>

            <div className={styles.genres__content}>
                <GenreForm mode="create" />
            </div>
        </div>
    );
}