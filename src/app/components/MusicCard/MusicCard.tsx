'use client'
import styles from './MusicCard.module.scss'
import { useState, useEffect } from "react"
import { Music } from '@/app/services/musicService'
import {Genre} from '@/app/services/genresService'

interface MusicCardProps {
    music: Music[];
    genre: Genre;
    index: number;
}

export default function MusicCard({music, genre, index} : MusicCardProps) {
    const [currentMusicCard, setCurrenMusicCard] = useState<Music>();
    useEffect(() => {
        setCurrenMusicCard(music[0])
    }, [])
    return (
        <div className={styles.container}>
            <img src={currentMusicCard?.mainImage} className={styles.container__backgroundImage}/>
            <div className={styles.container__backgroundDark}></div>

            <div className={`${styles.container__head} ${index % 2 === 1 ? styles.rightish : styles.leftish}`}>
                <div className={styles.container__head__albumContainer}>
                    <img src={currentMusicCard?.mainImage} className={styles.container__head__albumContainer__cover}/>
                    <div className={styles.container__head__albumContainer__links}>
                        <img src='/images/icons/musiccard/spotify_bw.svg' className={styles.container__head__albumContainer__links__link}/>
                        <img src='/images/icons/musiccard/ym_bw.svg' className={styles.container__head__albumContainer__links__link}/>
                        <img src='/images/icons/musiccard/yt_bw.svg' className={styles.container__head__albumContainer__links__link}/>
                        <img src='/images/icons/musiccard/vkmusic_bw.svg' className={styles.container__head__albumContainer__links__link}/>
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
        </div>
    )
}