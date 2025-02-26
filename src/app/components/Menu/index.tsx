'use client'

import {useState, useEffect, useRef} from 'react'
import styles from './Menu.module.scss'
import Image from 'next/image'

import {motion, AnimatePresence, useCycle} from 'framer-motion'

import {usePathname, useRouter} from 'next/navigation'

import { useDimensions } from '@/app/hooks/useDimensions'
import {useExitStore} from '../../store/useExitStore'

export default function Menu() {
    const [isOpen, toggleOpen] = useCycle(false, true);
    const containerRef = useRef(null);
    const {height} = useDimensions(containerRef);

    const {handleExit, turnOnAnimating, turnOffAnimating} = useExitStore();

    const router = useRouter();
    const pathname = usePathname();

    const handleAnimationExit = (path: string, rout:any, address:string) => {
        toggleOpen();
        handleExit(path, rout, address);
        console.log('Включил')
    }


    const sidebarVariants = {
        open: (height = 1000) => ({
          clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
          transition: {
            type: "spring",
            stiffness: 20,
            restDelta: 2,
          },
        }),
        closed: {
          clipPath: "circle(50px at 66px 50px)",
          transition: {
            delay: 0,
            type: "spring",
            stiffness: 400,
            damping: 40,
          },
        },
    };
    const buttonVariants = {
        open: {
            backgroundColor: "var(--button-light)",
            boxShadow: "inset 4px 4px 4px rgba(0, 0, 0, 0.41)",
            transition: {
                type: "spring",
                stiffness: 20,
                restDelta: 2,
              },
        },
        closed: {
            backgroundColor: "var(--button-dark)",
            boxShadow: "none",
            transition: {
                delay: 0,
                type: "spring",
                stiffness: 400,
                damping: 40,
              },
        },
        hoverOpen: {
            boxShadow: "inset 4px 4px 4px rgba(0, 0, 0, 0.41)",
        },
        hoverClosed: {
            boxShadow: "none",
        }
    }

      



    return (
        <motion.nav
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{duration: 0.3}}
        ref={containerRef}
        custom={height}
        className={styles.container}>
            <motion.div className={`${styles.container__sidebar} dropShadow`} variants={sidebarVariants}>
                <button onClick={() => {if (pathname!= '/sites') {handleAnimationExit(pathname, router, "/sites")}}} className={`${styles.container__sidebar__option} ${styles.container__sidebar__option_sites} ${pathname != '/sites' ? styles.container__sidebar__option_active : styles.container__sidebar__option_disactive}`}>
                    Сайты
                </button>
                <button onClick={() => {if (pathname !='/music') {handleAnimationExit(pathname, router, "/music")}}} className={`${styles.container__sidebar__option} ${styles.container__sidebar__option_music} ${pathname != '/music' ? styles.container__sidebar__option_active : styles.container__sidebar__option_disactive}`}>
                    Музыка
                </button>
            </motion.div>
            <motion.button whileHover={!isOpen? "hoverOpen" : 'hoverClosed'} animate={isOpen ? "open" : "closed"} variants = {buttonVariants} transition={{duration: 0.3}} onClick={() => toggleOpen()} className={styles.container__navButton}>
                <Image className={styles.container__navButton__image} src={pathname === '/music' ? '/images/menu/note.svg' : pathname === '/sites' ? '/images/menu/code.svg' : ''} alt='Нота меню' width={100} height={100}/>
            </motion.button>
        </motion.nav>
    )
}