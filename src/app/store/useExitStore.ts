"use client";
import {create} from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'

//Для переключения между страниц
interface ExitStore {
    isLeaving: boolean;
    handleExit: (currentPath: string, router: any, path: string) => void;
    turnOffLeaving: () => void
}

export const useExitStore = create<ExitStore>((set) => {

    return {
        isLeaving: false,
        handleExit: (currentPath, router, newPath: string) => {
            if (currentPath != newPath) {
                set({isLeaving: true});
                setTimeout(() => {
                    router.push(newPath);
                }, 500)
            }
        },
        turnOffLeaving: () => {
            set({isLeaving: false})
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

interface SortSitesStore {
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
                    active: false
                },
                {
                    name: 'По названию',
                    type: 'nameFromA',
                    rotate: true,
                    position: 3,
                    initialPosition:3,
                    active: false
                },
                {
                    name: 'По названию',
                    type: 'nameFromZ',
                    rotate: false,
                    position: 4,
                    initialPosition:4,
                    active: false
                },
                {
                    name: 'По стеку',
                    type: 'complex',
                    rotate: true,
                    position: 5,
                    initialPosition:5,
                    active: false
                },
                {
                    name: 'По стеку',
                    type: 'easiest',
                    rotate: false,
                    position: 6,
                    initialPosition:6,
                    active: false
                }
            ],
            music: [
                {
                    name: 'По дате',
                    type: 'newest',
                    rotate: true,
                    position: 1,
                    initialPosition:1,
                    active: true
                },
                {
                    name: 'По дате',
                    type: 'oldest',
                    rotate: false,
                    position: 2,
                    initialPosition:2,
                    active: false
                },
                {
                    name: 'По названию',
                    type: 'nameFromA',
                    rotate: true,
                    position: 3,
                    initialPosition:3,
                    active: false
                },
                {
                    name: 'По названию',
                    type: 'nameFromZ',
                    rotate: false,
                    position: 4,
                    initialPosition:4,
                    active: false
                },
                {
                    name: 'По жанру',
                    type: 'genreFromA',
                    rotate: true,
                    position: 5,
                    initialPosition:5,
                    active: false
                },
                {
                    name: 'По жанру',
                    type: 'genreFromZ',
                    rotate: false,
                    position: 6,
                    initialPosition:6,
                    active: false
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