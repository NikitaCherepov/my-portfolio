'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import musicService, { Music } from '../../../../services/musicService';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import styles from './MusicTable.module.scss';

interface MusicTableProps {
    music: Music[];
    onRefresh: () => void;
}

export default function MusicTable({ music, onRefresh }: MusicTableProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const { t } = useTranslation();

    const handleDelete = async (id: string, name: string) => {
        const confirmDelete = window.confirm(
            t('toasts.deleteConfirmTrack', { name })
        );

        if (!confirmDelete) return;

        try {
            setDeletingId(id);
            await musicService.deleteMusic(id);
            toast.success(t('toasts.trackDeleted'));
            onRefresh();
        } catch (error: any) {
            console.error('Error deleting music:', error);
            toast.error(error.error || t('toasts.musicDeleteErrorHook'));
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (dateString: string | Date) => {
        try {
            // Обработка ISO строки от Prisma или Date объекта
            const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

            // Проверка на валидность даты
            if (isNaN(date.getTime())) {
                return typeof dateString === 'string' ? dateString : t('common.invalidDate');
            }

            // Используем date-fns для форматирования с русской локализацией
            return format(date, 'dd.MM.yyyy', { locale: ru });
        } catch {
            return typeof dateString === 'string' ? dateString : t('common.dateError');
        }
    };

    const truncateLink = (link: string, maxLength: number = 30) => {
        if (link.length <= maxLength) return link;
        return link.substring(0, maxLength) + '...';
    };

    if (!music || music.length === 0) {
        return (
            <div className={styles.table__empty}>
                <p>{t('admin.music.notFound')}</p>
            </div>
        );
    }

    return (
        <div className={styles.table}>
            <div className={styles.table__container}>
                <table className={styles.table__wrapper}>
                    <thead className={styles.table__header}>
                        <tr>
                            <th>{t('admin.music.colCover')}</th>
                            <th>{t('common.name')}</th>
                            <th>{t('admin.genres.colGenre')}</th>
                            <th>YouTube</th>
                            <th>Spotify</th>
                            <th>{t('common.date')}</th>
                            <th>{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className={styles.table__body}>
                        {music.map((track) => (
                            <tr key={track.id}>
                                <td className={`${styles.table__cell} ${styles.table__cell_image}`}>
                                    <img
                                        src={track.mainImage}
                                        alt={track.name}
                                        className={styles.table__cell_image__img}
                                    />
                                </td>
                                <td className={`${styles.table__cell} ${styles.table__cell_name}`}>
                                    {track.name}
                                </td>
                                <td className={`${styles.table__cell} ${styles.table__cell_genre}`}>
                                    <span className={styles.table__cell_genre__tag}>
                                        {track.genre.name}
                                    </span>
                                </td>
                                <td className={`${styles.table__cell} ${styles.table__cell_link}`}>
                                    {track.youtube ? (
                                        <a
                                            href={track.youtube}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={track.youtube}
                                        >
                                            {truncateLink(track.youtube)}
                                        </a>
                                    ) : (
                                        <span style={{ opacity: 0.5 }}>—</span>
                                    )}
                                </td>
                                <td className={`${styles.table__cell} ${styles.table__cell_link}`}>
                                    {track.spotify ? (
                                        <a
                                            href={track.spotify}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={track.spotify}
                                        >
                                            {truncateLink(track.spotify)}
                                        </a>
                                    ) : (
                                        <span style={{ opacity: 0.5 }}>—</span>
                                    )}
                                </td>
                                <td className={`${styles.table__cell} ${styles.table__cell_date}`}>
                                    {formatDate(track.date)}
                                </td>
                                <td className={`${styles.table__cell} ${styles.table__cell_actions}`}>
                                    <a
                                        href={`/admin/music/edit?id=${track.id}`}
                                        className={`${styles.table__button} ${styles.table__button_edit}`}
                                    >
                                        {t('admin.music.edit')}
                                    </a>
                                    {track.preview && (
                                        <a
                                            href={track.preview}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`${styles.table__button} ${styles.table__button_preview}`}
                                        >
                                            {t('admin.music.preview')}
                                        </a>
                                    )}
                                    <button
                                        onClick={() => handleDelete(track.id, track.name)}
                                        disabled={deletingId === track.id}
                                        className={`${styles.table__button} ${styles.table__button_delete}`}
                                    >
                                        {deletingId === track.id ? t('common.deleting') : t('common.delete')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}