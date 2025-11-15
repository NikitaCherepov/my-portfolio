'use client';
import MusicForm from '../components/MusicForm';
import styles from '../admin-music.module.scss';

export default function AddMusicPage() {
    return (
        <div className={styles.music}>
            <div className={styles.music__header}>
                <h1>Добавление музыкального трека</h1>
            </div>

            <div className={styles.music__content}>
                <MusicForm mode="create" />
            </div>
        </div>
    );
}