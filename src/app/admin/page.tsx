'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './admin.module.scss';

export default function AdminPage() {
  const router = useRouter();

  return (
    <div className={`mainContainer ${styles.container}`}>
      <div className={styles.container__redirect}>
        Перенаправление на страницу входа...
      </div>
    </div>
  );
}