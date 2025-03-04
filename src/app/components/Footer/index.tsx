import styles from './Footer.module.scss'
import Button from '../Cards/SiteCard/Button'
import {motion} from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function Header() {
    const pathname = usePathname();
    return (
        <motion.div layout={false} className={styles.container}>

            <div className={styles.links}>
                <p className={styles.links__header}>Контакты</p>
                <div className={styles.links__buttons}>
                    <Button link='mailto:mkxvk@yandex.ru' size='small' icon={'/images/icons/email.svg'} text={'E-mail'}/>
                    <Button link={'https://t.me/hoursen'} size='small' icon={'/images/icons/tg.svg'} text={'чат'}/>
                    <Button link='https://vk.com/nikita_cherepov' size='small' icon={'/images/icons/vk.svg'} text={'лс'}/>
                </div>
            </div>

            <div className={styles.name}>
                © 2025 Nikita Cherepov | {pathname === '/sites' ? "Сайты" : 'Музыка'}
            </div>

            <div className={styles.links}>
                <p className={styles.links__header}>Соцсети</p>
                <div className={styles.links__buttons}>
                    <Button link='https://www.youtube.com/@nikitacherepov' size='small' icon={'/images/icons/yt.svg'} text={'канал'}/>
                    <Button link='https://t.me/+7JUAL4jfnTUzMjBi' size='small' icon={'/images/icons/tg.svg'} text={'канал'}/>
                    <Button link='https://vk.com/hitchhikersimagination' size='small' icon={'/images/icons/vk.svg'} text={'группа'}/>
                </div>
            </div>

        </motion.div>
    )
}