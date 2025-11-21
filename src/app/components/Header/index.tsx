'use client'

import styles from './Header.module.scss'
import Menu from '../Menu'
import Switcher from '../Switcher'
import SortingComponent from '../SortingComponent'
import { usePathname } from 'next/navigation'
import { useViewStore } from '@/app/store/useExitStore'
import {AnimatePresence, motion, useCycle} from 'framer-motion'
import { useState, useEffect } from 'react'


export default function Header() {
    const pathname = usePathname();
    const {view} = useViewStore();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMenuOpen, toggleMenuOpen] = useCycle(false, true);
    const [showBackdrop, setShowBackdrop] = useState(false);

    // Управление подложкой для backdrop-filter
    useEffect(() => {
        if (pathname !== '/music') {
            setShowBackdrop(false);
            return;
        }

        if (isMenuOpen) {
            // Показываем подложку с задержкой после начала открытия меню
            const timer = setTimeout(() => {
                if (isMenuOpen) setShowBackdrop(true);
            }, 250); // Задержка 150мс
            return () => clearTimeout(timer);
        } else {
            // Скрываем подложку мгновенно при закрытии
            setShowBackdrop(false);
        }
    }, [isMenuOpen, pathname]);

    // Отслеживание скролла только для страницы music
    useEffect(() => {
        if (pathname !== '/music') return;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Показываем хедер при скролле вверх или если находимся вверху страницы
            if (currentScrollY < lastScrollY || currentScrollY < 100) {
                setIsVisible(true);
            }
            // Скрываем хедер при скролле вниз
            else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY, pathname]);

    const handleScroll = (address: string) => {
        if (pathname !== '/music') return;

        let elementId: string;
        switch(address) {
            case '/music':
                elementId = 'music';
                break;
            case '/contacts':
                elementId = 'contacts';
                break;
            default:
                elementId = 'head';
        }

        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const musicMenuOptions = [
        {
            name: 'Главная',
            address: '/',
            chosen: true
        },
        {
            name: 'Моя музыка',
            address: '/music'
        },
        // {
        //     name: 'Обо мне',
        //     address: '/about'
        // },
        {
            name: 'Контакты',
            address: '/contacts'
        },
    ];

    return (
        <motion.div
            className={`${styles.container} ${pathname === '/sites' ? styles.container_sites : styles.container_music}`}
            initial={{ y: 0 }}
            animate={{
                y: pathname === '/music' ? (isVisible ? 0 : '-100%') : 0
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.3
            }}
        >
            <Menu isOpen={isMenuOpen} toggleOpen={toggleMenuOpen}/>
            {/* Блок-подложка для backdrop-filter на music странице */}
            <AnimatePresence>
                {pathname === '/music' && showBackdrop && (
                    <motion.div
                        className={styles.container__menuBackdrop}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    />
                )}
            </AnimatePresence>
            {pathname === '/sites' && (
                <div className={styles.container__switcher}>
                    <Switcher/>
                </div>
            )}
            {pathname === '/sites' && (
                <div className={styles.container__logoNSort}>
                    {/* <p className={styles.container__logoNSort__name}>ncherepov.com</p> */}
                    <AnimatePresence>
                    {view ==='grid' && <SortingComponent/>}
                    </AnimatePresence>

                </div>
            )}
            {pathname === '/music' && (
                <div className={styles.container__musicMenu}>
                    {
                        musicMenuOptions.map((object, index) => (
                            <div
                                key={`music-menu-header ${index}`}
                                className={`${styles.container__musicMenu__option} ${object.chosen ? styles.container__musicMenu__option_chosen : styles.container__musicMenu__option_notChosen}`}
                                onClick={() => handleScroll(object.address)}
                                style={{ cursor: 'pointer' }}
                            >
                                {object.name}
                            </div>
                        ))
                    }
                </div>
            )}
        </motion.div>
    )
}