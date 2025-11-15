'use client';
import { useSearchParams } from 'next/navigation';
import { useMusic } from '@/app/hooks/useMusicMutations';
import MusicForm from '../components/MusicForm';
import styles from '../admin-music.module.scss';

export default function EditMusicPage() {
    const searchParams = useSearchParams();
    const musicId = searchParams.get('id');

    const { data: music, isLoading, isError } = useMusic(musicId || '');

    if (isLoading) {
        return (
            <div className={styles.music}>
                <div className={styles.music__loading}>
                    <img src='/images/loaders/loader.svg' alt="Загрузка" />
                    <p>Загрузка данных трека...</p>
                </div>
            </div>
        );
    }

    if (isError || !music) {
        return (
            <div className={styles.music}>
                <div className={styles.music__error}>
                    <p>Ошибка при загрузке трека или трек не найден</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.music}>
            <div className={styles.music__header}>
                <h1>Редактирование музыкального трека</h1>
            </div>

            <div className={styles.music__content}>
                <MusicForm
                    mode="edit"
                    initialData={music}
                    musicId={music.id}
                />
            </div>
        </div>
    );
}