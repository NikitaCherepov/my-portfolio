'use client'

import styles from './MusicPlayer.module.scss'
import { DndContext, useDraggable } from '@dnd-kit/core'
import {useState, useEffect, useRef} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import { usePlayerStateStore, usePlayerStore } from '@/app/store/useExitStore'
import { useHasHydrated } from '@/app/hooks/useHasHydrated'

interface DraggableProps {
  soundHovering: boolean;
  setSoundHovering: React.Dispatch<React.SetStateAction<boolean>>;
  hovering: boolean;
  setHovering: React.Dispatch<React.SetStateAction<boolean>>;
  position: { x: number; y: number };
  onDragging: boolean;
  show: boolean;
  setShow: () => void;
}

interface MobileMusicPlayerProps {
  soundHovering: boolean;
  setSoundHovering: React.Dispatch<React.SetStateAction<boolean>>;
  hovering: boolean;
  setHovering: React.Dispatch<React.SetStateAction<boolean>>;
  show: boolean;
  setShow: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

export default function MusicPlayer() {
    const [onDragging, setOnDragging] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [soundHovering, setSoundHovering] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isSwipeAnimating, setIsSwipeAnimating] = useState(false);
    const touchStartPos = useRef<{ x: number; y: number } | null>(null);

    const {position, setPosition, showPlayer, setShowPlayer, volume, setVolume} = usePlayerStore();
    const hasHydrated = useHasHydrated(usePlayerStore);
    const previousDesktopVolume = useRef<number | null>(null);
    const mobileVolumeForced = useRef(false);

    // Определение мобильных устройств и начальная настройка
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [window.innerWidth]);

    // Установка начального состояния для мобильных
    useEffect(() => {
        if (isMobile && hasHydrated) {
            const storedState = localStorage.getItem('player-settings');
            if (!storedState && showPlayer) {
                // Если мобильное устройство и нет сохраненного состояния, скрываем плеер
                setShowPlayer();
            }
        }
    }, [isMobile, hasHydrated, showPlayer, setShowPlayer]);

    useEffect(() => {
      if (!hasHydrated) return;

      if (isMobile) {
        if (previousDesktopVolume.current === null) {
          previousDesktopVolume.current = volume;
        }
        if (!mobileVolumeForced.current) {
          setVolume(0.5);
          mobileVolumeForced.current = true;
        }
      } else {
        mobileVolumeForced.current = false;
        if (previousDesktopVolume.current !== null && previousDesktopVolume.current !== volume) {
          setVolume(previousDesktopVolume.current);
        }
        previousDesktopVolume.current = null;
      }
    }, [isMobile, hasHydrated, setVolume, volume]);

    // Position validation only for desktop
    useEffect(() => {
      if (!isMobile) {
        if (position.x < 0) {
          setPosition({x: 0, y: position.y})
        }
        if ((position.x < +window.innerWidth + 100 && position.x > +window.innerWidth - 100) || position.x > window.innerWidth) {
          setPosition({x: +window.innerWidth - 500, y: position.y})
        }
        if (position.y > window.innerHeight/2 - 100) {
          setPosition({x: position.x, y: window.innerHeight/2 - 150})
        }
        else if (-position.y > window.innerHeight/2) {
          setPosition({x: position.x, y: -window.innerHeight/2})
        }
      }
    }, [position, setPosition, isMobile])

    // Обработчики свайпов для мобильных устройств
    const handleTouchStart = (e: React.TouchEvent) => {
      if (!isMobile) return;
      touchStartPos.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      if (!isMobile || !touchStartPos.current) return;
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - touchStartPos.current.y;

      // Показываем визуальную индикацию свайпа вниз
      if (deltaY > 30) {
        setIsSwipeAnimating(true);
      }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
      if (!isMobile || !touchStartPos.current) return;

      const endY = e.changedTouches[0].clientY;
      const deltaY = endY - touchStartPos.current.y;
      const threshold = 50; // Минимальное расстояние для свайпа

      if (deltaY > threshold) {
        // Свайп вниз - скрываем панель
        setShowPlayer();
      }

      // Сбрасываем состояние
      touchStartPos.current = null;
      setIsSwipeAnimating(false);
    };

    if (hasHydrated) {
      if (isMobile) {
        return (
          <MobileMusicPlayer
            show={showPlayer}
            setShow={setShowPlayer}
            soundHovering={soundHovering}
            setSoundHovering={setSoundHovering}
            hovering={hovering}
            setHovering={setHovering}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        );
      } else {
        return (
          <DndContext
            onDragStart={() => setOnDragging(true)}
            onDragEnd={(e) => {
                if (!e.delta) return;
                const newX = position.x + e.delta.x;
                const newY = position.y + e.delta.y;
                setPosition({x: newX, y: newY});
                setOnDragging(false);
            }}>
              <Draggable soundHovering={soundHovering} setSoundHovering={setSoundHovering} hovering={hovering} setHovering={setHovering} show={showPlayer} setShow={setShowPlayer} onDragging={onDragging} position={position}/>
          </DndContext>
        );
      }
    }
}

function MobileMusicPlayer({
  soundHovering,
  setSoundHovering,
  show,
  setShow,
  onTouchStart,
  onTouchMove,
  onTouchEnd
}: MobileMusicPlayerProps) {
  const { name, audio, duration, currentTime, isPlaying, play, pause } = usePlayerStateStore();
  const { volume, setVolume } = usePlayerStore();

  const [hoverTime, setHoverTime] = useState(0);
  const [onTimelineHovering, setOnTimelineHovering] = useState(false);
  const [cursorX, setCursorX] = useState(0);

  function playMusic() {
    if (duration === currentTime) {
      play();
    }
    else if (isPlaying) {
      pause();
    }
    else {
      play();
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`${styles.container} ${styles.container_mobile}`}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className={styles.container__mobileHeader}>
            <div className={`${styles.buttons} ${styles.buttons_mobile}`}>
              <img
                alt='Скрыть'
                onClick={() => setShow()}
                className={`${styles.container__buttons__minimize} ${styles.buttons_mobile}`}
                src='/images/icons/MusicPlayer/minimize.svg'
              />
            </div>
          </div>

          <div className={styles.container__mobileContent}>
            <div className={styles.container__mobileTrackInfo}>
              <p className={styles.name}>{name || 'Не выбрано'}</p>
            </div>

            <div className={`${styles.container__musicControl} ${styles.musicControl_mobile}`}>
              <img
                alt='Управление состоянием проигрывателя'
                onClick={() => playMusic()}
                className={`${styles.container__musicControl__play} ${styles.musicControl_mobile}`}
                src={duration === currentTime ? '/images/icons/MusicPlayer/play.svg' : isPlaying ? '/images/icons/MusicPlayer/pause.svg' : '/images/icons/MusicPlayer/play.svg'}
              />

              <motion.div
                onMouseMove={(e) => {
                  const bar = e.currentTarget.getBoundingClientRect();
                  const position = e.clientX - bar.left;
                  const percent = (position / bar.width) * 100;
                  const finishTime = duration/100 * percent + 1;
                  setCursorX(position);
                  setHoverTime(finishTime);
                }}
                onHoverStart={() => setOnTimelineHovering(true)}
                onHoverEnd={() => setOnTimelineHovering(false)}
                onClick={(e) => {
                  const bar = e.currentTarget.getBoundingClientRect();
                  const position = e.clientX - bar.left;
                  const percent = (position / bar.width);
                  if (audio) audio.currentTime = percent * audio.duration;
                }}
                className={`${styles.container__musicControl__timeline} ${styles.musicControl_mobile}`}
              >
                <AnimatePresence>
                  {onTimelineHovering && (
                    <div style={{left: cursorX - 20 || 0}} className={styles.container__musicControl__timeline__currentTime}>
                      <div className={styles.container__musicControl__timeline__currentTime__wrapper}>
                        <img alt='background' src='/images/icons/MusicPlayer/currentTime.svg'></img>
                        <p>{hoverTime?.toFixed(0)}</p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>

                <p className={styles.container__musicControl__timeline__start}>1</p>
                <div style={{width: `${(currentTime / duration) * 100 || 0}%`}} className={styles.container__musicControl__timeline__progress}></div>
                <p className={styles.container__musicControl__timeline__end}>{duration?.toFixed(0)}</p>
              </motion.div>

              <motion.div onHoverStart={() => setSoundHovering(true)} onHoverEnd={() => setSoundHovering(false)} className={`${styles.sound} ${styles.sound_mobile}`}>
                <img alt='Регулировка звука' src={'/images/icons/MusicPlayer/sound.svg'} />
                <AnimatePresence>
                  {soundHovering ? (
                    <motion.div initial={{opacity: 0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration: 0.2}} className={styles.sound__edit}>
                      <input type="range" min="0" max="0.2" step="0.01" value={volume || 0.5} onChange={(e) => setVolume(+e.target.value)}/>
                    </motion.div>
                  ) : ''}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Draggable({soundHovering, setSoundHovering, hovering, setHovering, position, onDragging, show, setShow}: DraggableProps) {
  const {name, audio, duration, currentTime, isPlaying, play, pause } = usePlayerStateStore();
  const {volume, setVolume} = usePlayerStore();

  const [hoverTime, setHoverTime] = useState(0);
  const [onTimelineHovering, setOnTimelineHovering] = useState(false);
  const [cursorX, setCursorX] = useState(0);

  const [closing, setClosing] = useState(false);

  function playMusic() {
    if (duration === currentTime) {
      play();
    }
    else if (isPlaying) {
      pause();
    }
    else {
      play();
    }
  }

    const {attributes, listeners, setNodeRef, transform} = useDraggable({
      id: 'draggable',
    });
    const style = transform ? {
        transform: `translate3d(${position.x+ transform.x}px, ${position.y + transform.y}px, 0)`,
      } : {transform: `translate3d(${position.x}px, ${position.y}px, 0)`};
  
    
    return (
        <motion.div
        animate={show ? {minWidth: '250px', maxWidth: '500px', maxHeight:'160px'} : !hovering ? {minWidth: '40px', maxWidth: '40px', maxHeight:'40px'} : closing ? {minWidth: '40px', maxWidth: '40px', maxHeight:'40px'} : {minWidth: '150px', maxWidth: '150px', maxHeight:'50px'}}
        transition={{type:'spring', duration: 0.5}}
        onHoverStart={() => {if (!closing) {setHovering(true)}} }
        onHoverEnd={() => {if (!closing) {setHovering(false)}}}
        
        ref={setNodeRef} style={style}  className={`${styles.container} dropShadow ${onDragging ? 'hoverEffect' : ''}`}>
          <div className={styles.container__buttons}>
            <img alt='Нажмите, чтобы тянуть' style={{cursor: onDragging ? 'grabbing' : 'grab'}} {...listeners} {...attributes} className={styles.container__buttons__move} src='/images/icons/MusicPlayer/move.svg'></img>
            {<AnimatePresence>
              {
                show || (!show && hovering) ? (
                  <motion.img alt='Показать/спрятать' initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.3}} onClick={() => {
                    
                    setClosing(true);
                    setShow();
                    setHovering(false);
                    setTimeout(() => {setClosing(false)}, 500)
                  }} className={`${styles.container__buttons__minimize}`} src={show ? '/images/icons/MusicPlayer/minimize.svg' : '/images/icons/MusicPlayer/maximize.svg'}></motion.img>
                ) : ''
              }

            </AnimatePresence>}
          </div>
            
          <p className={`${styles.container__name}`}>{name || 'Не выбрано'}</p>

          <div className={styles.container__musicControl}>
            <img alt='Управление состоянием проигрывателя' onClick={() => playMusic()} className={styles.container__musicControl__play} src={duration === currentTime ? '/images/icons/MusicPlayer/play.svg' : isPlaying ? '/images/icons/MusicPlayer/pause.svg' : '/images/icons/MusicPlayer/play.svg'}/>

            <motion.div onMouseMove={(e) => {
              
              const bar = e.currentTarget.getBoundingClientRect();
              const position = e.clientX - bar.left;
              const percent = (position / bar.width) * 100;
              const finishTime = duration/100 * percent + 1;
              console.log((duration/100 * percent + 1) || 0);
              setCursorX(position);
              setHoverTime(finishTime);
            }} 
            onHoverStart={() => setOnTimelineHovering(true)}
            onHoverEnd={() => setOnTimelineHovering(false)}
            onClick={(e) => {
              const bar = e.currentTarget.getBoundingClientRect();
              const position = e.clientX - bar.left;
              const percent = (position / bar.width);
              if (audio) audio.currentTime = percent * audio.duration;
          }}
              
              className={styles.container__musicControl__timeline}>

                <AnimatePresence>
                  {onTimelineHovering && (
                  <div style={{left: cursorX - 20 || 0}} className={styles.container__musicControl__timeline__currentTime}>
                    <div className={styles.container__musicControl__timeline__currentTime__wrapper}>
                                      <img alt='background' src='/images/icons/MusicPlayer/currentTime.svg'></img>
                                      <p>{hoverTime?.toFixed(0)}</p>
                    </div>
                  </div>
                  )}
                </AnimatePresence>

              <p className={styles.container__musicControl__timeline__start}>
                1
              </p>
              <div style={{width: `${(currentTime / duration) * 100 || 0}%`}} className={styles.container__musicControl__timeline__progress}>

              </div>
              <p className={styles.container__musicControl__timeline__end}>
                {duration?.toFixed(0)}
              </p>
            </motion.div>

            <motion.div onHoverStart={() => setSoundHovering(true)} onHoverEnd={() => setSoundHovering(false)} className={styles.sound}>
                <img alt='Регулировка звука' src={'/images/icons/MusicPlayer/sound.svg'} />
                <AnimatePresence>
                    {soundHovering ? (
                        <motion.div initial={{opacity: 0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration: 0.2}} className={styles.sound__edit}>
                            <input type="range" min="0" max="0.2" step="0.01" value={volume || 0.5} onChange={(e) => setVolume(+e.target.value)}/>
                        </motion.div>
                    ) : ''}

                </AnimatePresence>
            </motion.div>

          </div>
        </motion.div>
    );
  }