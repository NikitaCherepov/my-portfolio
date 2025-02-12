'use client'
import {usePathname, useRouter} from 'next/navigation'
import {motion, AnimatePresence} from 'framer-motion'
import {useState, useEffect} from 'react'
import { useExitStore } from './store/useExitStore'
import { useHasHydrated } from './hooks/useHasHydrated'
import { useSortSitesStore } from './store/useExitStore'
import './global.css'
import styles from './layout.module.scss'

import Header from './components/Header'

export default function RootLayout({children} : {children: React.ReactNode}) {
  const pathname = usePathname();
  const router = useRouter();
  const {isLeaving, turnOffLeaving} = useExitStore();
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
    console.log(isLeaving);
  }, [isLeaving])



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
          <AnimatePresence mode="wait">
          {!isLeaving  &&(
            <motion.div
            key={pathname}
            initial ={firstLoad ? {} : {opacity: 0, x:'-100vw'}}
            animate ={{opacity: 1, x:0}}
            exit={{opacity:0, x:'100vw'}}
            transition={{duration: 0.5}}>
              <Header/>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
        )}

      </body>
    </html>
  )
}