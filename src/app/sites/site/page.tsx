'use client'

import { use } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSite } from '@/app/hooks/useSites'
import SiteDetail from '@/app/components/SiteDetail'
import styles from './page.module.scss'

export default function SitePage() {
  const searchParams = useSearchParams()
  const siteId = searchParams.get('id')

  if (!siteId) {
    return (
      <div className={styles.error}>
        <h1>Сайт не найден</h1>
        <p>Отсутствует ID сайта в параметрах URL</p>
      </div>
    )
  }

  return <SiteDetailWrapper siteId={siteId} />
}

function SiteDetailWrapper({ siteId }: { siteId: string }) {
  const { data: siteData, isLoading, isError } = useSite(siteId)

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>
  }

  if (isError || !siteData) {
    return (
      <div className={styles.error}>
        <h1>Сайт не найден</h1>
        <p>Не удалось загрузить данные сайта</p>
      </div>
    )
  }

  return <SiteDetail siteData={siteData} />
}