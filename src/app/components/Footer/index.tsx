import styles from './Footer.module.scss'
import Button from '../Cards/SiteCard/Button'
import {motion, AnimatePresence} from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function Header() {
    const pathname = usePathname();
    return (
        <motion.div layout={false} className={styles.container}>

            <div className={styles.links}>
                <p className={styles.links__header}>Контакты</p>
                <div className={styles.links__buttons}>
                    <Button size='small' icon={'/images/icons/email.svg'} text={'E-mail'}/>
                    <Button size='small' icon={'/images/icons/tg.svg'} text={'чат'}/>
                    <Button size='small' icon={'/images/icons/vk.svg'} text={'лс'}/>
                </div>
            </div>

            <div className={styles.name}>
                © 2025 Nikita Cherepov | {pathname === '/sites' ? "Сайты" : 'Музыка'}
            </div>

            <div className={styles.links}>
                <p className={styles.links__header}>Соцсети</p>
                <div className={styles.links__buttons}>
                    <Button size='small' icon={'/images/icons/yt.svg'} text={'канал'}/>
                    <Button size='small' icon={'/images/icons/tg.svg'} text={'канал'}/>
                    <Button size='small' icon={'/images/icons/vk.svg'} text={'группа'}/>
                </div>
            </div>

        </motion.div>
    )
}