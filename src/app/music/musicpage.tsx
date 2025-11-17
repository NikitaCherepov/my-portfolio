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

    const volume = 0.1;

    const notes = [
        '/images/icons/notes/1.svg',
        '/images/icons/notes/2.svg',
        '/images/icons/notes/3.svg',
        '/images/icons/notes/4.svg',
    ]

    const soundFiles = [
        '/sounds/do.mp3',
    ];

    type NoteConfig = {
        src: string;
        left: number; // %
        top: number;  // %
        parallaxFactor: number;
        soundSrc: string;
    };

    const [notesConfig, setNotesConfig] = useState<NoteConfig[]>([]);

    useEffect(() => {
        const NOTE_COUNT = 20;
        const LEFT_MIN = 0;
        const LEFT_MAX = 100;
        const TOP_MIN = 0;
        const TOP_MAX = 90; // чтобы "bottom ~10%" оставался
        const MIN_DIST = 25;  // минимальное расстояние в процентах
        const MAX_DIST = 90; // максимальное расстояние до "соседа"
        const MAX_ATTEMPTS = 25;

        const randomInRange = (min: number, max: number) =>
            min + Math.random() * (max - min);

        const generated: NoteConfig[] = [];
        let soundIndex = 0;

        for (let i = 0; i < NOTE_COUNT; i++) {
            const src = notes[Math.floor(Math.random() * notes.length)];
            const parallaxFactor = 0.3 + Math.random() * 0.7;

            let left: number = randomInRange(LEFT_MIN, LEFT_MAX);
            let top: number = randomInRange(TOP_MIN, TOP_MAX);

            if (generated.length > 0) {
                let placed = false;

                for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
                    const anchor =
                        generated[Math.floor(Math.random() * generated.length)];

                    const angle = Math.random() * Math.PI * 2;
                    const dist = MIN_DIST + Math.random() * (MAX_DIST - MIN_DIST);

                    const candidateLeft = anchor.left + Math.cos(angle) * dist;
                    const candidateTop = anchor.top + Math.sin(angle) * dist;

                    if (
                        candidateLeft < LEFT_MIN ||
                        candidateLeft > LEFT_MAX ||
                        candidateTop < TOP_MIN ||
                        candidateTop > TOP_MAX
                    ) {
                        continue; // вылезли за right/bottom/top/left
                    }

                    left = candidateLeft;
                    top = candidateTop;
                    placed = true;
                    break;
                }

                if (!placed) {
                    // "если такой точки нет — то как получится"
                    left = randomInRange(LEFT_MIN, LEFT_MAX);
                    top = randomInRange(TOP_MIN, TOP_MAX);
                }
            }

            const soundSrc = soundFiles[soundIndex];
            soundIndex = (soundIndex + 1) % soundFiles.length;

            generated.push({ src, left, top, parallaxFactor, soundSrc });
        }

        setNotesConfig(generated);
    }, []);

    const handleNoteClick = (soundSrc: string) => {
        const audio = new Audio(soundSrc);
        audio.volume = volume;
        audio.play().catch(() => {});
    };

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
                                x: { duration: 6 / note.parallaxFactor, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
                                y: { duration: 8 / note.parallaxFactor, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
                                opacity: {
                                    duration: 8 + Math.random() * 12,
                                    repeat: Infinity,
                                    repeatType: 'loop',
                                    ease: 'linear',
                                    repeatDelay: Math.random() * 5,
                                },
                            }}
                            style={{
                                left: `${note.left}%`,
                                top: `${note.top}%`,
                                scale: 0.2 + note.parallaxFactor * 0.9,
                                opacity: 0.4 + note.parallaxFactor * 0.4
                            }}
                        >
                            <img src={note.src} alt={`Note ${i + 1}`} />
                        </motion.div>
                    ))}
                </div>
            </div>
            <div className={styles.musicHeader}>
                <h2>Музыка</h2>
            </div>
          
                        
        </motion.div>     
        </>
    )
}