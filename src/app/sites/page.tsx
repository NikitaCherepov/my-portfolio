'use client'
import Header from "../components/Header"
import styles from './sites.module.scss'
import { useWorkStore } from "../store/useExitStore"
import SiteCard from "../components/Cards/SiteCard"
import { usePathname } from "next/navigation"
import { useViewStore } from "../store/useExitStore"
import { useSortSitesStore } from "../store/useExitStore"
import {AnimatePresence, motion} from 'framer-motion'
import { SiteWork, MusicWork } from "../store/useExitStore"
import { SortSitesStore } from "../store/useExitStore"
import {useState, useEffect} from 'react'
import ModalSites from "../components/ModalSites"

export default function SitesPage() {
    const {view} = useViewStore();
    const pathname = usePathname();
    const pageKey = pathname.slice(1) as keyof typeof sortingOptions;

    const [showModal, setShowModal] = useState(false);
    const [idModal, setIdModal] = useState<string | null>(null);
    const toggleModal = (id: string | null) => {
        !showModal ? document.body.classList.add("no-scroll") : document.body.classList.remove("no-scroll");
        id ? setIdModal(id) : setIdModal(null);
        setShowModal((prev) => !prev);
    }

    const {sortingOptions, sortBy} = useSortSitesStore();
    const {sites} = useWorkStore();

    const sortingMethods: Record<string, Record<string, (a: any, b: any) => number>> = {
        sites: {
            newest: (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            oldest: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            nameFromA: (a, b) => b.name.localeCompare(a.name, 'ru'),
            nameFromZ: (a, b) => a.name.localeCompare(b.name, 'ru'),
            complex: (a, b) => b.stack.length - a.stack.length,
            easiest: (a, b) => a.stack.length - b.stack.length,
        },
        music: {
            newest: (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            oldest: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            genreFromA: (a, b) => a.genre.localeCompare(b.genre, "ru"),
            genreFromZ: (a, b) => b.genre.localeCompare(a.genre, "ru"),
            nameFromA: (a, b) => a.name.localeCompare(b.name, "ru"),
            nameFromZ: (a, b) => b.name.localeCompare(a.name, "ru"),
        }

      };
      

    const sortedSites = [...sites].sort(sortingMethods[pageKey][sortBy[pageKey]]);

    return (
        <motion.div transition={{type: 'tween', stiffness: 150, damping: 20, duration: 0.3}} layout className={`mainContainer  ${styles.container}`}>
            <AnimatePresence>
                {showModal && 
                    <motion.div
                    initial={{opacity:0}}
                    animate={{opacity: 1}}
                    exit={{opacity:0}}
                    transition={{type: 'tween', stiffness: 150, damping: 20, duration: 0.3}}
                    className={styles.modal}
                    onClick={() => toggleModal(null)}
                    >
                        <motion.div
                        initial={{opacity:0, scale:0}}
                        animate={{opacity: 1, scale: 1}}
                        exit={{opacity:0, scale: 0}}
                        transition={{type: 'tween', stiffness: 150, damping: 20, duration: 0.3}}>
                        <ModalSites id={idModal} toggleModal={(id: string) => toggleModal(id)}/>
                        </motion.div>
                    </motion.div>
                }
            </AnimatePresence>
            <motion.div
            layout
            
            transition={{type: 'tween', stiffness: 150, damping: 20, duration: 0.3}} 
            className={`${styles.container__cards} ${view === 'grid' ? styles.container__cards_grid : styles.container__cards_list}`}>
                {sortedSites.map((object) => (
                    <motion.div transition={{type: 'tween', stiffness: 150, damping: 20, duration: 0.3}} className={`${styles.container__cards__card} ${view === 'grid' ? styles.container__cards__card_grid : styles.container__cards__card_list}`} key={object.id} layout>
                        <SiteCard toggleModal={(id:string) => toggleModal(id)} object={object}/>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    )
}