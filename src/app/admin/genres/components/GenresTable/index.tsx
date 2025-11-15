'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import genresService from '../../../../services/genresService';
import { Genre } from '../../../../services/genresService';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import styles from './GenresTable.module.scss';

interface GenresTableProps {
    genres: Genre[];
    onRefresh: () => void;
}

export default function GenresTable({ genres, onRefresh }: GenresTableProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string, name: string) => {
        const confirmDelete = window.confirm(
            `Вы уверены, что хотите удалить жанр "${name}"?`
        );

        if (!confirmDelete) return;

        try {
            setDeletingId(id);
            await genresService.deleteGenre(id);
            toast.success('Жанр успешно удален');
            onRefresh();
        } catch (error: any) {
            console.error('Error deleting genre:', error);

            if (error.count) {
                toast.error(`Нельзя удалить жанр. С ним связано ${error.count} музыкальных треков.`);
            } else {
                toast.error(error.error || 'Ошибка при удалении жанра');
            }
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (dateString: string | Date) => {
        try {
            const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

            if (isNaN(date.getTime())) {
                return typeof dateString === 'string' ? dateString : 'Невалидная дата';
            }

            return format(date, 'dd.MM.yyyy', { locale: ru });
        } catch {
            return typeof dateString === 'string' ? dateString : 'Ошибка даты';
        }
    };

    if (!genres || genres.length === 0) {
        return (
            <div className={styles.table__empty}>
                <p>Жанры не найдены</p>
            </div>
        );
    }

    return (
        <div className={styles.table}>
            <div className={styles.table__container}>
                <table className={styles.table__wrapper}>
                    <thead className={styles.table__header}>

                            <th>Название</th>
                            <th>Описание</th>
                            <th>Дата создания</th>
                            <th>Действия</th>

                    </thead>
                    <tbody className={styles.table__body}>
                        {genres.map((genre) => (
                            <tr key={genre.id}>
                                <td className={`${styles.table__cell} ${styles.table__cell_name}`}>
                                    {genre.name}
                                </td>
                                <td className={`${styles.table__cell} ${styles.table__cell_description}`}>
                                    {genre.description}
                                </td>
                                <td className={`${styles.table__cell} ${styles.table__cell_date}`}>
                                    {formatDate(genre.createdAt)}
                                </td>
                                <td className={`${styles.table__cell} ${styles.table__cell_actions}`}>
                                    <button
                                        onClick={() => handleDelete(genre.id, genre.name)}
                                        disabled={deletingId === genre.id}
                                        className={`${styles.table__button} ${styles.table__button_delete}`}
                                    >
                                        {deletingId === genre.id ? 'Удаление...' : '🗑 Удалить'}
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