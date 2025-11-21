'use client'
import styles from './MusicCard.module.scss'
import { useState, useEffect, useRef } from "react"
import { Music } from '@/app/services/musicService'
import {Genre} from '@/app/services/genresService'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import { motion, AnimatePresence } from 'framer-motion'
import { usePlayerStateStore, usePlayerStore } from '@/app/store/useExitStore'
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
    const [isHovering, setIsHovering] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
    const [isSwipeAnimating, setIsSwipeAnimating] = useState(false);
    const prevRef = useRef<HTMLDivElement | null>(null);
    const nextRef = useRef<HTMLDivElement | null>(null);
    const swiperRef = useRef<SwiperType | null>(null);

    // Определение мобильных устройств
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    const { audio, setAudio, currentTime, currentSrc, isPlaying, play, pause, duration, setDuration, setName } = usePlayerStateStore();
    const { showPlayer, setShowPlayer } = usePlayerStore();

    useEffect(() => {
        setCurrenMusicCard(music[0])
    }, [])

    // Обработчики свайпов для мобильных устройств
    const touchStartPos = useRef<{ x: number; y: number } | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (!isMobile) return;
        touchStartPos.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isMobile || !touchStartPos.current) return;

        const currentX = e.touches[0].clientX;
        const deltaX = currentX - touchStartPos.current.x;

        // Показываем визуальную индикацию свайпа
        if (Math.abs(deltaX) > 20) {
            setSwipeDirection(deltaX > 0 ? 'right' : 'left');
        } else {
            setSwipeDirection(null);
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!isMobile || !touchStartPos.current) return;

        const endX = e.changedTouches[0].clientX;
        const deltaX = endX - touchStartPos.current.x;
        const threshold = 50; // Минимальное расстояние для свайпа

        if (Math.abs(deltaX) > threshold) {
            setIsSwipeAnimating(true);
            if (deltaX > 0) {
                // Свайп вправо - предыдущий трек
                handlePrevClick();
            } else {
                // Свайп влево - следующий трек
                handleNextClick();
            }

            setTimeout(() => {
                setIsSwipeAnimating(false);
            }, 300);
        }

        // Сбрасываем состояние
        touchStartPos.current = null;
        setSwipeDirection(null);
    };

    const handlePlayPause = () => {
        if (!currentMusicCard?.preview) return;

        if (currentMusicCard.name) {
            setName(currentMusicCard.name);
        }

        if (currentSrc !== currentMusicCard.preview) {
            // Новый трек - открываем плеер и начинаем играть
            if (!showPlayer) {
                setShowPlayer();
            }
            pause();
            setAudio(currentMusicCard.preview);
            play();
            setDuration(audio?.duration);
        } else if (duration === currentTime) {
            // Трек закончился - заново играем, открываем плеер
            if (!showPlayer) {
                setShowPlayer();
            }
            play();
        } else if (!isPlaying) {
            // Продолжаем играть паузу - открываем плеер
            if (!showPlayer) {
                setShowPlayer();
            }
            play();
        } else if (isPlaying) {
            // Ставим на паузу - НЕ открываем плеер
            pause();
        }
    }


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
            transition={{ duration: 0.6, ease: "easeInOut" }}
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
              <motion.div
                key={currentMusicCard?.id}
                className={styles.container__head__albumContainer__coverWrapper}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                  scale: { duration: 0.3 },
                }}
                onHoverStart={() => setIsHovering(true)}
                onHoverEnd={() => setIsHovering(false)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <motion.img
                  src={currentMusicCard?.mainImage}
                  alt={currentMusicCard?.name}
                  className={styles.container__head__albumContainer__cover}
                />
                <AnimatePresence>
                  {(isHovering || isMobile) && currentMusicCard?.preview && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={styles.container__head__albumContainer__playButton}
                    >
                      <img
                        src={
                          currentSrc === currentMusicCard.preview && duration === currentTime
                            ? '/images/icons/MusicPlayer/play.svg'
                            : currentSrc === currentMusicCard.preview && isPlaying
                            ? '/images/icons/MusicPlayer/pause.svg'
                            : '/images/icons/MusicPlayer/play.svg'
                        }
                        alt="Play/Pause"
                        onClick={handlePlayPause}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {(isHovering || isMobile) && currentMusicCard?.preview && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={styles.container__head__albumContainer__playButtonContainer}
                    ></motion.div>
                  )}
                </AnimatePresence>

                {/* Индикатор свайпа для мобильных */}
                <AnimatePresence>
                  {swipeDirection && isMobile && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={styles.container__head__albumContainer__swipeIndicator}
                      style={{
                        [swipeDirection === 'left' ? 'right' : 'left']: 20,
                      }}
                    >
                      <img
                        src="/images/icons/musiccard/arrow_right.svg"
                        alt={swipeDirection === 'left' ? "Next" : "Previous"}
                        className={`${styles.swipeArrow} ${
                          swipeDirection === 'left'
                            ? styles.swipeArrowPrev
                            : styles.swipeArrowNext
                        }`}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
            <div className={styles.container__head__albumContainer__links}>
              {currentMusicCard?.spotify ? (
                <a
                  href={currentMusicCard.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.container__head__albumContainer__links__link}
                >
                  <img
                    src="/images/icons/musiccard/spotify_bw.svg"
                    alt="Spotify"
                  />
                </a>
              ) : (
                <div
                  className={`${styles.container__head__albumContainer__links__link} ${styles.disabled}`}
                >
                  <img
                    src="/images/icons/musiccard/spotify_bw.svg"
                    alt="Spotify"
                  />
                </div>
              )}
              {currentMusicCard?.ymusic ? (
                <a
                  href={currentMusicCard.ymusic}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.container__head__albumContainer__links__link}
                >
                  <img
                    src="/images/icons/musiccard/ym_bw.svg"
                    alt="Yandex Music"
                  />
                </a>
              ) : (
                <div
                  className={`${styles.container__head__albumContainer__links__link} ${styles.disabled}`}
                >
                  <img
                    src="/images/icons/musiccard/ym_bw.svg"
                    alt="Yandex Music"
                  />
                </div>
              )}
              {currentMusicCard?.youtube ? (
                <a
                  href={currentMusicCard.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.container__head__albumContainer__links__link}
                >
                  <img
                    src="/images/icons/musiccard/yt_bw.svg"
                    alt="YouTube"
                  />
                </a>
              ) : (
                <div
                  className={`${styles.container__head__albumContainer__links__link} ${styles.disabled}`}
                >
                  <img
                    src="/images/icons/musiccard/yt_bw.svg"
                    alt="YouTube"
                  />
                </div>
              )}
              {currentMusicCard?.vkmusic ? (
                <a
                  href={currentMusicCard.vkmusic}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.container__head__albumContainer__links__link}
                >
                  <img
                    src="/images/icons/musiccard/vkmusic_bw.svg"
                    alt="VK Music"
                  />
                </a>
              ) : (
                <div
                  className={`${styles.container__head__albumContainer__links__link} ${styles.disabled}`}
                >
                  <img
                    src="/images/icons/musiccard/vkmusic_bw.svg"
                    alt="VK Music"
                  />
                </div>
              )}
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
            slidesPerView={'auto'}
            navigation={{
              // если хочешь свой disabled‑класс:
              disabledClass: styles.customNav_disabled,
            }}
            onBeforeInit={(swiper: any) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            className={styles.allMusicSwiper}
            // breakpoints={{
            //   320: { slidesPerView: 3 },
            //   768: { slidesPerView: 3 },
            //   1024: { slidesPerView: 7 },
            //   1800: { slidesPerView: 12 },
            // }}
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