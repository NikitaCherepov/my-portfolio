'use client'
import styles from './SortingContainer.module.scss'
import { useSortSitesStore } from '../../store/useExitStore'
import {motion, useAnimate} from 'framer-motion'
import {useState, useRef, useLayoutEffect} from 'react'
import { usePathname } from 'next/navigation'
import { SortingOption } from '../../store/useExitStore'

import { useHasHydrated } from '@/app/hooks/useHasHydrated'


export default function SortingComponent() {

    const [scope, animate] = useAnimate();
    const hasHydrated = useHasHydrated(useSortSitesStore);

    const [animationOn, setAnimationOn] = useState(false);

    const pathname = usePathname();
    const pageKey = pathname.slice(1);

    const [showModal, setShowModal] = useState(false);

    const firstOptionRef = useRef<HTMLDivElement | null>(null);

    const {sortBy, setSortBy, sortingOptions, setSortingOptions} = useSortSitesStore();

    const handleChange = (element: SortingOption) => {

        if (showModal) {
            setShowModal(false);
            if (element.type === sortBy[pageKey]) {
                hide();
            }
            else {
                setSortBy(pageKey, element.type);
        
                changeArrayOrder(element);
                  
                setTimeout(() => {
                    hide();
                }, 400)
                console.log(element.type);
            }
        }
        else {
            setShowModal(true);
            show();
        }

    }

    const changeArrayOrder = (element:SortingOption) => {
        const currentOptions = sortingOptions[pageKey];  
        if (!currentOptions) return;
      
        const selectedOption = currentOptions.find((obj) => obj.type === element?.type);
        if (!selectedOption) return;
      
        const alternateOption = currentOptions.find(
          (obj) => obj.name === selectedOption.name && obj.type !== selectedOption.type
        );
      
        const otherOptions = currentOptions.filter(
          (obj) => obj.name !== selectedOption.name
        );
      
        otherOptions.sort((a, b) => a.initialPosition - b.initialPosition);
      
        const newOptions = [];
        newOptions.push({ ...selectedOption, position: 1, active: true });
        if (alternateOption) {
          newOptions.push({ ...alternateOption, position: 2, active: false });
        }
        otherOptions.forEach((obj, idx) => {
          newOptions.push({ ...obj, position: idx + 3, active: false });
        });
      
        setSortingOptions(pageKey, newOptions);
    }

    useLayoutEffect(() => {
        setAnimationOn(false);
        if (!hasHydrated) {
            return;
        }
        

        const element = sortingOptions[pageKey].find((object) => object.type === sortBy[pageKey]);
        if (!element) {
            return;
        }
        changeArrayOrder(element);
        setAnimationOn(true);
    }, [hasHydrated])

    const hide = async () => {
        animate(scope.current, {height: '36px'}, {type: 'tween', stiffness: 150, damping: 20, duration: 0.3});
        animate(scope.current, {padding: 0}, {type: 'tween', stiffness: 150, damping: 20, duration: 0.3});
    }
    const show = async () => {
        animate(scope.current, {padding: '0px 8px'}, {type: 'tween', stiffness: 150, damping: 20, duration: 0.3});
        animate(scope.current, {height: 'auto'}, {type: 'tween', stiffness: 150, damping: 20, duration: 0.3});
    }


    if (!hasHydrated && animationOn) {
        return;
    }
    else return (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration: 0.3}} className={styles.container}>
            <div ref={firstOptionRef} style={{opacity: 0}} className={styles.container__option}>
                <img alt='arrow' className={`${sortingOptions[pageKey].find((element) => element.type === sortBy[pageKey])?.rotate ? 'rotate-180' : ''}`} src='/images/icons/arrow.svg'></img>
                <p>{sortingOptions[pageKey].find((element) => element.type === sortBy[pageKey])?.name}</p>
            </div>


            <motion.div
                ref={scope}
                className={styles.container__modal}
                style={{height: '36px'}}
            >
                {animationOn && sortingOptions[pageKey]
                .sort((a,b) => a.position - b.position)
                .map((object) => (
                    <motion.div
                    initial={false}
                    transition={{ type: "spring", stiffness: 150, damping: 20 }}
                    layout
                    onClick={() => handleChange(object)} 
                    key={object.type} 
                    className={`${styles.container__option} hoverEffect ${object.position === 6 ? 'mb-[13px]' : ''}`}>
                        <img alt='arrow' className={`${object.rotate ? 'rotate-180' : ''}`} src='/images/icons/arrow.svg'></img>
                        <p>{object.name}</p>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    )
}