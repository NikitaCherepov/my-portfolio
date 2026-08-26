'use client';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useSite } from '@/app/hooks/useSites';
import SiteForm from '../components/SiteForm';
import styles from '../admin-sites.module.scss';

export default function EditSitePage() {
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const siteId = searchParams.get('id');

    const { data: site, isLoading, isError } = useSite(siteId || '');

    if (isLoading) {
        return (
            <div className={styles.sites}>
                <div className={styles.sites__loading}>
                    <img src='/images/loaders/loader.svg' alt={t('common.loadingAlt')} />
                    <p>{t('admin.sites.editLoading')}</p>
                </div>
            </div>
        );
    }

    if (isError || !site) {
        return (
            <div className={styles.sites}>
                <div className={styles.sites__error}>
                    <p>{t('admin.sites.editError')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.sites}>
            <div className={styles.sites__header}>
                <h1>{t('admin.sites.editTitle')}</h1>
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