'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import sitesService from '../../../../services/sitesService';
import { SiteWork } from '../../../../store/useExitStore';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import styles from './SitesTable.module.scss';

interface SitesTableProps {
    sites: SiteWork[];
    onRefresh: () => void;
}

export default function SitesTable({ sites, onRefresh }: SitesTableProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const { t } = useTranslation();

    const handleDelete = async (id: string, name: string) => {
        const confirmDelete = window.confirm(
            t('toasts.deleteConfirmSite', { name })
        );

        if (!confirmDelete) return;

        try {
            setDeletingId(id);
            await sitesService.deleteSite(id);
            toast.success(t('toasts.siteDeleted'));
            onRefresh();
        } catch (error: any) {
            console.error('Error deleting site:', error);
            toast.error(error.error || t('toasts.siteDeleteError'));
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

            // Используем date-fns для форматирования
            return format(date, 'dd.MM.yyyy');
        } catch {
            return typeof dateString === 'string' ? dateString : t('common.dateError');
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
                            <th>{t('common.name')}</th>
                            <th>{t('admin.sites.colDirectLink')}</th>
                            <th>GitHub</th>
                            <th>{t('admin.sites.colStack')}</th>
                            <th>{t('common.date')}</th>
                            <th>{t('common.actions')}</th>
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
                                        href={`/admin/sites/edit?id=${site.id}`}
                                        className={`${styles.table__button} ${styles.table__button_edit}`}
                                    >
                                        {t('admin.sites.details')}
                                    </a>
                                    <a
                                        href={site.directLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${styles.table__button} ${styles.table__button_view}`}
                                    >
                                        {t('admin.sites.view')}
                                    </a>
                                    <button
                                        onClick={() => handleDelete(site.id, site.name)}
                                        disabled={deletingId === site.id}
                                        className={`${styles.table__button} ${styles.table__button_delete}`}
                                    >
                                        {deletingId === site.id ? t('common.deleting') : t('common.delete')}
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