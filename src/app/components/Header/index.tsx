'use client'

import styles from './Header.module.scss'
import Menu from '../Menu'
import Switcher from '../Switcher'
import SortingComponent from '../SortingComponent'
import { usePathname } from 'next/navigation'
import { useViewStore } from '@/app/store/useExitStore'
import {AnimatePresence} from 'framer-motion'


export default function Header() {
    const pathname = usePathname();
    const {view} = useViewStore();

    return (
        <div className={`${styles.container} ${pathname === '/sites' ? styles.container_sites : styles.container_music}`}>
            <Menu/>
            <div className={styles.container__switcher}>
                <Switcher/>
            </div>
            <div className={styles.container__logoNSort}>
                {/* <p className={styles.container__logoNSort__name}>ncherepov.com</p> */}
                <AnimatePresence>
                {view ==='grid' && <SortingComponent/>}
                </AnimatePresence>

            </div>
        </div>
    )
}