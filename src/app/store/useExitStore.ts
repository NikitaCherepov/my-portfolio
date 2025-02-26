"use client";
import {create} from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'
import { useId } from 'react';

//Для переключения между страниц
interface ExitStore {
    isLeaving: boolean;
    isAnimating: boolean;
    handleExit: (currentPath: string, router: any, path: string) => void;
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


interface SortingOption {
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
    id: string
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
                name: 'Игра про вамffffsdfsdfsdfsпира',
                mainImage: '/cards/sites/Vampire/mainImage.png',
                stack: ['HTML', 'CSS'],
                directLink: 'google.com',
                github: 'github.com',
                description: 'Компонент: слайдер с двумя переключателями на чистом html/css',
                features: ['Удобство'],
                date: "2012-09-22",
                id: crypto.randomUUID()
            },
            {
                name: 'Игра про гуся',
                mainImage: '/cards/sites/Goose/mainImage.png',
                stack: ['HTML', 'CSS'],
                directLink: 'google.com',
                github: 'github.com',
                description: 'Компонент: слайдер с двумя переключателями на чистом html/css',
                features: ['Удобство'],
                date: "2012-05-22",
                id: crypto.randomUUID()
            },
            {
                name: 'Игра про вамffffsdfsdfsdfsпира',
                mainImage: '/cards/sites/Vampire/mainImage.png',
                stack: ['HTML', 'CSS'],
                directLink: 'google.com',
                github: 'github.com',
                description: 'Компонент: слайдер с двумя переключателями на чистом html/css',
                features: ['Удобство'],
                date: "2012-09-22",
                id: crypto.randomUUID()
            },
            {
                name: 'Игра про вамffffsdfsdfsdfsпира',
                mainImage: '/cards/sites/Vampire/mainImage.png',
                stack: ['HTML', 'CSS'],
                directLink: 'google.com',
                github: 'github.com',
                description: 'Компонент: слайдер с двумя переключателями на чистом html/css',
                features: ['Удобство'],
                date: "2012-09-22",
                id: crypto.randomUUID()
            },
            {
                name: 'Игра про вамffffsdfsdfsdfsпира',
                mainImage: '/cards/sites/Vampire/mainImage.png',
                stack: ['HTML', 'CSS'],
                directLink: 'google.com',
                github: 'github.com',
                description: 'Компонент: слайдер с двумя переключателями на чистом html/css',
                features: ['Удобство'],
                date: "2012-09-22",
                id: crypto.randomUUID()
            },
            {
                name: 'Игра про вамffffsdfsdfsdfsпира',
                mainImage: '/cards/sites/Vampire/mainImage.png',
                stack: ['HTML', 'CSS'],
                directLink: 'google.com',
                github: 'github.com',
                description: 'Компонент: слайдер с двумя переключателями на чистом html/css',
                features: ['Удобство'],
                date: "2012-09-22",
                id: crypto.randomUUID()
            },
            {
                name: 'Игра про вамffffsdfsdfsdfsпира',
                mainImage: '/cards/sites/Vampire/mainImage.png',
                stack: ['HTML', 'CSS'],
                directLink: 'google.com',
                github: 'github.com',
                description: 'Компонент: слайдер с двумя переключателями на чистом html/css',
                features: ['Удобство'],
                date: "2012-09-22",
                id: crypto.randomUUID()
            },
            {
                name: 'Игра про вамffffsdfsdfsdfsпира',
                mainImage: '/cards/sites/Vampire/mainImage.png',
                stack: ['HTML', 'CSS'],
                directLink: 'google.com',
                github: 'github.com',
                description: 'Компонент: слайдер с двумя переключателями на чистом html/css',
                features: ['Удобство'],
                date: "2012-09-22",
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
                id: crypto.randomUUID()
            },
            {   name: 'Flow Time',
                mainImage: '/cards/music/Flow Time.png',
                genre: ['lo-fi, chillout'],
                youtube: 'link',
                spotify: 'link',
                vkmusic: 'link',
                ymusic: 'link',
                date: "2012-10-22",
                id: crypto.randomUUID()
            },
            {   name: 'Meeting The Sunset',
                mainImage: '/cards/music/meeting the sunset.png',
                genre: ['chillout'],
                youtube: 'link',
                spotify: 'link',
                vkmusic: 'link',
                ymusic: 'link',
                date: "2012-10-24",
                id: crypto.randomUUID()
            },
            {   name: 'Metal Rogue',
                mainImage: '/cards/music/Metal Rogue.png',
                genre: ['electronic, blues, rock'],
                youtube: 'link',
                spotify: 'link',
                vkmusic: 'link',
                ymusic: 'link',
                date: "2012-10-22",
                id: crypto.randomUUID()
            },
            {   name: 'Fairytale',
                mainImage: '/cards/music/Fairytale.png',
                genre: ['soundtrack'],
                youtube: 'link',
                spotify: 'link',
                vkmusic: 'link',
                ymusic: 'link',
                date: "2012-12-22",
                id: crypto.randomUUID()
            },
            {   name: 'Childish Dream',
                mainImage: '/cards/music/Childish Dream.png',
                genre: ['classic'],
                youtube: 'link',
                spotify: 'link',
                vkmusic: 'link',
                ymusic: 'link',
                date: "2012-10-22",
                id: crypto.randomUUID()
            },
            {   name: 'Dark Disco',
                mainImage: '/cards/music/Dark Disco.png',
                genre: ['electronic'],
                youtube: 'link',
                spotify: 'link',
                vkmusic: 'link',
                ymusic: 'link',
                date: "2012-11-22",
                id: crypto.randomUUID()
            },
            {   name: 'Morning Breakfast',
                mainImage: '/cards/music/Morning Breakfast.png',
                genre: ['jazz'],
                youtube: 'link',
                spotify: 'link',
                vkmusic: 'link',
                ymusic: 'link',
                date: "2012-10-22",
                id: crypto.randomUUID()
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