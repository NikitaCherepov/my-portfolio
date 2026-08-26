'use client';
import { useTranslation } from 'react-i18next';
import MusicForm from '../components/MusicForm';
import styles from '../admin-music.module.scss';

export default function AddMusicPage() {
    const { t } = useTranslation();

    return (
        <div className={styles.music}>
            <div className={styles.music__header}>
                <h1>{t('admin.music.addTitle')}</h1>
            </div>

            <div className={styles.music__content}>
                <MusicForm mode="create" />
            </div>
        </div>
    );
}