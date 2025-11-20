'use client'
import styles from './music.module.scss'
import { useMusic } from "../hooks/useMusic"
import { useGenres } from "../hooks/useGenres"
import { usePathname } from "next/navigation"
import { useViewStore } from "../store/useExitStore"
import { useSortSitesStore } from "../store/useExitStore"
import {motion} from 'framer-motion'
import { usePagination } from "../store/useExitStore"
import {useState, useEffect} from 'react'
import MusicCard from "../components/MusicCard/MusicCard"
import SortingComponentForList from "../components/SortingComponentForList"
import PlayerWatcher from "../components/PlayerWatcher"
import MusicPlayer from "../components/MusicPlayer"
import { Music } from '../services/musicService'
import { Genre } from '../services/genresService'
import Image from 'next/image'

// Типы и константы для обложек альбомов
type AlbumCover = {
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    coverUrl: string;
    parallaxLayer: number;
};

// Константы для параллакс-слоев
const PARALLAX_LAYERS = [
    { layer: 0, speedMultiplier: 0.3, sizeRange: [50, 100], opacity: 0.25, blur: 0 }, // Дальний слой
    { layer: 1, speedMultiplier: 0.5, sizeRange: [100, 150], opacity: 0.4, blur: 0 },   // Средне-дальний слой
    { layer: 2, speedMultiplier: 0.7, sizeRange: [150, 200], opacity: 0.6, blur: 0 }, // Средний слой
    { layer: 3, speedMultiplier: 1.0, sizeRange: [200, 250], opacity: 0.8, blur: 0 },   // Передний слой
];

const ALBUM_COUNT = 12;


export default function MusicPage() {

    const {data: music, isLoading: isMusicLoading, isSuccess: isMusicSuccess} = useMusic();
    const {data: genres, isLoading: isGenresLoading, isSuccess: isGenresSuccess} = useGenres();

    const volume = 0.1;

    const notes = [
        '/images/icons/notes/1.svg',
        '/images/icons/notes/2.svg',
        '/images/icons/notes/3.svg',
        '/images/icons/notes/4.svg',
    ]

    const soundFiles = [
      "/sounds/do.mp3",
      "/sounds/re.mp3",
      "/sounds/mi.mp3",
      // "/sounds/fa.mp3",
      "/sounds/sol.mp3",
      "/sounds/la.mp3",
      // "/sounds/c.mp3",
    ];

    type NoteConfig = {
        src: string;
        left: number; // %
        top: number;  // %
        parallaxFactor: number;
        soundSrc: string;
    };

    const [notesConfig, setNotesConfig] = useState<NoteConfig[]>([]);
const [albumCovers, setAlbumCovers] = useState<AlbumCover[]>([]);

    useEffect(() => {
      const NOTE_COUNT = 15;
      const LEFT_MIN = 0;
      const LEFT_MAX = 100;
      const TOP_MIN = 0;
      const TOP_MAX = 90; // чтобы "bottom ~10%" оставался
      const MIN_DIST = 25; // минимальное расстояние в процентах
      const MAX_DIST = 90; // максимальное расстояние до "соседа"
      const MAX_ATTEMPTS = 25;

      const randomInRange = (min: number, max: number) =>
        min + Math.random() * (max - min);

      const generated: NoteConfig[] = [];
      let soundIndex = 0;

      const EDGE_MIN_MARGIN = 5;
      const EDGE_MAX_MARGIN = 15;

      for (let i = 0; i < NOTE_COUNT; i++) {
        const src = notes[Math.floor(Math.random() * notes.length)];
        const parallaxFactor = 0.3 + Math.random() * 0.7;

        // границы области с учётом отступа от краёв
        const marginX =
          EDGE_MIN_MARGIN + Math.random() * (EDGE_MAX_MARGIN - EDGE_MIN_MARGIN);
        const marginY =
          EDGE_MIN_MARGIN + Math.random() * (EDGE_MAX_MARGIN - EDGE_MIN_MARGIN);

        const effectiveLeftMin = LEFT_MIN + marginX;
        const effectiveLeftMax = LEFT_MAX - marginX;
        const effectiveTopMin = TOP_MIN + marginY;
        const effectiveTopMax = TOP_MAX - marginY;

        let left = randomInRange(effectiveLeftMin, effectiveLeftMax);
        let top = randomInRange(effectiveTopMin, effectiveTopMax);

        if (generated.length > 0) {
          const CANDIDATE_ATTEMPTS = 40;

          let bestLeft = left;
          let bestTop = top;
          let bestMinDist = -Infinity;

          for (let attempt = 0; attempt < CANDIDATE_ATTEMPTS; attempt++) {
            const candidateLeft = randomInRange(
              effectiveLeftMin,
              effectiveLeftMax
            );
            const candidateTop = randomInRange(
              effectiveTopMin,
              effectiveTopMax
            );

            let minDistToExisting = Infinity;

            for (const other of generated) {
              const dx = candidateLeft - other.left;
              const dy = candidateTop - other.top;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < minDistToExisting) minDistToExisting = dist;
            }

            // ищем точку, у которой расстояние до ближайшей ноты максимальное
            if (minDistToExisting > bestMinDist) {
              bestMinDist = minDistToExisting;
              bestLeft = candidateLeft;
              bestTop = candidateTop;
            }
          }

          // проверка "коллизии" как раньше — не ближе MIN_DIST
          if (bestMinDist >= MIN_DIST) {
            left = bestLeft;
            top = bestTop;
          } else {
            // если не нашли хорошей — просто рандом в безопасной зоне
            left = randomInRange(effectiveLeftMin, effectiveLeftMax);
            top = randomInRange(effectiveTopMin, effectiveTopMax);
          }
        }

        const soundSrc = soundFiles[soundIndex];
        soundIndex = (soundIndex + 1) % soundFiles.length;

        generated.push({ src, left, top, parallaxFactor, soundSrc });
      }

      setNotesConfig(generated);
    }, []);

    // Генерация и анимация обложек альбомов
    useEffect(() => {
        if (!music || music.length === 0) return;
        // Получаем уникальные обложки из альбомов
        const uniqueCovers = Array.from(new Set(music.map(item => item.mainImage).filter(url => url)));
        const availableCovers = uniqueCovers.slice(0, ALBUM_COUNT);

        if (availableCovers.length === 0) return;

        // Функция генерации обложки альбома
        const generateAlbumCover = (coverUrl: string, index: number): AlbumCover => {
            const layer = Math.floor(Math.random() * PARALLAX_LAYERS.length);
            const layerConfig = PARALLAX_LAYERS[layer];

            const size = layerConfig.sizeRange[0] + Math.random() * (layerConfig.sizeRange[1] - layerConfig.sizeRange[0]);
            const speed = (1 + Math.random() * 1.5) * layerConfig.speedMultiplier;
            const angle = Math.random() * Math.PI * 2;

            return {
                id: `cover-${index}-${coverUrl}`,
                x: Math.random() * 100, // случайная позиция по X в процентах
                y: Math.random() * 100, // случайная позиция по Y в процентах
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size,
                coverUrl,
                parallaxLayer: layer,
            };
        };

        // Генерируем начальные обложки
        const initialAlbumCovers = availableCovers.map((coverUrl, index) => generateAlbumCover(coverUrl, index));
        setAlbumCovers(initialAlbumCovers);

        // Функция проверки столкновения между двумя обложками
        const checkCollision = (cover1: AlbumCover, cover2: AlbumCover): boolean => {
            const dx = cover1.x - cover2.x;
            const dy = cover1.y - cover2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = (cover1.size + cover2.size) / 10; // Преобразуем размер в проценты
            return distance < minDistance;
        };

        // Функция обновления позиций
        const updateAlbumCovers = () => {
            setAlbumCovers(prevCovers => {
                const newCovers = [...prevCovers];

                // Обновляем позиции для всех обложек
                newCovers.forEach((cover, index) => {
                    let { x, y, vx, vy } = cover;

                    // Обновляем позицию
                    x += vx * 0.1;
                    y += vy * 0.1;

                    // Проверка столкновений со стенами
                    if (x <= 0 || x >= 100) {
                        vx = -vx * 0.9; // Небольшое затухание при отскоке
                        x = x <= 0 ? 0 : 100;
                    }
                    if (y <= 0 || y >= 100) {
                        vy = -vy * 0.9; // Небольшое затухание при отскоке
                        y = y <= 0 ? 0 : 100;
                    }

                    newCovers[index] = { ...cover, x, y, vx, vy };
                });

                // Проверка столкновений между обложками
                for (let i = 0; i < newCovers.length; i++) {
                    for (let j = i + 1; j < newCovers.length; j++) {
                        const cover1 = newCovers[i];
                        const cover2 = newCovers[j];

                        if (checkCollision(cover1, cover2)) {
                            // Вычисляем вектор столкновения
                            const dx = cover2.x - cover1.x;
                            const dy = cover2.y - cover1.y;
                            const distance = Math.sqrt(dx * dx + dy * dy);

                            if (distance > 0) {
                                // Нормализуем вектор
                                const nx = dx / distance;
                                const ny = dy / distance;

                                // Относительная скорость
                                const dvx = cover2.vx - cover1.vx;
                                const dvy = cover2.vy - cover1.vy;

                                // Скорость вдоль вектора столкновения
                                const speed = dvx * nx + dvy * ny;

                                if (speed < 0) {
                                    // Обложки сближаются, меняем скорости
                                    const impulse = 2 * speed / 2; // Предполагаем равную массу

                                    newCovers[i].vx += impulse * nx * 0.8; // Небольшой коэффициент упругости
                                    newCovers[i].vy += impulse * ny * 0.8;
                                    newCovers[j].vx -= impulse * nx * 0.8;
                                    newCovers[j].vy -= impulse * ny * 0.8;

                                    // Раздвигаем обложки чтобы избежать залипания
                                    const overlap = ((cover1.size + cover2.size) / 10) - distance;
                                    if (overlap > 0) {
                                        const separationX = nx * overlap * 0.5;
                                        const separationY = ny * overlap * 0.5;
                                        newCovers[i].x -= separationX;
                                        newCovers[i].y -= separationY;
                                        newCovers[j].x += separationX;
                                        newCovers[j].y += separationY;
                                    }
                                }
                            }
                        }
                    }
                }

                return newCovers;
            });
        };

        // Запускаем анимацию
        const intervalId = setInterval(updateAlbumCovers, 50); // 20 FPS

        return () => clearInterval(intervalId);
    }, [music]); // Добавляем music в зависимости, чтобы перегенерировать при изменении данных

    const handleNoteClick = (soundSrc: string) => {
        const audio = new Audio(soundSrc);
        audio.volume = volume;
        audio.play().catch(() => {});
    };

    // Показываем loader во время загрузки
    if (isMusicLoading && isGenresLoading) {
        return (
            <div className={styles.loading}>
                <img src='/images/loaders/loader.svg' alt="Загрузка" />
                <p>Загрузка музыки...</p>
            </div>
        );
    }

    return (
      <>
        <PlayerWatcher />
        <MusicPlayer />
        <div className={`mainContainer  ${styles.container}`}>
          <div className={styles.head} id="head">
            <Image
              priority
              className={styles.head__logo}
              src="/images/logo.png"
              alt="Нота меню"
              width={450}
              height={400}
            />
            <p className={styles.head__motto}>
              Пишу музыку для игр и для себя. <br />
              Хочешь трек? Напиши мне
            </p>

            <div className={styles.head__background}>
              {notesConfig.map((note, i) => (
                <motion.div
                  key={i}
                  onClick={() => handleNoteClick(note.soundSrc)}
                  className={styles.head__background__note}
                  initial={{ opacity: 0 }}
                  animate={{
                    x: [-10 * note.parallaxFactor, 10 * note.parallaxFactor],
                    y: [-20 * note.parallaxFactor, 20 * note.parallaxFactor],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    x: {
                      duration: 6 / note.parallaxFactor,
                      repeat: Infinity,
                      repeatType: "mirror",
                      ease: "easeInOut",
                    },
                    y: {
                      duration: 8 / note.parallaxFactor,
                      repeat: Infinity,
                      repeatType: "mirror",
                      ease: "easeInOut",
                    },
                    opacity: {
                      duration: 8 + Math.random() * 12,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "linear",
                      repeatDelay: Math.random() * 5,
                    },
                  }}
                  style={{
                    left: `${note.left}%`,
                    top: `${note.top}%`,
                    scale: 0.2 + note.parallaxFactor * 0.9,
                    opacity: 0.4 + note.parallaxFactor * 0.4,
                  }}
                >
                  <img src={note.src} alt={`Note ${i + 1}`} />
                </motion.div>
              ))}
            </div>
          </div>
          {/* <div className={styles.musicHeader}>
                <h2>Музыка</h2>
            </div> */}

          {/* Фиктивный блок для скролла к музыке */}
          <div id="music" style={{ height: 0 }}></div>

          {genres && genres.length > 0 ? (
            genres.map((genre, index) => {
              // Фильтруем треки по текущему жанру
              const genreTracks =
                music?.filter((track) => track.genre.id === genre.id) || [];

              // Показываем жанр только если в нем есть треки
              if (genreTracks.length === 0) return null;

              return (
                <MusicCard
                  key={`music-card ${genre.name}`}
                  music={genreTracks}
                  genre={genre}
                  index={index + 1}
                />
              );
            })
          ) : (
            <div className={styles.noGenres}>
              <p>Жанры не найдены</p>
            </div>
          )}

          <div className={styles.contacts} id="contacts">
            <div className={styles.contacts__backgroundWhite}></div>
            <div className={styles.contacts__spheres}>
              {albumCovers.map((albumCover) => {
                const layerConfig = PARALLAX_LAYERS[albumCover.parallaxLayer];
                return (
                  <motion.img
                    key={albumCover.id}
                    src={albumCover.coverUrl}
                    alt="Album cover"
                    className={styles.albumCover}
                    animate={{
                      left: `${albumCover.x}%`,
                      top: `${albumCover.y}%`,
                      scale: 1,
                    }}
                    transition={{
                      type: "tween",
                      ease: "linear",
                      duration: 0.05,
                    }}
                    style={{
                      width: `${albumCover.size}px`,
                      height: `${albumCover.size}px`,
                      opacity: layerConfig.opacity,
                      filter: `blur(${layerConfig.blur}px)`,
                      zIndex: albumCover.parallaxLayer,
                    }}
                  />
                );
              })}
            </div>
            <div className={styles.contacts__backgroundBlur}></div>

            <div className={styles.contacts__content}>
              <h2 className={styles.contacts__content__header}>Контакты</h2>
              <p className={styles.contacts__content__losung}>
                Хочешь трек для игры?
                <br />
                Или ты работаешь над анимацией?
                <br />А может, просто хочешь поделиться мыслями?
              </p>
              <div style={{display: 'flex', flexDirection: 'column', gap: '50px', marginTop: '70px'}}>
              <p className={styles.contacts__content__buttonsInfo}>Вот, где мне можно написать:</p>
              <div className={styles.contacts__content__contactButtons}>
                <a
                  href="https://t.me/hoursen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contacts__content__contactButtons__button}
                >
                  <img src="/images/icons/socialbuttons/tg.svg" alt="Telegram" />
                  <p className="text">Telegram</p>
                </a>
                <a
                  href="mailto:mkxvk@yandex.ru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contacts__content__contactButtons__button}
                >
                  <img src="/images/icons/socialbuttons/email.svg" alt="E-mail" />
                  <p className="text">E-mail</p>
                </a>
                <a
                  href="https://vk.com/nikita_cherepov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contacts__content__contactButtons__button}
                >
                  <img src="/images/icons/socialbuttons/vk.svg" alt="VK" />
                  <p className="text">ВКонтакте</p>
                </a>
              </div>
                            </div>
                                          <div style={{display: 'flex', flexDirection: 'column', gap: '50px', marginTop: '70px'}}>
              <p>Мои соцсети:</p>
              <div className={styles.contacts__content__contactButtons}>
                <a
                  href="https://www.youtube.com/@nikitacherepov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contacts__content__contactButtons__button}
                >
                  <img src="/images/icons/socialbuttons/yt.svg" alt="Youtube" />
                  <p className="text">Youtube</p>
                </a>
                <a
                  href="https://t.me/+7JUAL4jfnTUzMjBi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contacts__content__contactButtons__button}
                >
                  <img src="/images/icons/socialbuttons/tg.svg" alt="Telegram" />
                  <p className="text">Telegram</p>
                </a>
                <a
                  href="https://vk.com/hitchhikersimagination"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contacts__content__contactButtons__button}
                >
                  <img src="/images/icons/socialbuttons/vk.svg" alt="VK" />
                  <p className="text">ВКонтакте</p>
                </a>
              </div>
              </div>

                <div className={styles.contacts__content__footer}>
                    © 2025 Nikita Cherepov | Music
                </div>
            </div>

          </div>
        </div>
      </>
    );
}