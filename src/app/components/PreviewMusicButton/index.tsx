'use client'
import styles from './PreviewMusicButton.module.scss'
import { usePlayerStore } from '@/app/store/useExitStore'
import { usePlayerStateStore } from '@/app/store/useExitStore'
import { useState } from 'react'
import {motion, AnimatePresence} from 'framer-motion'

interface PreviewMusicButtonProps {
    src?: string,
    name?: string
}

export default function PreviewMusicButton({src, name}: PreviewMusicButtonProps) {
    const { audio, setAudio, currentTime, currentSrc, play, isPlaying, pause, duration, setDuration, setName } = usePlayerStateStore();
    const { volume, setVolume } = usePlayerStore();
    const [hovering, setHovering] = useState(false);


    const playMusic = () => {
        console.log(duration);
        console.log(currentTime);
        if (name) {
            setName(name);
        }
        if (currentSrc != src) {
            pause();
            setAudio(src);
            play();
            setDuration(audio?.duration);
        }
        else if (duration === currentTime) {
            play();
        }
        else if (!isPlaying) {
            play();
            console.log(1)
        }
        else if (isPlaying) {
            pause();
            console.log(20)
        }
    }


    return (
        <button className={styles.container}>
            <img
                alt='Управление музыкой'
                onClick={() => playMusic()} 
                src={currentSrc != src ? '/images/icons/play.png' : !isPlaying || audio?.ended ? '/images/icons/play.png' : '/images/icons/pause.png'} 
            />
            <p>{currentSrc != src ? 'Preview' : currentSrc === src ? currentTime.toFixed(0) : 0}</p>
            <motion.div onHoverStart={() => setHovering(true)} onHoverEnd={() => setHovering(false)} className={styles.sound}>
                <img alt='Настройка громкости' src={'/images/icons/sound.svg'} />
                <AnimatePresence>
                    {hovering ? (
                        <motion.div initial={{opacity: 0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration: 0.2}} className={styles.sound__edit}>
                            <input type="range" min="0" max="0.2" step="0.01" value={volume || 0.5} onChange={(e) => setVolume(+e.target.value)}/>
                        </motion.div>
                    ) : ''}

                </AnimatePresence>
            </motion.div>

        </button>
    );
}
