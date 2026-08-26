'use client'

import { use } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSite } from '@/app/hooks/useSites'
import SiteDetail from '@/app/components/SiteDetail'
import { useTranslation } from 'react-i18next'
import styles from './page.module.scss'

export default function SitePage() {
  const searchParams = useSearchParams()
  const siteId = searchParams.get('id')
  const { t } = useTranslation()

  if (!siteId) {
    return (
      <div className={styles.error}>
        <h1>{t('sitePage.notFound')}</h1>
        <p>{t('sitePage.missingId')}</p>
      </div>
    )
  }

  return <SiteDetailWrapper siteId={siteId} />
}

function SiteDetailWrapper({ siteId }: { siteId: string }) {
  const { data: siteData, isLoading, isError } = useSite(siteId)
  const { t } = useTranslation()

  if (isLoading) {
    return <div className={styles.loading}>{t('sitePage.loading')}</div>
  }

  if (isError || !siteData) {
    return (
      <div className={styles.error}>
        <h1>{t('sitePage.notFound')}</h1>
        <p>{t('sitePage.loadError')}</p>
      </div>
    )
  }

  return <SiteDetail siteData={siteData} />
}
