'use client';
import { useTranslation } from 'react-i18next';
import SiteForm from '../components/SiteForm';
import styles from '../admin-sites.module.scss';

export default function CreateSitePage() {
    const { t } = useTranslation();

    return (
        <div className={styles.sites}>
            <div className={styles.sites__header}>
                <h1>{t('admin.sites.createTitle')}</h1>
            </div>

            <div className={styles.sites__content}>
                <SiteForm mode="create" />
            </div>
        </div>
    );
}