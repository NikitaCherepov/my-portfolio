'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import Button from '../Cards/SiteCard/Button'
import getEmoji from '@/app/utilities/getEmoji'
import { format, parseISO, isValid } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { pickLocale, pickLocaleArray } from '@/app/utilities/pickLocale'
import styles from './SiteDetail.module.scss'

// Импортируем стили Swiper
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface SiteDetailProps {
  siteData: {
    id: string;
    name: string;
    nameEn?: string | null;
    mainImage: string;
    gallery?: string[];
    description?: string;
    descriptionEn?: string | null;
    stack?: string[];
    features?: string[];
    featuresEn?: string[] | null;
    github?: string;
    directLink?: string;
    date: string;
    companyName?: string | null;
    companyNameEn?: string | null;
    companyUrl?: string | null;
  }
}

export default function SiteDetail({ siteData }: SiteDetailProps) {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const swiperRef = useRef<any>(null)
  const { t, i18n } = useTranslation()

  const displayName = pickLocale(siteData.name, siteData.nameEn, i18n.language)
  const displayDescription = pickLocale(siteData.description, siteData.descriptionEn, i18n.language)
  const displayFeatures = pickLocaleArray(siteData.features, siteData.featuresEn, i18n.language)
  const displayCompanyName = pickLocale(siteData.companyName, siteData.companyNameEn, i18n.language)

  // Собираем массив изображений: главная + галерея
  const allImages = [siteData.mainImage, ...(siteData.gallery || [])]

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const formatDisplayDate = (value: string) => {
    try {
      const date = parseISO(value)
      if (!isValid(date)) return value
      return format(date, 'dd.MM.yyyy')
    } catch {
      return value
    }
  }

  const handleBackClick = () => {
    router.back()
  }

  const handlePrevSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev()
    }
  }

  const handleNextSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext()
    }
  }

  // Проверяем наличие данных перед рендером
  if (!siteData || !siteData.name) {
    return (
      <div className={styles.error}>
        <h1>{t('siteDetail.dataNotLoaded')}</h1>
        <p>{t('siteDetail.tryRefresh')}</p>
      </div>
    )
  }

  return (
    <div className={styles.siteDetail}>
      {/* Навигационная секция */}
      <section className={styles.navigation}>
        <div className={styles.navigation__content}>
          <button
            onClick={handleBackClick}
            className={`${styles.navigation__backButton} hoverEffect`}
          >
            <img
              src="/images/icons/arrow.svg"
              alt={t('siteDetail.backAlt')}
              className={styles.navigation__backButton__icon}
            />
            <span>{t('siteDetail.backToList')}</span>
          </button>

          <div className={styles.navigation__date}>
            {formatDisplayDate(siteData.date)}
          </div>
        </div>
      </section>

      {/* Основной контент - CSS Grid */}
      <main className={styles.main}>
        <div className={styles.main__content}>
          {/* Левая колонка - Галерея */}
          <div className={styles.gallery}>
            <div className={styles.gallery__container}>
              <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                spaceBetween={20}
                slidesPerView={1}
                loop={false}
                className={styles.gallery__swiper}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper
                }}
              >
                {allImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      alt={t('siteDetail.screenshotAlt', { name: displayName ?? siteData.name, index: index + 1 })}
                      className={styles.gallery__image}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Кастомные стрелки навигации */}
              {!isMobile && (
                <>
                  <button
                    className={`${styles.gallery__navButton} ${styles.gallery__navButton_prev}`}
                    onClick={handlePrevSlide}
                  >
                    <img
                      src="/images/icons/arrow.svg"
                      alt={t('siteDetail.prevImgAlt')}
                    />
                  </button>
                  <button
                    className={`${styles.gallery__navButton} ${styles.gallery__navButton_next}`}
                    onClick={handleNextSlide}
                  >
                    <img
                      src="/images/icons/arrow.svg"
                      alt={t('siteDetail.nextImgAlt')}
                    />
                  </button>
                </>
              )}
            </div>

            {/* Описание проекта */}
            <div className={styles.description}>
              <h2 className={styles.description__title}>{t('siteDetail.aboutProject')}</h2>
              <div className={styles.description__text}>
                {displayDescription && displayDescription.split("\n").map((line: string, index: number) => (
                  <p key={index}>
                    {line}
                    {line && <br />}
                  </p>
                ))}

                {/* Особенности проекта интегрированы в описание */}
                {displayFeatures.length > 0 && (
                  <div className={styles.features}>
                    <h3 className={styles.features__title}>{t('siteDetail.projectFeatures')}</h3>
                    <ul className={styles.features__list}>
                      {displayFeatures.map((feature: string, index: number) => (
                        <li key={index} className={styles.features__item}>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Правая колонка - Информация о проекте */}
          <aside className={styles.sidebar}>
            {/* Название проекта */}
            <div className={styles.sidebar__header}>
              <h1 className={styles.sidebar__title}>{displayName}</h1>
            </div>

            {siteData.companyName && (
              <div className={styles.contribution}>
                <div className={styles.contribution__label}>{t('siteDetail.participation')}</div>
                {siteData.companyUrl ? (
                  <a
                    href={siteData.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contribution__company}
                  >
                    {displayCompanyName ?? siteData.companyName}
                  </a>
                ) : (
                  <div className={styles.contribution__company}>{displayCompanyName ?? siteData.companyName}</div>
                )}
              </div>
            )}

            {/* Кнопки действий */}
            <div className={styles.actions}>
              {siteData.github && (
                <Button
                  link={siteData.github}
                  icon="/images/icons/github.svg"
                  text="GitHub"
                  background="white"
                  className={styles.actions__button}
                />
              )}
              {siteData.directLink && (
                <Button
                  link={siteData.directLink}
                  icon="/images/icons/link.svg"
                  text={t('siteDetail.goToSite')}
                  background="white"
                  className={styles.actions__button}
                />
              )}
            </div>

            {/* Технический стек */}
            {siteData.stack && siteData.stack.length > 0 && (
              <div className={styles.stack}>
                <h3 className={styles.stack__title}>{t('siteDetail.techStack')}</h3>
                <div className={styles.stack__list}>
                  {siteData.stack.map((tech: string, index: number) => (
                    <div key={index} className={styles.stack__item}>
                      <span className={styles.stack__emoji}>
                        {getEmoji(tech)}
                      </span>
                      {/* <span className={styles.stack__name}>{tech}</span> */}
                    </div>
                  ))}
                </div>
              </div>
            )}

            

          </aside>
        </div>
      </main>
    </div>
  )
}
