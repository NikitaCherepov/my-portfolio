'use client'
import {useState} from 'react'
import styles from './SiteCard.module.scss'
import Image from 'next/image'
import Button from './Button'
import { useViewStore } from '@/app/store/useExitStore'

import {AnimatePresence, hover, motion} from 'framer-motion'

export default function SiteCard({object, toggleModal} : any) {
    const [hovering, setHovering] = useState(false);
    const {view} = useViewStore();

    const MotionImage = motion(Image);

    const transitionSettings = { type: "spring", stiffness: 150, damping: 20 };

    return (
        <motion.div
        className={`${styles.container} ${view === 'list' ? styles.container_list : styles.container_grid}`}
        key={object.name}
        layout
        transition={transitionSettings}
        >
                <motion.button onClick={() => toggleModal(object.id)} className={`${styles.container__fullButton} ${view === 'grid' ? 'opacity-100' : 'opacity-0'}`} transition={transitionSettings} layout>
                    <motion.img transition={transitionSettings} layout src='/images/icons/square.svg'></motion.img>
                </motion.button>
                
                <motion.div
                layout
                transition={transitionSettings}
                className={`${styles.container__mainInfo} ${view === 'list' ? styles.container__mainInfo_list : styles.container__mainInfo_grid}`}
                onHoverStart={() => setHovering(true)}
                onHoverEnd={() => setHovering(false)}
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
                                        transition={transitionSettings}
                                        key='mainContent'
                                        className={styles.container__mainInfo__hoverMaterial__mainImage}
                                        >
                                            <motion.img transition={transitionSettings} layout className={styles.container__mainInfo__hoverMaterial__mainImage} src={object.mainImage} alt={object.name} width={100} height={100}/>
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
                                        transition={transitionSettings}
                                        key='hover'
                                        className={styles.container__mainInfo__hoverMaterial__hoveredButtons}
                                        >
                                            <Button onClick={() => toggleModal(object.id)} text={"Подробнее"}></Button>
                                            <Button icon={'/images/icons/github.svg'}  text={"GitHub"}></Button>
                                            <Button icon={'/images/icons/link.svg'}  text={"Перейти"}></Button>
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
                                {object.stack.join(", ")}
                            </div>
                            <Button icon={'/images/icons/github.svg'}/>
                            <Button icon={'/images/icons/link.svg'}/>
                            <Button text={'Подробнее'}/>

                            <p className={styles.container__mainContent__date}>
                                {object.date}
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