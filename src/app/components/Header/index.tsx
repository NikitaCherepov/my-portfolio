'use client'

import styles from './Header.module.scss'
import Menu from '../Menu'
import Switcher from '../Switcher'
import SortingComponent from '../SortingComponent'
import { usePathname } from 'next/navigation'
import { useViewStore } from '@/app/store/useExitStore'
import {AnimatePresence} from 'framer-motion'
import { useState } from 'react'


export default function Header() {
    const pathname = usePathname();
    const {view} = useViewStore();

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
        <div className={`${styles.container} ${pathname === '/sites' ? styles.container_sites : styles.container_music}`}>
            <Menu/>
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
                        musicMenuOptions.map((object) => (
                            <div className={`${styles.container__musicMenu__option} ${object.chosen ? styles.container__musicMenu__option_chosen : styles.container__musicMenu__option_notChosen}`}>
                                {object.name}
                            </div>
                        ))
                    }
                </div>
            )}
        </div>
    )
}