'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import musicService, { Music } from '../../../../services/musicService';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import styles from './MusicTable.module.scss';

interface MusicTableProps {
    music: Music[];
    onRefresh: () => void;
}

export default function MusicTable({ music, onRefresh }: MusicTableProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string, name: string) => {
        const confirmDelete = window.confirm(
            `Вы уверены, что хотите удалить трек "${name}"?`
        );

        if (!confirmDelete) return;

        try {
            setDeletingId(id);
            await musicService.deleteMusic(id);
            toast.success('Трек успешно удален');
            onRefresh();
        } catch (error: any) {
            console.error('Error deleting music:', error);
            toast.error(error.error || 'Ошибка при удалении трека');
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
                return typeof dateString === 'string' ? dateString : 'Невалидная дата';
            }

            // Используем date-fns для форматирования с русской локализацией
            return format(date, 'dd.MM.yyyy', { locale: ru });
        } catch {
            return typeof dateString === 'string' ? dateString : 'Ошибка даты';
        }
    };

    const truncateLink = (link: string, maxLength: number = 30) => {
        if (link.length <= maxLength) return link;
        return link.substring(0, maxLength) + '...';
    };

    if (!music || music.length === 0) {
        return (
            <div className={styles.table__empty}>
                <p>Музыкальные треки не найдены</p>
            </div>
        );
    }

    return (
        <div className={styles.table}>
            <div className={styles.table__container}>
                <table className={styles.table__wrapper}>
                    <thead className={styles.table__header}>
                        
                            <th>Обложка</th>
                            <th>Название</th>
                            <th>Жанр</th>
                            <th>YouTube</th>
                            <th>Spotify</th>
                            <th>Дата</th>
                            <th>Действия</th>
                        
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
                                        ✏️ Изменить
                                    </a>
                                    {track.preview && (
                                        <a
                                            href={track.preview}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`${styles.table__button} ${styles.table__button_preview}`}
                                        >
                                            🎧 Превью
                                        </a>
                                    )}
                                    <button
                                        onClick={() => handleDelete(track.id, track.name)}
                                        disabled={deletingId === track.id}
                                        className={`${styles.table__button} ${styles.table__button_delete}`}
                                    >
                                        {deletingId === track.id ? 'Удаление...' : '🗑 Удалить'}
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