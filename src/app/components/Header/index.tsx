'use client'

import styles from './Header.module.scss'
import Menu from '../Menu'
import Switcher from '../Switcher'
import SortingComponent from '../SortingComponent'
import { usePathname } from 'next/navigation'


export default function Header() {
    const pathname = usePathname();

    return (
        <div className={`${styles.container} ${pathname === '/sites' ? styles.container_sites : styles.container_music}`}>
            <Menu/>
            <Switcher/>
            <div className={styles.container__logoNSort}>
                <p className={styles.container__logoNSort__name}>ncherepov.com</p>
                <SortingComponent/>
            </div>
        </div>
    )
}