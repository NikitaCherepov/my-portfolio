'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import sitesService from '../../../../services/sitesService';
import { SiteWork } from '../../../../store/useExitStore';
import styles from './SitesTable.module.scss';

interface SitesTableProps {
    sites: SiteWork[];
    onRefresh: () => void;
}

export default function SitesTable({ sites, onRefresh }: SitesTableProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string, name: string) => {
        const confirmDelete = window.confirm(
            `Вы уверены, что хотите удалить сайт "${name}"?`
        );

        if (!confirmDelete) return;

        try {
            setDeletingId(id);
            await sitesService.deleteSite(id);
            toast.success('Сайт успешно удален');
            onRefresh();
        } catch (error: any) {
            console.error('Error deleting site:', error);
            toast.error(error.error || 'Ошибка при удалении сайта');
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    if (!sites || sites.length === 0) {
        return null;
    }

    return (
        <div className={styles.table}>
            <div className={styles.table__container}>
                <table className={styles.table__wrapper}>
                    <thead className={styles.table__header}>
                        <tr>
                            <th>Название</th>
                            <th>Прямая ссылка</th>
                            <th>GitHub</th>
                            <th>Стек</th>
                            <th>Дата</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody className={styles.table__body}>
                        {sites.map((site) => (
                            <tr key={site.id}>
                                <td className={`${styles.table__cell} ${styles.table__cell_name}`}>
                                    {site.name}
                                </td>
                                <td className={`${styles.table__cell} ${styles.table__cell_link}`}>
                                    <a
                                        href={site.directLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {site.directLink}
                                    </a>
                                </td>
                                <td className={`${styles.table__cell} ${styles.table__cell_link}`}>
                                    {site.github ? (
                                        <a
                                            href={site.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {site.github}
                                        </a>
                                    ) : (
                                        <span style={{ opacity: 0.5 }}>—</span>
                                    )}
                                </td>
                                <td className={`${styles.table__cell} ${styles.table__cell_stack}`}>
                                    {site.stack.map((tech, index) => (
                                        <span key={index} className={styles.table__cell_stack__item}>
                                            {tech}
                                        </span>
                                    ))}
                                </td>
                                <td className={`${styles.table__cell} ${styles.table__cell_date}`}>
                                    {formatDate(site.date)}
                                </td>
                                <td className={`${styles.table__cell} ${styles.table__cell_actions}`}>
                                    <a
                                        href={site.directLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${styles.table__button} ${styles.table__button_view}`}
                                    >
                                        🡢 Просмотр
                                    </a>
                                    <button
                                        onClick={() => handleDelete(site.id, site.name)}
                                        disabled={deletingId === site.id}
                                        className={`${styles.table__button} ${styles.table__button_delete}`}
                                    >
                                        {deletingId === site.id ? 'Удаление...' : '🗑 Удалить'}
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