'use client'

import styles from './MusicPlayer.module.scss'
import { DndContext, useDraggable } from '@dnd-kit/core'
import {useState, useEffect} from 'react'
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

export default function MusicPlayer() {
    const [onDragging, setOnDragging] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [soundHovering, setSoundHovering] = useState(false);

    const {position, setPosition, showPlayer, setShowPlayer} = usePlayerStore();
    const hasHydrated = useHasHydrated(usePlayerStore);

    useEffect(() => {
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
      console.log(position.y)
      console.log(window.innerHeight)
    }, [position, setPosition])

    if (hasHydrated) return (
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
    )
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
            <img alt='Нажмите, чтобы тянуть' style={{cursor: onDragging ? 'grabbing' : 'grab'}} {...listeners} {...attributes} className={styles.container__buttons__move} src='/images/icons/move.png'></img>
            {<AnimatePresence>
              {
                show || (!show && hovering) ? (
                  <motion.img alt='Показать/спрятать' initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.3}} onClick={() => {
                    
                    setClosing(true);
                    setShow();
                    setHovering(false);
                    setTimeout(() => {setClosing(false)}, 500)
                  }} className={`${styles.container__buttons__minimize}`} src={show ? '/images/icons/minimize.png' : '/images/icons/maximize.png'}></motion.img>
                ) : ''
              }

            </AnimatePresence>}
          </div>
            
          <p className={`${styles.container__name}`}>{name || 'Не выбрано'}</p>

          <div className={styles.container__musicControl}>
            <img alt='Управление состоянием проигрывателя' onClick={() => playMusic()} className={styles.container__musicControl__play} src={duration === currentTime ? '/images/icons/play.png' : isPlaying ? '/images/icons/pause.png' : '/images/icons/play.png'}/>

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
                                      <img alt='background' src='/images/icons/currentTime.svg'></img>
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
                <img alt='Регулировка звука' src={'/images/icons/sound.svg'} />
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