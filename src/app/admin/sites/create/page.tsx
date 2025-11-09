'use client';
import SiteForm from '../components/SiteForm';
import styles from '../admin-sites.module.scss';

export default function CreateSitePage() {
    return (
        <div className={styles.sites}>
            <div className={styles.sites__header}>
                <h1>Создание сайта</h1>
            </div>

            <div className={styles.sites__content}>
                <SiteForm mode="create" />
            </div>
        </div>
    );
}