'use client'
import {usePathname, useRouter} from 'next/navigation'
import {motion, AnimatePresence, useAnimate} from 'framer-motion'
import {useState, useEffect} from 'react'
import { useExitStore } from './store/useExitStore'
import { useHasHydrated } from './hooks/useHasHydrated'
import { useSortSitesStore } from './store/useExitStore'
import './global.css'
import styles from './layout.module.scss'

import Header from './components/Header'
import Footer from './components/Footer'

export default function RootLayout({children} : {children: React.ReactNode}) {
  const pathname = usePathname();
  const router = useRouter();
  const {isLeaving, turnOffLeaving, turnOffAnimating, nextPage, setNextPage} = useExitStore();
  const hasHydrated = useHasHydrated(useSortSitesStore);

  const [firstLoad, setFirstLoad] = useState(true);

  // const handleExit = (newPath: string) => {
  //   router.prefetch(newPath);
  //   setIsLeaving(true);
  //   setTimeout(() => {
  //     router.push(newPath);
  //   }, 400)
  // };

  useEffect(() => {
    if (hasHydrated) {
      turnOffLeaving();

      setFirstLoad(false);
    }
  }, [turnOffLeaving, pathname, hasHydrated])

  useEffect(() => {
    if (nextPage != pathname && isLeaving && nextPage != '') {
      hide();
    }
  })

  useEffect(() => {
    console.log(isLeaving);
  }, [isLeaving])

  useEffect(() => {
    // if (pathname) {
    //   setTimeout(() => {
    //     turnOffAnimating();
    //     console.log('Выключил')
    //   }, 500)
    // }
    if (pathname === nextPage && isLeaving) {
      setNextPage('');
      turnOffLeaving();
      show();
    }
  }, [pathname])

  const [scope, animate] = useAnimate();

  const hide = async () => {
      await animate(scope.current, {x: '100vw'}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 0.5});
      router.push(nextPage);
      animate(scope.current, {x: '-100vw'}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 0});
  }
  const show = async () => {
    await animate(scope.current, {x: '0'}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 0.5});
  }



  return (
    <html>
      <body data-theme={pathname === "/music" ? "music" : pathname === "/sites" ? "sites" : "default"}>
        {/* <button onClick={() => handleExit('/music')}>Музыка</button>
        <button onClick={() => handleExit('/sites')}>Сайты</button> */}
        {!hasHydrated ? (
          <div className={styles.container}>
            <img className={styles.container__loader} src='/images/loaders/loader.svg'></img>
          </div>
          ) : (

            <motion.div ref={scope}>
              <Header/>
              {children}
              <Footer/>
            </motion.div>

        )}

      </body>
    </html>
  )
}