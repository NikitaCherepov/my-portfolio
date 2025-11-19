'use client'

import {useEffect, useRef, useState} from 'react'
import styles from './Menu.module.scss'
import Image from 'next/image'

import {motion, useCycle} from 'framer-motion'

import {usePathname} from 'next/navigation'

import { useDimensions } from '@/app/hooks/useDimensions'

import { useInitiateExit } from '@/app/hooks/useInitiateExit'

export default function Menu() {
    const [isOpen, toggleOpen] = useCycle(false, true);
    const containerRef = useRef(null);
    const {height} = useDimensions(containerRef);

    const initiateExit = useInitiateExit();

    const pathname = usePathname();


    const sidebarVariants = {
        open: (height = 1000) => ({
            // backgroundColor: 'var(--menu-slides-background)',
          clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
          transition: {
            type: "spring",
            stiffness: 20,
            restDelta: 2,
          },
        }),
        closed: {
            // backgroundColor: 'var(--menu-slides-background)',
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
            // backgroundColor: "var(--button-light)",
            boxShadow: "inset 4px 4px 4px rgba(0, 0, 0, 0.41)",
            transition: {
                type: "spring",
                stiffness: 20,
                restDelta: 2,
              },
        },
        closed: {
            // backgroundColor: "var(--button-dark)",
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

    const [backgroundFix, setBackgroundFix] = useState<String>();

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                if (!isOpen) setBackgroundFix('transparent');
            }, 400)
        }
        else {
            setBackgroundFix('var(--menu-slides-background)');
        }
    }, [isOpen, backgroundFix])

      



    return (
        <motion.nav
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{duration: 0.3}}
        ref={containerRef}
        custom={height}
        className={`${styles.container}`}>
            <motion.div className={`${styles.container__sidebar} dropShadow  ${pathname === '/music' ? styles.container__sidebar_music : ''}`} variants={sidebarVariants} style={{background: backgroundFix}}>
                <button onClick={() =>  initiateExit("/")} className={`${styles.container__sidebar__option} ${styles.container__sidebar__option_sites} ${pathname != '/' ? styles.container__sidebar__option_active : styles.container__sidebar__option_disactive}  ${pathname === '/music' ? styles.container__sidebar__option_music : ''}`}>
                    Главная
                </button>
                <button onClick={() => {if (pathname!= '/sites') {toggleOpen(); initiateExit('/sites')}}} className={`${styles.container__sidebar__option} ${styles.container__sidebar__option_sites} ${pathname != '/sites' ? styles.container__sidebar__option_active : styles.container__sidebar__option_disactive} ${pathname === '/music' ? styles.container__sidebar__option_music : ''}`}>
                    Сайты
                </button>
                <button onClick={() => {if (pathname !='/music') {toggleOpen(); initiateExit('/music')}}} className={`${styles.container__sidebar__option} ${styles.container__sidebar__option_music} ${pathname != '/music' ? styles.container__sidebar__option_active : styles.container__sidebar__option_disactive} ${pathname === '/music' ? styles.container__sidebar__option_music : ''}`}>
                    Музыка
                </button>
            </motion.div>
            <motion.button style={{background: pathname === '/sites' ? 'var(--button-dark)' : ''}} whileHover={!isOpen? "hoverOpen" : 'hoverClosed'} animate={isOpen ? "open" : "closed"} variants = {buttonVariants} transition={{duration: 0.3}} onClick={() => toggleOpen()} className={styles.container__navButton}>
                                {pathname === '/music' && (
                <Image className={styles.container__navButton__background} src={pathname === '/music' ? '/images/menu/menuPhoto.png' : pathname === '/sites' ? '/images/menu/code.svg' : ''} alt='Нота меню' width={100} height={100}/>
                                )}
                {pathname !== '/music' && (
                    <Image className={styles.container__navButton__image} src={pathname === '/music' ? '/images/menu/note.svg' : pathname === '/sites' ? '/images/menu/code.svg' : ''} alt='Нота меню' width={100} height={100}/>
                )}
            </motion.button>
        </motion.nav>
    )
}