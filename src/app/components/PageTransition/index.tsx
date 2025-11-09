'use client'
import {usePathname, useRouter} from 'next/navigation'
import {motion, useAnimate} from 'framer-motion'
import {useEffect} from 'react'
import { useExitStore } from '@/app/store/useExitStore'
import { useHasHydrated } from '@/app/hooks/useHasHydrated'
import { useSortSitesStore } from '@/app/store/useExitStore'
import styles from './PageTransition.module.scss'
import Header from '../Header'
import Footer from '../Footer'
import { Toaster } from 'sonner'


export default function PageTransition({children} : {children: React.ReactNode}) {
    const pathname = usePathname();
      const router = useRouter();
      const {isLeaving, turnOffLeaving, nextPage, setNextPage} = useExitStore();
      const hasHydrated = useHasHydrated(useSortSitesStore);

      //Анимации

      const [scope, animate] = useAnimate();

      const hide = async () => {
          await animate(scope.current, {x: '100vw'}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 0.5});
          animate(scope.current, {x: '-100vw'}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 0});
          router.push(nextPage);
      }
      const show = async () => {
        await animate(scope.current, {x: '0'}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 0.5});
      }
      
    
      //Переход
      useEffect(() => {
        if (nextPage != pathname && isLeaving && nextPage != '') {
          hide();
        }
      }, [nextPage, isLeaving, pathname])
    
      //Сброс переменных при переходе
      useEffect(() => {
        if (pathname === nextPage && isLeaving) {
          setNextPage('');
          turnOffLeaving();
          setTimeout(() => show(), 100)
        }
      }, [pathname, nextPage, isLeaving, setNextPage, turnOffLeaving])


      return (
        <html>
          
          <body data-theme={pathname === "/music" ? "music" : "sites" }>
                              <Toaster
              position="top-right"
              expand={true}
              visibleToasts={10}/>
            {!hasHydrated ? (
              <div className={styles.container}>
                <img alt='Загрузка' className={styles.container__loader} src='/images/loaders/loader.svg'></img>
              </div>
              ) : (
    
                <motion.div ref={scope}>
                    {pathname==='/sites' || pathname === '/music' ? (
                        <>
                                          <Header/>
                                          {children}
                                          <Footer/>
                                          </>
                    ) : children}
                </motion.div>
              )
        }
    
          </body>
        </html>
      )
}