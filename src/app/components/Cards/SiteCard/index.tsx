'use client'
import {useState} from 'react'
import {useRouter} from 'next/navigation'
import styles from './SiteCard.module.scss'
import Button from './Button'
import { SiteWork, useViewStore } from '@/app/store/useExitStore'
import { format, parseISO, isValid } from 'date-fns'

import {AnimatePresence, motion} from 'framer-motion'

interface SiteCardProps {
    object : SiteWork,
    toggleModal: (id: string) => void
}

export default function SiteCard({object, toggleModal} : SiteCardProps) {
    const [hovering, setHovering] = useState(false);
    const {view} = useViewStore();
    const router = useRouter();

    const transitionSettings = { type: "spring", stiffness: 150, damping: 20, };
    const transitionHoverSettings = {duration: 0.2}

    const formatDisplayDate = (value: string) => {
        try {
            const date = parseISO(value);
            if (!isValid(date)) return value;
            return format(date, 'dd.MM.yyyy');
        } catch {
            return value;
        }
    }

    const handleNavigateToDetail = () => {
        router.push(`/sites/site?id=${object.id}`);
    }

    return (
        <motion.div
        className={`${styles.container} ${view === 'list' ? styles.container_list : styles.container_grid}`}
        key={object.name}
        layout
        transition={transitionSettings}
        >
                                <motion.button onClick={handleNavigateToDetail} className={`${styles.container__fullButton} ${view === 'grid' ? 'opacity-100' : 'opacity-0'}`} transition={transitionSettings} layout>
                                <motion.img transition={transitionSettings} layout src='/images/icons/square.svg'></motion.img>
                            </motion.button>

                
                <motion.div
                layout
                transition={transitionSettings}
                className={`${styles.container__mainInfo} ${view === 'list' ? styles.container__mainInfo_list : styles.container__mainInfo_grid}`}
                onHoverStart={() => setHovering(true)}
                onHoverEnd={() => setHovering(false)}
                onTap={() => setHovering((prev) => !prev)}
                >



                            <div className={`${styles.container__mainInfo__hoverMaterial} ${view === 'grid' ? styles.container__mainInfo__hoverMaterial_grid : styles.container__mainInfo__hoverMaterial_list}`}>
                                <AnimatePresence>
                                {!hovering && view === 'grid' ? 
                                    (
                                        <motion.div
                                        layout
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        exit={{opacity:0}}
                                        transition={transitionHoverSettings}
                                        key='mainContent'
                                        className={styles.container__mainInfo__hoverMaterial__mainImage}
                                        >
                                            <motion.img transition={transitionHoverSettings} layout className={styles.container__mainInfo__hoverMaterial__mainImage} src={object.mainImage} alt={object.name} width={100} height={100}/>
                                        </motion.div>
                                    )
                                    :
                                    hovering && view === 'grid' ?
                                    (
                                        <motion.div
                                        layout
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        exit={{opacity:0}}
                                        transition={transitionHoverSettings}
                                        key='hover'
                                        className={styles.container__mainInfo__hoverMaterial__hoveredButtons}
                                        style={object?.github === '' || object?.directLink === '' ? {justifyContent: 'flex-end', gap: '25px'} : undefined}
                                        >
                                            <Button onClick={handleNavigateToDetail} text={"Подробнее"}></Button>
                                            {object?.github != '' && (
                                                <Button link={object.github} icon={'/images/icons/github.svg'}  text={"GitHub"}></Button>
                                            )}
                                            {object?.directLink != '' && (
                                                <Button link={object.directLink} icon={'/images/icons/link.svg'}  text={"Перейти"}></Button>
                                            )}

                                        </motion.div>
                                    )
                                    :
                                    (
                                        <motion.div
                                        layout
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        exit={{opacity:0}}
                                        transition={transitionSettings}
                                        key='mainContent'
                                        className={`${styles.container__mainInfo__hoverMaterial__mainImage} ${styles.container__mainInfo__hoverMaterial__mainImage_list}`}
                                        >
                                            <motion.img transition={transitionSettings} layout className={styles.container__mainInfo__hoverMaterial__mainImage} src={object.mainImage} alt={object.name} width={100} height={100}/>
                                        </motion.div>
                                    )
                                }
                                </AnimatePresence>
                        </div>
                    

                    <motion.h2 transition={transitionSettings} layout className={`${styles.container__mainInfo__header} ${view === 'grid' ? styles.container__mainInfo__header_grid : styles.container__mainInfo__header_list}`}>{object.name}</motion.h2>


                </motion.div>

                {view === 'list' ? 
                    (
                        <div className={styles.container__mainContent}>
                            <div className={styles.container__mainContent__stack}>
                                {object?.stack?.join(", ")}
                            </div>
                            {object?.github != '' && (
                            <Button link={object.github} icon={'/images/icons/github.svg'}/>
                            )}
                            {object?.directLink != '' && (
                            <Button link={object.directLink} icon={'/images/icons/link.svg'}/>
                            )}
                            <Button onClick={handleNavigateToDetail} text={'Подробнее'}/>

                            <p className={styles.container__mainContent__date}>
                                {formatDisplayDate(object.date)}
                            </p>
                        </div>
                    )
                    :
                    (
                        ''
                    )}
        </motion.div>
    )
}
