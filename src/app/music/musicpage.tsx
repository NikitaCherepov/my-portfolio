'use client'
import styles from './music.module.scss'
import { useMusic } from "../hooks/useMusic"
import { usePathname } from "next/navigation"
import { useViewStore } from "../store/useExitStore"
import { useSortSitesStore } from "../store/useExitStore"
import {motion} from 'framer-motion'
import { usePagination } from "../store/useExitStore"
import {useState, useEffect, useRef} from 'react'
import MusicCard from "../components/Cards/MusicCard"
import Button from "../components/Cards/SiteCard/Button"
import SortingComponentForList from "../components/SortingComponentForList"
import PlayerWatcher from "../components/PlayerWatcher"
import MusicPlayer from "../components/MusicPlayer"
import { Music } from '../services/musicService'
import Image from 'next/image'


export default function MusicPage() {

    const {music, loading} = useMusic();

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
            </div>
          
                        
        </motion.div>     
        </>
    )
}