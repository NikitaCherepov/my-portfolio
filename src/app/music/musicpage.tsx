'use client'
import styles from './music.module.scss'
import { useMusic } from "../hooks/useMusic"
import { usePathname } from "next/navigation"
import { useViewStore } from "../store/useExitStore"
import { useSortSitesStore } from "../store/useExitStore"
import {motion} from 'framer-motion'
import { usePagination } from "../store/useExitStore"
import {useState, useEffect} from 'react'
import MusicCard from "../components/Cards/MusicCard"
import Button from "../components/Cards/SiteCard/Button"
import SortingComponentForList from "../components/SortingComponentForList"
import PlayerWatcher from "../components/PlayerWatcher"
import MusicPlayer from "../components/MusicPlayer"
import { Music } from '../services/musicService'
import Image from 'next/image'


export default function MusicPage() {

    const {music, loading} = useMusic();

    const notes = [
        '/images/icons/notes/1.svg',
        '/images/icons/notes/2.svg',
        '/images/icons/notes/3.svg',
        '/images/icons/notes/4.svg',
    ]

    const [randomNotes, setRandomNotes] = useState<string[]>([]);

    useEffect(() => {
        const generateRandomNotes = () => {
            const selectedNotes: string[] = [];
            for (let i = 0; i < 20; i++) {
                const randomIndex = Math.floor(Math.random() * notes.length);
                selectedNotes.push(notes[randomIndex]);
            }
            setRandomNotes(selectedNotes);
        };

        generateRandomNotes();
    }, []);

    // Показываем loader во время загрузки
    if (loading) {
        return (
            <div className={styles.loading}>
                <img src='/images/loaders/loader.svg' alt="Загрузка" />
                <p>Загрузка музыки...</p>
            </div>
        );
    }

    return (
        <>

        <PlayerWatcher/>
        <MusicPlayer/>
        <motion.div transition={{type: 'tween', stiffness: 150, damping: 20, duration: 0.3}} layout className={`mainContainer  ${styles.container}`}>
            <div className={styles.head}>
                <Image priority className={styles.head__logo} src='/images/logo.png' alt='Нота меню' width={450} height={400}/>
                <p className={styles.head__motto}>Пишу музыку для игр и для себя. <br/>Хочешь трек? Напиши мне</p>

                <div className={styles.head__background}>
                    {randomNotes.map((note, i) => {
                        // Создаем глубину для каждой ноты
                        const parallaxFactor = 0.3 + Math.random() * 0.7; // от 0.3 до 1.0

                        return (

<motion.div
  key={i}
  className={styles.head__background__note}
  initial={{ opacity: 0 }}
animate={{
  x: [-10 * parallaxFactor, 10 * parallaxFactor],
  y: [-20 * parallaxFactor, 20 * parallaxFactor],
  opacity: [0, 1, 0],
}}
transition={{
  x: { duration: 6 / parallaxFactor, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
  y: { duration: 8 / parallaxFactor, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
  opacity: {
    duration: 8 + Math.random() * 12,  // у каждой ноты свой цикл
    repeat: Infinity,
    repeatType: 'loop',
    ease: 'linear',
    repeatDelay: Math.random() * 5,    // и своя пауза
  },
}}

  style={{
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    scale: 0.2 + parallaxFactor * 0.9, // больше разница в размерах
    opacity: 0.4 + parallaxFactor * 0.4 // дальние тусклее
  }}
>
  <img src={note} alt={`Note ${i + 1}`} />
</motion.div>
                        )
                    })}
                </div>
            </div>
          
                        
        </motion.div>     
        </>
    )
}