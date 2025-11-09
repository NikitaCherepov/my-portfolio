'use client';
import { useSearchParams } from 'next/navigation';
import { useSite } from '@/app/hooks/useSites';
import SiteForm from '../components/SiteForm';
import styles from '../admin-sites.module.scss';

export default function EditSitePage() {
    const searchParams = useSearchParams();
    const siteId = searchParams.get('id');

    const { data: site, isLoading, isError } = useSite(siteId || '');

    if (isLoading) {
        return (
            <div className={styles.sites}>
                <div className={styles.sites__loading}>
                    <img src='/images/loaders/loader.svg' alt="Загрузка" />
                    <p>Загрузка данных сайта...</p>
                </div>
            </div>
        );
    }

    if (isError || !site) {
        return (
            <div className={styles.sites}>
                <div className={styles.sites__error}>
                    <p>Ошибка при загрузке сайта или сайт не найден</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.sites}>
            <div className={styles.sites__header}>
                <h1>Редактирование сайта</h1>
            </div>

            <div className={styles.sites__content}>
                <SiteForm
                    mode="edit"
                    initialData={site}
                    siteId={site.id}
                />
            </div>
        </div>
    );
}