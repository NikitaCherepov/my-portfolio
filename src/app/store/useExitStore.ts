"use client";
import {create} from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import {v4 as uuidv4} from 'uuid'

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
                name: 'Лендинг сайта о рыбалке',
                mainImage: '/cards/sites/LandingFirst/mainImage_compressed.webp',
                stack: ['HTML', 'CSS'],
                directLink: 'http://m95392qm.beget.tech/how-to-fish/',
                github: '',
                description: 'Один из самых моих самых первых лэндингов, выполненного для тестового задания.',
                features: ['Дизайн', 'Простота'],
                date: "2022-10-22",
                id: uuidv4()
            },
            {
                name: 'Слайдер',
                mainImage: '/cards/sites/Slider/mainImage.png',
                stack: ['HTML', 'CSS'],
                directLink: 'http://m95392qm.beget.tech/slider/',
                github: '',
                description: 'Диапазонный слайдер с двумя ползунками на чистом HTML/CSS. \n Позволяет изменять масштаб, переключаясь между годами и месяцами.',
                features: ['Простота', 'Два handler-а', "Возможность изменить масштаб"],
                date: "2022-11-23",
                id: uuidv4()
            },
            {
                name: 'Портфолио',
                mainImage: '/cards/sites/Portfolio/mainImage.webp',
                stack: [
                    'React',  
                    'Next.js',  
                    'Framer-motion',  
                    'Zustand',  
                    'Typescript',  
                    'SCSS',
                    'dnd-kit',
                ],                
                directLink: 'google.com',
                github: 'https://github.com/NikitaCherepov/my-portfolio',
                description: "Сайт-портфолио на React и Next.js с анимациями на Framer Motion.\n Плавные переходы между страницами, интерактивные списки и переключатели. Вид карточки при выборе списка/блока динамически анимирован в одном компоненте. Выбранный тип сортировки сохраняется в LocalStorage через Zustand. \n В процессе работы также освоил TypeScript и внедрил типизацию. \nНа странице с музыкой есть компактный плеер.",
                features: ['Множество сложных анимаций', 'Сохранение типа сортировки','Свой музыкальный плеер, который можно перемещать и сворачивать', 'Типизация переменных'],
                date: "2025-03-04",
                id: uuidv4()
            },
            {
                name: 'Rene | Продажа недвижимости',
                mainImage: '/cards/sites/Rene/mainImage.png',
                stack: ['Bubble'],
                directLink: 'https://responsiveagent.bubbleapps.io/version-test/',
                github: '',
                description: 'Платформа для покупки и продажи недвижимости с многоуровневым доступом, организацией встреч и подключением API',
                features: [
                    'Многоуровневый доступ',
                    'Публикация объявлений',
                    'Фильтр + карта',
                    'Запись на встречи',
                    'API-подключения'
                ],
                date: "2022-05-23",
                id: uuidv4()
            }            
        ],
        music: [
            {   name: 'Deep Rain',
                mainImage: '/cards/music/Deep Rain.png',
                genre: ['джаз'],
                youtube: 'https://www.youtube.com/watch?v=NR-NScY6Yps&ab_channel=NikitaCherepov-Topic',
                spotify: 'https://open.spotify.com/album/3aK6vKFPAMnUxgEafugnaE',
                vkmusic: 'https://vk.com/audio-2001199971_130199971',
                ymusic: 'https://music.yandex.ru/album/32946359/track/130292843',
                date: "2024-09-28",
                id: uuidv4(),
                preview: '/music/deeprain.mp3'
            },
            {   name: 'Flow Time',
                mainImage: '/cards/music/Flow Time.png',
                genre: ['lo-fi, chillout'],
                youtube: 'https://www.youtube.com/watch?v=MUaJmpMfO8U&ab_channel=NikitaCherepov-Topic',
                spotify: 'https://open.spotify.com/album/24znzaOF6gYSwsBN0Mvu4W',
                vkmusic: 'https://vk.com/audio-2001601084_133601084',
                ymusic: 'https://music.yandex.ru/album/34933309',
                date: "2025-01-10",
                id: uuidv4(),
                preview: '/music/flowtime.mp3'
            },
            {   name: 'Meeting The Sunset',
                mainImage: '/cards/music/meeting the sunset.png',
                genre: ['chillout'],
                youtube: 'https://www.youtube.com/watch?v=4FoNwWcarYw&ab_channel=NikitaCherepov-Topic',
                spotify: 'https://open.spotify.com/album/4tK5wfGJtLAa1aNasmAsF5',
                vkmusic: 'https://music.yandex.ru/album/34147140',
                ymusic: 'https://music.yandex.ru/album/34147140',
                date: "2024-12-08",
                id: uuidv4(),
                preview: '/music/meetingthesunset.mp3'
            },
            {   name: 'Metal Rogue',
                mainImage: '/cards/music/Metal Rogue.png',
                genre: ['электронная, блюз, рок'],
                youtube: 'https://www.youtube.com/watch?v=SYKF5_SuRvo&ab_channel=NikitaCherepov-Topic',
                spotify: 'https://open.spotify.com/album/1TZbEOQX9RtkdNbbMWqHXq',
                vkmusic: 'https://vk.com/audio-2001205940_132205940',
                ymusic: 'https://music.yandex.ru/album/33974899',
                date: "2024-1-25",
                id: uuidv4(),
                preview: '/music/metalrogue.mp3'
            },
            {   name: 'Fairytale',
                mainImage: '/cards/music/Fairytale.png',
                genre: ['саундтрек'],
                youtube: 'https://www.youtube.com/watch?v=sQVxz-sH210&ab_channel=NikitaCherepov-Topic',
                spotify: 'https://open.spotify.com/track/3fLf7DBfzET6WW6wcATdAJ',
                vkmusic: 'https://vk.com/audio-2001200024_130200024',
                ymusic: 'https://music.yandex.ru/album/32946368/track/130292853',
                date: "2024-09-21",
                id: uuidv4(),
                preview: '/music/fairytale.mp3'
            },
            {   name: 'Childish Dream',
                mainImage: '/cards/music/Childish Dream.png',
                genre: ['симфоническая музыка'],
                youtube: 'https://www.youtube.com/watch?v=3cGkyjPUTME&ab_channel=NikitaCherepov-Topic',
                spotify: 'https://open.spotify.com/album/2rjE9GRQ1HTcoNQSuu3Tps',
                vkmusic: 'https://vk.com/audio-2001915210_131915210',
                ymusic: 'https://music.yandex.ru/album/33834473',
                date: "2024-11-02",
                id: uuidv4(),
                preview: '/music/childishdream.mp3'
            },
            {   name: 'Dark Disco',
                mainImage: '/cards/music/Dark Disco.png',
                genre: ['электронная'],
                youtube: 'https://www.youtube.com/watch?v=ep8yeiLtdg0&ab_channel=NikitaCherepov-Topic',
                spotify: 'https://open.spotify.com/album/6WKImiPluj2K6dOc9jpwWd',
                vkmusic: 'https://vk.com/audio-2001417179_131417179',
                ymusic: 'https://music.yandex.ru/album/33591602',
                date: "2024-10-19",
                id: uuidv4(),
                preview: '/music/darkdisco.mp3'
            },
            {   name: 'Morning Breakfast',
                mainImage: '/cards/music/Morning Breakfast.png',
                genre: ['джаз'],
                youtube: 'https://www.youtube.com/watch?v=WIFeENH9zfg&ab_channel=NikitaCherepov-Topic',
                spotify: 'https://open.spotify.com/album/0wvuRYlgZ2I5BfTyI9jkRP',
                vkmusic: 'https://vk.com/audio-2001128713_133128713',
                ymusic: 'https://music.yandex.ru/album/34465958',
                date: "2024-12-20",
                id: uuidv4(),
                preview: '/music/morningbreakfast.mp3'
            },
            {   name: 'New World Awaits',
                mainImage: '/cards/music/new world awaits.png',
                genre: ['симфоническая'],
                youtube: 'https://www.youtube.com/watch?v=hoYWlzzg4Yo&ab_channel=NikitaCherepov-Topic',
                spotify: 'https://open.spotify.com/album/1E6FitzLYOEzD0alSJUw0U',
                vkmusic: 'https://vk.com/audio-2001307265_132307265',
                ymusic: 'https://music.yandex.ru/album/34034342',
                date: "2024-12-01",
                id: uuidv4(),
                preview: '/music/newworldawaits.mp3'
            },
            {   name: 'Seashore',
                mainImage: '/cards/music/Seashore.webp',
                genre: ['chillout', 'пляжная'],
                youtube: 'https://www.youtube.com/watch?v=QUtvu1lWO0I&ab_channel=NikitaCherepov-Topic',
                spotify: 'https://open.spotify.com/album/71nIo6h186s4Fz2h5ZNIye',
                vkmusic: 'https://vk.com/audio-2001905396_130905396',
                ymusic: 'https://music.yandex.ru/album/33335963/track/131248396',
                date: "2024-10-12",
                id: uuidv4(),
                preview: '/music/seashore.mp3'
            },
            {   name: 'Moon Pole',
                mainImage: '/cards/music/Moon Pole.webp',
                genre: ['поп', "танцевальная"],
                youtube: 'https://www.youtube.com/watch?v=0c5UettvdFE&ab_channel=NikitaCherepov-Topic',
                spotify: 'https://open.spotify.com/album/4ATCpEnujQCu2uDI0RIPVk',
                vkmusic: 'https://vk.com/audio-2001915961_131915961',
                ymusic: 'https://music.yandex.ru/album/33834524',
                date: "2024-11-02",
                id: uuidv4(),
                preview: '/music/moonpole.mp3'
            },
            {   name: 'Nighfall Sky',
                mainImage: '/cards/music/Nightfall Sky.webp',
                genre: ['lo-fi'],
                youtube: 'link',
                spotify: 'link',
                vkmusic: 'link',
                ymusic: 'link',
                date: "2012-10-22",
                id: uuidv4(),
                preview: '/music/nightfallsky.mp3'
            },
            {   name: 'Old Desert Blues',
                mainImage: '/cards/music/Old desert blues.webp',
                genre: ['Альтернатива', "Блюз"],
                youtube: 'https://www.youtube.com/watch?v=J1R03Rj8XUI&ab_channel=NikitaCherepov-Topic',
                spotify: 'https://open.spotify.com/album/5gUpWRlbWdXGxfjiv3K56U',
                vkmusic: 'https://vk.com/audio-2001656283_130656283',
                ymusic: 'https://music.yandex.ru/album/33204488/track/130912338',
                date: "2024-10-05",
                id: uuidv4(),
                preview: '/music/olddesertblues.mp3'
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
  const createAudioElement = (src?: string) => {
    if (typeof Audio === 'undefined') return null;
    const el = new Audio(src ?? '');
    el.preload = 'auto';
    el.crossOrigin = 'anonymous';
    return el;
  };

  const ensureAudio = () => {
    const state = get();
    if (state.audio) return state.audio;
    const el = createAudioElement();
    set({ audio: el });
    return el;
  };

  return {
    audio: createAudioElement(),
    currentSrc: '',
    setAudio: (src) => {
      if (!src) return;
      const audio = ensureAudio();
      if (!audio) return;

      // если новый трек — сбрасываем и подгружаем
      if (!audio.src?.includes(src)) {
        audio.pause();
        audio.src = src;
      }
      audio.preload = 'auto';
      audio.currentTime = 0;
      audio.load();

      set({
        audio,
        currentSrc: src,
        currentTime: 0,
        duration: 0,
        isPlaying: false,
      });
    },
    currentTime: 0,
    setCurrentTime: (currentTime) => set({ currentTime }),
    isPlaying: false,
    play: async () => {
      const state = get();
      const audio = ensureAudio();
      if (!audio) return;

      if (state.duration && state.currentTime >= state.duration) {
        audio.currentTime = 0;
      }

      const MIN_BUFFER_SEC = 1.5;

      const hasBuffered = () => {
        if (!audio.buffered?.length) return false;
        const end = audio.buffered.end(audio.buffered.length - 1);
        return end - audio.currentTime >= MIN_BUFFER_SEC;
      };

      const start = async () => {
        try {
          await audio.play();
          set({ isPlaying: true });
          return true;
        } catch (err) {
          console.warn('Audio play failed', err);
          return false;
        }
      };

      if (audio.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && hasBuffered()) {
        await start();
        return;
      }

      let started = false;
      const tryStart = async () => {
        if (started) return;
        if (!hasBuffered()) return;
        started = await start();
      };

      audio.addEventListener('canplay', tryStart);
      audio.addEventListener('progress', tryStart);
      audio.addEventListener('canplaythrough', tryStart);

      setTimeout(async () => {
        if (!started && hasBuffered()) {
          await start();
        }
        audio.removeEventListener('canplay', tryStart);
        audio.removeEventListener('progress', tryStart);
        audio.removeEventListener('canplaythrough', tryStart);
      }, 3000);
    },
    pause: () => {
      const state = get();
      if (state.audio) state.audio.pause();
      if (state.isPlaying) set({ isPlaying: false });
    },
    duration: 0,
    setDuration: (duration) => set({ duration: duration ?? 0 }),
    name: '',
    setName: (name) => set({ name }),
  };
});
