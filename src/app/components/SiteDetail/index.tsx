'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import Button from '../Cards/SiteCard/Button'
import getEmoji from '@/app/utilities/getEmoji'
import { format, parseISO, isValid } from 'date-fns'
import styles from './SiteDetail.module.scss'

// Импортируем стили Swiper
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface SiteDetailProps {
  siteData: {
    id: string;
    name: string;
    mainImage: string;
    gallery?: string[];
    description?: string;
    stack?: string[];
    features?: string[];
    github?: string;
    directLink?: string;
    date: string;
  }
}

export default function SiteDetail({ siteData }: SiteDetailProps) {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const swiperRef = useRef<any>(null)

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
        <h1>Данные сайта не загружены</h1>
        <p>Попробуйте обновить страницу</p>
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
              alt="Назад"
              className={styles.navigation__backButton__icon}
            />
            <span>К списку сайтов</span>
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
                      alt={`${siteData.name} - скриншот ${index + 1}`}
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
                      alt="Предыдущее изображение"
                    />
                  </button>
                  <button
                    className={`${styles.gallery__navButton} ${styles.gallery__navButton_next}`}
                    onClick={handleNextSlide}
                  >
                    <img
                      src="/images/icons/arrow.svg"
                      alt="Следующее изображение"
                    />
                  </button>
                </>
              )}
            </div>

            {/* Описание проекта */}
            <div className={styles.description}>
              <h2 className={styles.description__title}>О проекте</h2>
              <div className={styles.description__text}>
                {siteData.description && siteData.description.split("\n").map((line: string, index: number) => (
                  <p key={index}>
                    {line}
                    {line && <br />}
                  </p>
                ))}

                {/* Особенности проекта интегрированы в описание */}
                {siteData.features && siteData.features.length > 0 && (
                  <div className={styles.features}>
                    <h3 className={styles.features__title}>Особенности проекта</h3>
                    <ul className={styles.features__list}>
                      {siteData.features.map((feature: string, index: number) => (
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
              <h1 className={styles.sidebar__title}>{siteData.name}</h1>
            </div>

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
                  text="Перейти на сайт"
                  background="white"
                  className={styles.actions__button}
                />
              )}
            </div>

            {/* Технический стек */}
            {siteData.stack && siteData.stack.length > 0 && (
              <div className={styles.stack}>
                <h3 className={styles.stack__title}>Технологический стек</h3>
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