'use client'


import {useAnimate, motion} from 'framer-motion'
import {useEffect, useState, useRef} from 'react'
import styles from './not-found.module.scss'
import Button from './components/Cards/SiteCard/Button';
import { useInitiateExit } from './hooks/useInitiateExit';

import {usePathname, useRouter} from 'next/navigation'

import { useDimensions } from '@/app/hooks/useDimensions'
import { useExitStore } from './store/useExitStore';

export default function NotFound() {

    const initiateExit = useInitiateExit();


    const [scope, animate] = useAnimate();
    useEffect(() => {
        startAnimation();
    }, [])

    const angleRef = useRef<number>(0);


    const startAnimation = async () => {
        animate('#third-number', {y: '0', rotate: `${-angleRef.current}deg`}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 1});
        await animate('#first-number', {y: '0', rotate: `${angleRef.current}deg`}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 1});
        
        angleRef.current += 90;
        animate('#third-number', {rotate: `${-angleRef.current}deg`}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 1});
        await animate('#first-number', {rotate: `${angleRef.current}deg`}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 1});


        animate('#third-number', {y: '-100px'}, {ease: 'linear', type: 'spring', stiffness: 150, damping: 15});
        await animate('#first-number', {y: '100px'}, {ease: 'linear', type: 'spring', stiffness: 150, damping: 15});

        angleRef.current += 90;
        animate('#third-number', {rotate: `${-angleRef.current}deg`}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 1});
        animate('#first-number', {rotate: `${angleRef.current}deg`}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 1});
        animate('#third-number', {x: '-300%'}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 1});
        await animate('#first-number', {x: '300%'}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 1});

        animate('#third-number', {y: '0'}, {ease: 'linear', type: 'spring', stiffness: 150, duration: 1});
        await animate('#first-number', {y: '0'}, {ease: 'linear', type: 'spring', stiffness: 150, duration: 1});


        angleRef.current +=180;
        animate('#third-number', {rotate: `${-angleRef.current}deg`}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 1});
        await animate('#first-number', {rotate: `${angleRef.current}deg`}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 1});
        animate('#third-number', {x: '-200%'}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 1});
        await animate('#first-number', {x: '200%'}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 1});

        angleRef.current +=90;
        animate('#third-number', {y: '0', rotate: `${-angleRef.current}deg`}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 1});
        await animate('#first-number', {y: '0', rotate: `${angleRef.current}deg`}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 1});

        animate('#third-number', {y: '-100px'}, {ease: 'linear', type: 'spring', stiffness: 150, duration: 1});
        await animate('#first-number', {y: '100px'}, {ease: 'linear', type: 'spring', stiffness: 150, duration: 1});

        angleRef.current +=90;
        animate('#third-number', {rotate: `${-angleRef.current}deg`}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 1});
        animate('#first-number', {rotate: `${angleRef.current}deg`}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 1});
        animate('#third-number', {x: '100%'}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 1});
        await animate('#first-number', {x: '-100%'}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 1});

        animate('#third-number', {y: '0'}, {ease: 'linear', type: 'spring', stiffness: 150, duration: 1});
        await animate('#first-number', {y: '0'}, {ease: 'linear', type: 'spring', stiffness: 150, duration: 1});

        angleRef.current +=180;
        animate('#third-number', {rotate: `${-angleRef.current}deg`}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 1});
        await animate('#first-number', {rotate: `${angleRef.current}deg`}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 1});
        animate('#third-number', {x: '0%'}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 1});
        await animate('#first-number', {x: '0%'}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 1});

        await new Promise(resolve => setTimeout(resolve, 1000));

        startAnimation();
    }


    return (
        <div className={styles.container}>
            <div ref={scope} className={styles.animatedError}>
                <p id="first-number">4</p>
                <p id="second-number">0</p>
                <p id="third-number">4</p>
            </div>
            <div className={styles.error}>
                Страница не найдена
            </div>

            <Button onClick={() => initiateExit("/")} className={styles.button} background={'white'} text={'На главную'}></Button>
        </div>
    )
}