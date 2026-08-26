'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import genresService from '../../../../services/genresService';
import { Genre, GenreOrder } from '../../../../services/genresService';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import styles from './GenresTable.module.scss';
import SortableRow from './SortableRow';

interface GenresTableProps {
    genres: Genre[];
    onRefresh: () => void;
}

export default function GenresTable({ genres, onRefresh }: GenresTableProps) {
    const router = useRouter();
    const { t } = useTranslation();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [genresList, setGenresList] = useState<Genre[]>(genres);
    const [isReordering, setIsReordering] = useState(false);

    // Обновляем локальный стейт когда genres извне меняется
    useEffect(() => {
        setGenresList(genres);
    }, [genres]);

    // Настройка сенсоров для dnd-kit
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = genresList.findIndex((genre) => genre.id === active.id);
        const newIndex = genresList.findIndex((genre) => genre.id === over.id);

        const newGenresList = arrayMove(genresList, oldIndex, newIndex);
        setGenresList(newGenresList);

        // Подготавливаем данные для отправки на сервер
        const genresOrder: GenreOrder[] = newGenresList.map((genre, index) => ({
            id: genre.id,
            order: index,
        }));

        try {
            setIsReordering(true);
            await genresService.updateGenresOrder(genresOrder);
            onRefresh(); // Перезагружаем данные с сервера
        } catch (error: any) {
            console.error('Error updating genres order:', error);
            toast.error(error.error || t('admin.genres.reorderError'));
            // Возвращаем старый порядок при ошибке
            setGenresList(genres);
        } finally {
            setIsReordering(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        const confirmDelete = window.confirm(
            t('toasts.deleteConfirmGenre', { name })
        );

        if (!confirmDelete) return;

        try {
            setDeletingId(id);
            await genresService.deleteGenre(id);
            toast.success(t('toasts.genreDeleted'));
            onRefresh();
        } catch (error: any) {
            console.error('Error deleting genre:', error);

            if (error.count) {
                toast.error(t('toasts.cannotDeleteGenre', { count: error.count }));
            } else {
                toast.error(error.error || t('toasts.genreDeleteError'));
            }
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (dateString: string | Date) => {
        try {
            const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

            if (isNaN(date.getTime())) {
                return typeof dateString === 'string' ? dateString : t('common.invalidDate');
            }

            return format(date, 'dd.MM.yyyy', { locale: ru });
        } catch {
            return typeof dateString === 'string' ? dateString : t('common.dateError');
        }
    };

    if (!genresList || genresList.length === 0) {
        return (
            <div className={styles.table__empty}>
                <p>{t('admin.genres.notFound')}</p>
            </div>
        );
    }

    return (
        <div className={styles.table}>
            {isReordering && (
                <div className={styles.reorderingBanner}>
                    {t('admin.genres.reordering')}
                </div>
            )}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className={styles.table__container}>
                    <table className={styles.table__wrapper}>
                        <thead className={styles.table__header}>
                            <tr>
                                <th>{t('common.name')}</th>
                                <th>{t('admin.genres.colDescription')}</th>
                                <th>{t('admin.genres.colCreatedAt')}</th>
                                <th>{t('common.actions')}</th>
                                <th></th> {/* Для drag handle */}
                            </tr>
                        </thead>
                        <tbody className={styles.table__body}>
                            <SortableContext
                                items={genresList.map((genre) => genre.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {genresList.map((genre, index) => (
                                    <SortableRow key={genre.id} id={genre.id}>
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
                                                onClick={() => router.push(`/admin/genres/edit/${genre.id}`)}
                                                className={`${styles.table__button} ${styles.table__button_edit}`}
                                            >
                                                {t('admin.genres.edit')}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(genre.id, genre.name)}
                                                disabled={deletingId === genre.id}
                                                className={`${styles.table__button} ${styles.table__button_delete}`}
                                            >
                                                {deletingId === genre.id ? t('common.deleting') : t('common.delete')}
                                            </button>
                                        </td>
                                    </SortableRow>
                                ))}
                            </SortableContext>
                        </tbody>
                    </table>
                </div>
            </DndContext>
        </div>
    );
}
