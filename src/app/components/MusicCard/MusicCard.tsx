'use client'
import styles from './MusicCard.module.scss'
import { useState, useEffect, useRef } from "react"
import { Music } from '@/app/services/musicService'
import {Genre} from '@/app/services/genresService'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import { motion, AnimatePresence } from 'framer-motion'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import type { Swiper as SwiperType } from 'swiper';

interface MusicCardProps {
    music: Music[];
    genre: Genre;
    index: number;
}

export default function MusicCard({music, genre, index} : MusicCardProps) {
    const [currentMusicCard, setCurrenMusicCard] = useState<Music>();
    const prevRef = useRef<HTMLDivElement | null>(null);
    const nextRef = useRef<HTMLDivElement | null>(null);
    const swiperRef = useRef<SwiperType | null>(null);

    useEffect(() => {
        setCurrenMusicCard(music[0])
    }, [])


    const handlePrevClick = () => {
    if (!currentMusicCard) return
    const currentIdx = music.findIndex(m => m.id === currentMusicCard.id)
    if (currentIdx <= 0) return
    const newIdx = currentIdx - 1
    setCurrenMusicCard(music[newIdx])
    swiperRef.current?.slidePrev()
}

const handleNextClick = () => {
    if (!currentMusicCard) return
    const currentIdx = music.findIndex(m => m.id === currentMusicCard.id)
    if (currentIdx >= music.length - 1) return
    const newIdx = currentIdx + 1
    setCurrenMusicCard(music[newIdx])
    swiperRef.current?.slideNext()
}

const currentIdx = currentMusicCard
  ? music.findIndex(m => m.id === currentMusicCard.id)
  : -1;

const isPrevDisabled = currentIdx <= 0;
const isNextDisabled = currentIdx === -1 || currentIdx >= music.length - 1;


    return (
      <div className={styles.container}>
        <AnimatePresence>
          <motion.img
            key={currentMusicCard?.id}
            src={currentMusicCard?.mainImage}
            alt={currentMusicCard?.name}
            className={styles.container__backgroundImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </AnimatePresence>
        <div className={styles.container__backgroundDark}></div>

        <div
          className={`${styles.container__head} ${
            index % 2 === 1 ? styles.rightish : styles.leftish
          }`}
        >
          <div className={styles.container__head__albumContainer}>
            <AnimatePresence mode="wait">
              <motion.img
                key={currentMusicCard?.id}
                src={currentMusicCard?.mainImage}
                alt={currentMusicCard?.name}
                className={styles.container__head__albumContainer__cover}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                  scale: { duration: 0.4 },
                }}
              />
            </AnimatePresence>
            <div className={styles.container__head__albumContainer__links}>
              <img
                src="/images/icons/musiccard/spotify_bw.svg"
                className={styles.container__head__albumContainer__links__link}
              />
              <img
                src="/images/icons/musiccard/ym_bw.svg"
                className={styles.container__head__albumContainer__links__link}
              />
              <img
                src="/images/icons/musiccard/yt_bw.svg"
                className={styles.container__head__albumContainer__links__link}
              />
              <img
                src="/images/icons/musiccard/vkmusic_bw.svg"
                className={styles.container__head__albumContainer__links__link}
              />
            </div>
          </div>

          <div className={styles.container__head__genreInfo}>
            <h2 className={styles.container__head__genreInfo__header}>
              {genre.name}
            </h2>
            <p className={styles.container__head__genreInfo__description}>
              {genre.description}
            </p>
          </div>
        </div>

        <div className={styles.container__allMusic}>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={12}
            navigation={{
              // если хочешь свой disabled‑класс:
              disabledClass: styles.customNav_disabled,
            }}
            onBeforeInit={(swiper: any) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            className={styles.allMusicSwiper}
            breakpoints={{
              320: { slidesPerView: 3 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 7 },
              1800: { slidesPerView: 12 },
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
          >
            {music.map((track) => (
              <SwiperSlide key={track.id} className={styles.allMusicSlide}>
                <img
                  src={track.mainImage}
                  alt={track.name}
                  className={`${styles.allMusicCover} ${
                    track.id === currentMusicCard?.id ? styles.active : ""
                  }`}
                  onClick={() => {
                    setCurrenMusicCard(track);
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className={styles.navSlider}>
            <div
              className={`${styles.customNav} ${styles.customPrev} ${
                isPrevDisabled ? styles.customNav_disabled : ""
              }`}
              onClick={!isPrevDisabled ? handlePrevClick : undefined}
            >
              <img
                src="/images/icons/musiccard/arrow_left.svg"
                alt="Previous"
              />
            </div>

            <div
              className={`${styles.customNav} ${styles.customNext} ${
                isNextDisabled ? styles.customNav_disabled : ""
              }`}
              onClick={!isNextDisabled ? handleNextClick : undefined}
            >
              <img src="/images/icons/musiccard/arrow_right.svg" alt="Next" />
            </div>
          </div>
        </div>
      </div>
    );
}