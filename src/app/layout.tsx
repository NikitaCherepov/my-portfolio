import {usePathname, useRouter} from 'next/navigation'
import {motion, AnimatePresence, useAnimate} from 'framer-motion'
import {useState, useEffect} from 'react'
import { useExitStore } from './store/useExitStore'
import { useHasHydrated } from './hooks/useHasHydrated'
import { useSortSitesStore } from './store/useExitStore'
import './global.css'
import PageTransition from './components/PageTransition'

import Header from './components/Header'
import Footer from './components/Footer'

export default function RootLayout({children} : {children: React.ReactNode}) {

  return (
    <PageTransition children={children}/>
  )
}