'use client'
import styles from './music.module.scss'
import { useWorkStore } from "../store/useExitStore"
import { usePathname } from "next/navigation"
import { useViewStore } from "../store/useExitStore"
import { useSortSitesStore } from "../store/useExitStore"
import {motion} from 'framer-motion'
import { usePagination } from "../store/useExitStore"
import {useState, useEffect, useRef} from 'react'
import MusicCard from "../components/Cards/MusicCard"
import Button from "../components/Cards/SiteCard/Button"
import SortingComponentForList from "../components/SortingComponentForList"
import PlayerWatcher from "../components/PlayerWatcher"
import MusicPlayer from "../components/MusicPlayer"
import { MusicWork } from '../store/useExitStore'


export default function MusicPage() {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const cardRef = useRef<HTMLDivElement | null>(null);
    // const [maxHeight, setMaxHeight] = useState(0);


    const scrollTo =(id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
    // useEffect(() => {
    //     const observer = new ResizeObserver(entries => {
    //         if (entries.length > 0) {
    //             const {width,height} = entries[0].contentRect;
    //             setMaxHeight(height);
    //         }
    //     })
    //     if (cardRef.current) {
    //         observer.observe(cardRef.current);
    //     }
    //     return () => {
    //         observer.disconnect();
    //     };
    // }, [])

    const {pagination, setCurrentPage} = usePagination();

    const [scrollDir, setScrollDir] = useState<"up" | "down" | 'idle'>('idle');
    const scrollVariants = {
        idle: { rotateX: 0, boxShadow: 'none' },
        down: { rotateX: '10deg', boxShadow: '0 5px 0px rgb(94, 94, 94)'},
        up: { rotateX: '-10deg', boxShadow: '0 -5px 0px rgb(94, 94, 94)' },
      };

    const lastScrollTop = useRef(0);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!scrollRef.current) return;

            const scrollTop = scrollRef.current.scrollTop;
            if (scrollTop > lastScrollTop.current) {
                setScrollDir("down");
            } else if (scrollTop < lastScrollTop.current) {
                setScrollDir("up");
            }
            lastScrollTop.current = scrollTop;

            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
            scrollTimeout.current = setTimeout(() => setScrollDir('idle'), 100);
        };

        const scrollContainer = scrollRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener("scroll", handleScroll);
            }
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        };
    }, []);

    useEffect(() => {
        console.log(scrollDir);
    }, [scrollDir])

    const {sortBy} = useSortSitesStore();

    const {view} = useViewStore();
    const pathname = usePathname();
    const pageKey = pathname.slice(1);

    // const [showModal, setShowModal] = useState(false);
    // const [idModal, setIdModal] = useState<string | null>(null);
    // const toggleModal = (id: string | null) => {
    //     // !showModal ? document.body.classList.add("no-scroll") : document.body.classList.remove("no-scroll");
    //     id ? setIdModal(id) : setIdModal(null);
    //     setShowModal((prev) => !prev);
    // }

    const {music} = useWorkStore();

    const sortingMethods: Record<string, Record<string, (a: MusicWork, b: MusicWork) => number>> = {
        music: {
            newest: (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            oldest: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            genreFromA: (a, b) => a.genre[0]?.localeCompare(b.genre[0], "en"),
            genreFromZ: (a, b) => b.genre[0]?.localeCompare(a.genre[0], "en"),
            nameFromA: (a, b) => a.name.localeCompare(b.name, "ru"),
            nameFromZ: (a, b) => b.name.localeCompare(a.name, "ru"),
        }

      };
      

    const sortedMusic = [...music]
    .sort(sortingMethods[pageKey][sortBy[pageKey]])
    .slice((pagination[pageKey].currentPage - 1) * pagination[pageKey].cardsPerPage, pagination[pageKey].currentPage * pagination[pageKey].cardsPerPage);
    const totalPages = Math.ceil(music.length / pagination[pageKey].cardsPerPage);
    const delta = 2;

    return (
        <>

        <PlayerWatcher/>
        <MusicPlayer/>
        <motion.div transition={{type: 'tween', stiffness: 150, damping: 20, duration: 0.3}} layout className={`mainContainer  ${styles.container}`}>
            {/* <AnimatePresence>
                {showModal && 
                    <motion.div
                    initial={{opacity:0}}
                    animate={{opacity: 1}}
                    exit={{opacity:0}}
                    transition={{type: 'tween', stiffness: 150, damping: 20, duration: 0.3}}
                    className={styles.modal}
                    >
                        <motion.div
                        initial={{opacity:0, scale:0}}
                        animate={{opacity: 1, scale: 1}}
                        exit={{opacity:0, scale: 0}}
                        transition={{type: 'tween', stiffness: 150, damping: 20, duration: 0.3}}>
                        </motion.div>
                    </motion.div>
                }
            </AnimatePresence> */}

            {view === 'list' && (
                <SortingComponentForList/>
                )}

            <motion.div
            layout

            ref={scrollRef}
            transition={{type: 'tween', stiffness: 150, damping: 20, duration: 0.3}} 
            className={`${styles.container__cards} 
            ${view === 'grid' ? styles.container__cards_grid : styles.container__cards_list}
            `}
            // style={view === 'grid' ? {maxHeight: maxHeight* 2 + 60} : {maxHeight: maxHeight* 6 + 60}}
            >

                {sortedMusic
                .map((object) => (
                    <motion.div
                    key={object.id}
                    transition={{type: 'tween', stiffness: 150, damping: 20, duration: 0.3}}
                    className={`
                    ${styles.container__cards__card}
                    ${view === 'grid' ? styles.container__cards__card_grid : styles.container__cards__card_list}`}
                    layout>
                        <motion.div
                            animate={scrollDir}
                            variants={scrollVariants}
                            className={`${styles.container__cards__card}`}
                            transition={{type: 'tween', duration: 0.3, ease: 'easeInOut'}}
                            ref={cardRef}
                            >
                        <MusicCard object={object}/>
                        </motion.div>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div className={styles.pagination}>
                {totalPages > 1 && Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                        if (page === 1 || page === totalPages) return true;

                        if (pagination[pageKey].currentPage <= 1 + delta-1) return page <= 1 + delta;

                        if (pagination[pageKey].currentPage >= totalPages - delta) return page >= totalPages - delta - 1;

                        return Math.abs(pagination[pageKey].currentPage - page) <= delta / 2;
                    })
                    //@ts-expect-error something
                    .reduce<JSX.Element[]>((acc, page, index, arr) => {

                        if (index > 0 && page - arr[index - 1] > 1) {
                            acc.push(<span key={`dots-${index}`}>...</span>);
                        }

                        acc.push(
                            <button className={`hoverEffect`} key={page} onClick={() => setCurrentPage(pageKey, page)} disabled={page === pagination[pageKey].currentPage}>
                                {page}
                            </button>
                        );

                        return acc;
                    }, [])
                }
            </motion.div>     

        </motion.div>

        <button onClick={() => scrollTo('services')} className={styles.scrollButton}>
            <img alt='arrow' src='/images/icons/arrow_down.svg'></img>
        </button>

        <div className={styles.myServices} id="services">

            <div className={styles.myServices__background}>
                <img src='/images/backgroundStars.webp' alt={'бэкграунд'}/>
            </div>

            <div className={styles.myServices__content}>


            <h2>Мои услуги:</h2>
            <h3>Пишу музыку для игр, видео и медиа</h3>

            <h4>Работаю в жанрах:</h4>

            <div className={styles.myServices__genres}>
                <ul>
                    <li>джаз</li>
                    <li>lo-fi</li>
                    <li>рок</li>
                    <li>ambient</li>
                    <li>электроника</li>
                </ul>
                <ul>
                    <li>средневековая музыка</li>
                    <li>блюз</li>
                    <li>джаз-рок</li>
                    <li>блюз-рок</li>
                    <li>метал</li>
                </ul>
            </div>

            <p>И многих других! (люблю эксперименты)</p>

            <h3>Если у вас есть интересная идея и проект для работы:</h3>

            <div className={styles.myServices__buttons}>

                <Button size="big" background={'#fff'} text={"Телеграм"} icon={'/images/icons/tg.svg'}/>
                <Button size="big"  background={'#fff'} text={'E-mail'} icon={'/images/icons/email.svg'}/>
                <Button size="big"  background={'#fff'} text={'ВКонтакте'} icon={'/images/icons/vk.svg'}/>
                <p>Псс... саундтрек нужен?</p>

            </div>
            </div>
                        
        </div>     
        </>
    )
}