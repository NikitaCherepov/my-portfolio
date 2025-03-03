"use client";
import {create} from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

//Для переключения между страниц
interface ExitStore {
    isLeaving: boolean;
    isAnimating: boolean;
    handleExit: (currentPath: string, router: AppRouterInstance, path: string) => void;
    turnOffLeaving: () => void;
    turnOnAnimating: () => void;
    turnOffAnimating: () => void;
    nextPage: string;
    setNextPage: (value: string) => void
}
export const useExitStore = create<ExitStore>((set) => {

    return {
        isLeaving: false,
        handleExit: (currentPath, router, newPath: string) => {
            if (currentPath != newPath) {
                set({isLeaving: true, nextPage: newPath});
                // setTimeout(() => {
                //     router.push(newPath);
                // }, 500)
            }
        },
        turnOffLeaving: () => {
            set({isLeaving: false})
        },
        isAnimating: false,
        turnOnAnimating: () => {
            set({isAnimating: true})
        },
        turnOffAnimating: () => {
            set({isAnimating: false})
        },
        nextPage: '',
        setNextPage: (value: string) => {
            set({nextPage: value})
        }
    }
})

//Для сортировки


export interface SortingOption {
    name: string;
    type: string;
    rotate: boolean;
    position: number;
    initialPosition: number;
    active: boolean;
  }

export interface SortSitesStore {
    sortBy: Record<string, string>;
    setSortBy: (page: string, sort: string) => void;
    sortingOptions: Record<string, SortingOption[]>;
    setSortingOptions: (page: string, newOptions: SortingOption[]) => void;
}
export const useSortSitesStore = create<SortSitesStore>()(
    persist<SortSitesStore>(
    (set) => ({
        sortBy: 
        {
            sites: 'newest',
            music: 'newest'
        },
        setSortBy: (page, sort) =>
            set((state) => ({
                sortBy: {
                    ...state.sortBy,
                    [page]: sort
                }
            })),
        sortingOptions:
        {
            sites: [
                {
                    name: 'По дате',
                    type: 'newest',
                    rotate: true,
                    position: 1,
                    initialPosition:1,
                    active: true,
                },
                {
                    name: 'По дате',
                    type: 'oldest',
                    rotate: false,
                    position: 2,
                    initialPosition:2,
                    active: false,
                },
                {
                    name: 'По названию',
                    type: 'nameFromA',
                    rotate: true,
                    position: 3,
                    initialPosition:3,
                    active: false,
                },
                {
                    name: 'По названию',
                    type: 'nameFromZ',
                    rotate: false,
                    position: 4,
                    initialPosition:4,
                    active: false,
                },
                {
                    name: 'По стеку',
                    type: 'complex',
                    rotate: true,
                    position: 5,
                    initialPosition:5,
                    active: false,
                },
                {
                    name: 'По стеку',
                    type: 'easiest',
                    rotate: false,
                    position: 6,
                    initialPosition:6,
                    active: false,
                }
            ],
            music: [
                {
                    name: 'По дате',
                    type: 'newest',
                    rotate: true,
                    position: 1,
                    initialPosition:1,
                    active: true,
                },
                {
                    name: 'По дате',
                    type: 'oldest',
                    rotate: false,
                    position: 2,
                    initialPosition:2,
                    active: false,
                },
                {
                    name: 'По названию',
                    type: 'nameFromA',
                    rotate: true,
                    position: 3,
                    initialPosition:3,
                    active: false,
                },
                {
                    name: 'По названию',
                    type: 'nameFromZ',
                    rotate: false,
                    position: 4,
                    initialPosition:4,
                    active: false,
                },
                {
                    name: 'По жанру',
                    type: 'genreFromA',
                    rotate: true,
                    position: 5,
                    initialPosition:5,
                    active: false,
                },
                {
                    name: 'По жанру',
                    type: 'genreFromZ',
                    rotate: false,
                    position: 6,
                    initialPosition:6,
                    active: false,
                }
            ]
        },
        setSortingOptions: (page, newOptions) => {
            set((state) => ({
              sortingOptions: {
                ...state.sortingOptions,
                [page]: newOptions,
              },
            }));
          },
    }),
    {
        name: 'sort-list-store',
        storage: createJSONStorage(() => localStorage),
    },
)
)


//Для список/grid
interface ViewGridStore {
    view: 'list' | 'grid';
    toggleView: () => void;
} 
export const useViewStore = create<ViewGridStore>()(
    persist<ViewGridStore>(
    (set) => {
        return {
            view: 'grid',
            toggleView: () => set((state) => ({view: state.view === 'list' ? 'grid' : 'list'}))
        }
    },
    {
        name:'view-grid-store',
        storage: createJSONStorage(() => localStorage),
    }
))


export interface SiteWork {
    name: string,
    mainImage: string,
    stack: string[],
    directLink: string,
    github: string,
    description: string,
    features: string[],
    date: string,
    id: string
}

export interface MusicWork {
    name: string,
    mainImage: string,
    genre: string[],
    youtube: string,
    spotify: string,
    vkmusic: string,
    ymusic: string,
    date: string,
    id: string,
    preview: string
}

interface WorkStore {
    sites: SiteWork[],
    music: MusicWork[]
}

export const useWorkStore = create<WorkStore>(() => ({
        sites: [
            {
                name: 'Лендинг страницы',
                mainImage: '/cards/sites/LandingFirst/mainImage.png',
                stack: ['HTML', 'CSS'],
                directLink: 'google.com',
                github: 'github.com',
                description: 'Лэндинговая страница',
                features: ['Дизайн'],
                date: "2012-10-22",
                id: crypto.randomUUID()
            },
            {
                name: 'Слайдер',
                mainImage: '/cards/sites/Slider/mainImage.png',
                stack: ['HTML', 'CSS'],
                directLink: 'google.com',
                github: 'github.com',
                description: 'Компонент: слайдер с двумя переключателями на чистом html/css',
                features: ['Удобство'],
                date: "2012-10-23",
                id: crypto.randomUUID()
            },
            {
                name: 'Портфолио',
                mainImage: '/cards/sites/Portfolio/mainImage.png',
                stack: [
                    'React',  
                    'Next.js',  
                    'Framer-motion',  
                    'Zustand',  
                    'Typescript',  
                    'SCSS'
                ],                
                directLink: 'google.com',
                github: 'https://github.com/',
                description: "Сайт-портфолио на React и Next.js с анимациями на Framer Motion.\n Плавные переходы между страницами, интерактивные списки и переключатели. Вид карточки при выборе списка/блока динамически анимирован в одном компоненте. Выбранный тип сортировки сохраняется в LocalStorage через Zustand. \n В процессе работы также освоил TypeScript и частично внедрил типизацию.",
                features: ['Анимированные переходы', 'Сохранение типа сортировки', 'Частичная типизация'],
                date: "2012-10-23",
                id: crypto.randomUUID()
            },
            {
                name: 'Слайдер',
                mainImage: '/cards/sites/Slider/mainImage.png',
                stack: ['HTML', 'CSS'],
                directLink: 'google.com',
                github: 'github.com',
                description: 'Компонент: слайдер с двумя переключателями на чистом html/css',
                features: ['Удобство'],
                date: "2012-10-23",
                id: crypto.randomUUID()
            },
            {
                name: 'Слайдер',
                mainImage: '/cards/sites/Slider/mainImage.png',
                stack: ['HTML', 'CSS'],
                directLink: 'google.com',
                github: 'github.com',
                description: 'Компонент: слайдер с двумя переключателями на чистом html/css',
                features: ['Удобство'],
                date: "2012-10-23",
                id: crypto.randomUUID()
            },
            {
                name: 'Слайдер',
                mainImage: '/cards/sites/Slider/mainImage.png',
                stack: ['HTML', 'CSS'],
                directLink: 'google.com',
                github: 'github.com',
                description: 'Компонент: слайдер с двумя переключателями на чистом html/css',
                features: ['Удобство'],
                date: "2012-10-23",
                id: crypto.randomUUID()
            },

                        {
                name: 'Слайдер',
                mainImage: '/cards/sites/Slider/mainImage.png',
                stack: ['HTML', 'CSS'],
                directLink: 'google.com',
                github: 'github.com',
                description: 'Компонент: слайдер с двумя переключателями на чистом html/css',
                features: ['Удобство'],
                date: "2012-10-23",
                id: crypto.randomUUID()
            },
            {
                name: 'Слайдер',
                mainImage: '/cards/sites/Slider/mainImage.png',
                stack: ['HTML', 'CSS'],
                directLink: 'google.com',
                github: 'github.com',
                description: 'Компонент: слайдер с двумя переключателями на чистом html/css',
                features: ['Удобство'],
                date: "2012-10-23",
                id: crypto.randomUUID()
            },
            {
                name: 'Слайдер',
                mainImage: '/cards/sites/Slider/mainImage.png',
                stack: ['HTML', 'CSS'],
                directLink: 'google.com',
                github: 'github.com',
                description: 'Компонент: слайдер с двумя переключателями на чистом html/css',
                features: ['Удобство'],
                date: "2012-10-23",
                id: crypto.randomUUID()
            },
            {
                name: 'Слайдер',
                mainImage: '/cards/sites/Slider/mainImage.png',
                stack: ['HTML', 'CSS'],
                directLink: 'google.com',
                github: 'github.com',
                description: 'Компонент: слайдер с двумя переключателями на чистом html/css',
                features: ['Удобство'],
                date: "2012-10-23",
                id: crypto.randomUUID()
            },

            {
                name: 'Слайдер',
                mainImage: '/cards/sites/Slider/mainImage.png',
                stack: ['HTML', 'CSS'],
                directLink: 'google.com',
                github: 'github.com',
                description: 'Компонент: слайдер с двумя переключателями на чистом html/css',
                features: ['Удобство'],
                date: "2012-10-23",
                id: crypto.randomUUID()
            },
        ],
        music: [
            {   name: 'Deep Rain',
                mainImage: '/cards/music/Deep Rain.png',
                genre: ['jazz'],
                youtube: 'link',
                spotify: 'link',
                vkmusic: 'link',
                ymusic: 'link',
                date: "2012-10-21",
                id: crypto.randomUUID(),
                preview: '/music/fairytale.mp3'
            },
            {   name: 'Flow Time',
                mainImage: '/cards/music/Flow Time.png',
                genre: ['lo-fi, chillout'],
                youtube: 'link',
                spotify: 'link',
                vkmusic: 'link',
                ymusic: 'link',
                date: "2012-10-22",
                id: crypto.randomUUID(),
                preview: '/music/fairytale.mp3'
            },
            {   name: 'Meeting The Sunset',
                mainImage: '/cards/music/meeting the sunset.png',
                genre: ['chillout'],
                youtube: 'link',
                spotify: 'link',
                vkmusic: 'link',
                ymusic: 'link',
                date: "2012-10-24",
                id: crypto.randomUUID(),
                preview: '/music/fairytale.mp3'
            },
            {   name: 'Metal Rogue',
                mainImage: '/cards/music/Metal Rogue.png',
                genre: ['electronic, blues, rock'],
                youtube: 'link',
                spotify: 'link',
                vkmusic: 'link',
                ymusic: 'link',
                date: "2012-10-22",
                id: crypto.randomUUID(),
                preview: '/music/metalrogue.mp3'
            },
            {   name: 'Fairytale',
                mainImage: '/cards/music/Fairytale.png',
                genre: ['soundtrack'],
                youtube: 'link',
                spotify: 'link',
                vkmusic: 'link',
                ymusic: 'link',
                date: "2012-12-22",
                id: crypto.randomUUID(),
                preview: '/music/fairytale.mp3'
            },
            {   name: 'Childish Dream',
                mainImage: '/cards/music/Childish Dream.png',
                genre: ['classic'],
                youtube: 'link',
                spotify: 'link',
                vkmusic: 'link',
                ymusic: 'link',
                date: "2012-10-22",
                id: crypto.randomUUID(),
                preview: '/music/fairytale.mp3'
            },
            {   name: 'Dark Disco',
                mainImage: '/cards/music/Dark Disco.png',
                genre: ['electronic'],
                youtube: 'link',
                spotify: 'link',
                vkmusic: 'link',
                ymusic: 'link',
                date: "2012-11-22",
                id: crypto.randomUUID(),
                preview: '/music/fairytale.mp3'
            },
            {   name: 'Morning Breakfast',
                mainImage: '/cards/music/Morning Breakfast.png',
                genre: ['jazz'],
                youtube: 'link',
                spotify: 'link',
                vkmusic: 'link',
                ymusic: 'link',
                date: "2012-10-22",
                id: crypto.randomUUID(),
                preview: '/music/fairytale.mp3'
            },

        ]
}))

export interface PaginationObject {
    currentPage: number,
    cardsPerPage: number
}

interface PaginationStore {
    pagination: Record<string, PaginationObject>,
    setCurrentPage: (key: string, page: number) => void
}

export const usePagination = create<PaginationStore>((set) => ({
    pagination: {
        sites: {
            currentPage: 1,
            cardsPerPage: 9
        },
        music: {
            currentPage: 1,
            cardsPerPage: 9
        }
    },
    setCurrentPage: (key, page) => set((state) => ({
        pagination: {
            ...state.pagination,
            [key]: {
                ...state.pagination[key],
                currentPage: page
            }
        }
    }))
}))

interface PlayerPosition {
    x: number;
    y: number;
}

interface PlayerSettings {
    volume: number;
    setVolume: (volume: number) => void;
    showPlayer: boolean;
    setShowPlayer: () => void;
    position: PlayerPosition;
    setPosition: (newValue: PlayerPosition) => void;
}

export const usePlayerStore = create<PlayerSettings>()(
    persist(
        (set, get) => ({
            volume: 0.05,
            setVolume: (volume) => set({ volume }),
            
            showPlayer: true,
            setShowPlayer: () => {const state = get(); set({ showPlayer: !state.showPlayer })},
            
            position: { x: 0, y: 0 },
            setPosition: (newValue) => {set({ position: newValue })},
        }),
        {
            name: "player-settings",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
interface PlayerState {
    audio: HTMLAudioElement | null,
    setAudio: (music: string | undefined) => void,
    currentTime: number,
    setCurrentTime:(currentTime: number) => void,
    currentSrc: string,
    isPlaying: boolean,
    play: () => void,
    pause: () => void,
    duration: number,
    setDuration: (duration: number | undefined) => void,
    name: string,
    setName: (name: string) => void
}
export const usePlayerStateStore = create<PlayerState>((set, get) => {
    return {
        audio: null,
        currentSrc: '',
        setAudio: (src) => {
            set({audio: new Audio(src), currentSrc: src});
        },
        currentTime: 0,
        setCurrentTime: (currentTime) => {
            set({currentTime: currentTime});
        },
        isPlaying: false,
        play: () => {
            const state = get();
            if (state.audio && !state.isPlaying) {
                set({ isPlaying: true });
                state.audio.play();
            }
            else if (state.isPlaying && state.duration === state.currentTime) {
                state?.audio?.play();
            }
        },
        pause: () => {
            const state = get();
            if (state.audio && state.isPlaying) {
                set({ isPlaying: false });
                state.audio.pause();
            }
        },
        duration: 0,
        setDuration: (duration) => {
            set({duration: duration});
        },
        name: '',
        setName: (name) => {
            set({name: name});
        }
    }
})