'use client';
import { useSearchParams } from 'next/navigation';
import { useMusic } from '@/app/hooks/useMusicMutations';
import { useTranslation } from 'react-i18next';
import MusicForm from '../components/MusicForm';
import styles from '../admin-music.module.scss';

export default function EditMusicPage() {
    const searchParams = useSearchParams();
    const musicId = searchParams.get('id');
    const { t } = useTranslation();

    const { data: music, isLoading, isError } = useMusic(musicId || '');

    if (isLoading) {
        return (
            <div className={styles.music}>
                <div className={styles.music__loading}>
                    <img src='/images/loaders/loader.svg' alt={t('common.loadingAlt')} />
                    <p>{t('admin.music.editLoading')}</p>
                </div>
            </div>
        );
    }

    if (isError || !music) {
        return (
            <div className={styles.music}>
                <div className={styles.music__error}>
                    <p>{t('admin.music.loadErrorTrack')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.music}>
            <div className={styles.music__header}>
                <h1>{t('admin.music.editTitle')}</h1>
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