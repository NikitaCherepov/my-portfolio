'use client'
import {useState} from 'react'
import styles from './MusicCard.module.scss'
import Button from '../SiteCard/Button'
import { useViewStore } from '@/app/store/useExitStore'
import PreviewMusicButton from '../../PreviewMusicButton'
import { MusicWork } from '@/app/store/useExitStore'

interface MusicCardProps {
    object: MusicWork;
}

import {AnimatePresence, motion} from 'framer-motion'

export default function MusicCard({object} : MusicCardProps) {
    const [hovering, setHovering] = useState(false);
    const {view} = useViewStore();

    const transitionSettings = { type: "spring", stiffness: 150, damping: 20, };
    const transitionHoverSettings = {duration: 0.2}

    return (
        <motion.div
        className={`${styles.container} ${view === 'list' ? styles.container_list : styles.container_grid}`}
        key={object.id}
        layout
        transition={transitionSettings}
        >       
                <motion.div
                layout
                key={object.id}
                transition={transitionSettings}
                className={`${styles.container__mainInfo} ${view === 'list' ? styles.container__mainInfo_list : styles.container__mainInfo_grid}`}
                onHoverStart={() => setHovering(true)}
                onHoverEnd={() => setHovering(false)}
                >



                            <motion.div key={object.id} layout className={`${styles.container__mainInfo__hoverMaterial} ${view === 'grid' ? styles.container__mainInfo__hoverMaterial_grid : styles.container__mainInfo__hoverMaterial_list}`}>
                                        <motion.div
                                        layout
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        exit={{opacity:0}}
                                        transition={transitionHoverSettings}
                                        key={object.id}
                                        className={`${styles.container__mainInfo__hoverMaterial__mainImage} ${view === 'list' ? styles.container__mainInfo__hoverMaterial__mainImage_list : ''}`}
                                        >
                                            <motion.img transition={transitionHoverSettings} layout className={styles.container__mainInfo__hoverMaterial__mainImage} src={object.mainImage} alt={object.name} width={100} height={100}/>
                                            <AnimatePresence>
                                                {hovering && view==='grid' ? ( 
                                                    (
                                                        <motion.div
                                                        layout
                                                        initial={{opacity: 0}}
                                                        animate={{opacity: 1}}
                                                        exit={{opacity:0}}
                                                        transition={transitionHoverSettings}
                                                        key='hover'
                                                        className={styles.container__mainInfo__hoverMaterial__hoveredButtons}
                                                        >
                                                            <h2>{object.name}</h2>
                                                            <p className={styles.container__mainInfo__hoverMaterial__hoveredButtons__genres}>{object?.genre?.join(", ")}</p>
                                                            <div className={styles.container__mainInfo__hoverMaterial__hoveredButtons__buttons}>
                                                                <Button link={object.youtube} icon={'/images/icons/yt.svg'}/>
                                                                <Button link={object.vkmusic} icon={'/images/icons/vkmusic.svg'}/>
                                                                <Button link={object.spotify} icon={'/images/icons/spotify.svg'}/>
                                                                <Button link={object.ymusic} icon={'/images/icons/ym.svg'}/>
                                                            </div>
                                                            {/* <Button style={"margin-top: 'auto'"} text={'Preview'} icon={'/images/icons/play.svg'}/> */}
                                                            <PreviewMusicButton name={object.name} src={object.preview}/>
                                                        </motion.div>
                                                    )

                                                ) : ''}
                                            </AnimatePresence>
                                        </motion.div>
                        </motion.div>
                    
                    {view === 'list' ? (
                        <motion.h2 transition={transitionSettings} layout className={`${styles.container__mainInfo__header} ${styles.container__mainInfo__header_list}`}>{object.name}</motion.h2>
                    ) : ''}
                    


                </motion.div>

                {view === 'list' ? 
                    (
                        <div className={styles.container__mainContent}>
                            <div className={styles.container__mainContent__stack}>
                                {object?.genre?.join(", ")}
                            </div>
                            <Button link={object.youtube} icon={'/images/icons/yt.svg'}/>
                            <Button link={object.spotify} icon={'/images/icons/spotify.svg'}/>
                            <Button link={object.vkmusic} icon={'/images/icons/vkmusic.svg'}/>
                            <Button link={object.ymusic} icon={'/images/icons/ym.svg'}/>
                            {/* <Button background={'white'} onClick={() => toggleModal(object.id)} text={'Preview'} icon={'/images/icons/play.svg'}/> */}
                            <PreviewMusicButton name={object.name} src={object?.preview}/>

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