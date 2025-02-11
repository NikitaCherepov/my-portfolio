import {create} from 'zustand'

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
interface SortSitesStore {
    sortBy: string;
    setSortBy: (sortBy: string) => void;
}
export const useSortSitesStore = create<SortSitesStore>((set) => {
    return {
        sortBy: 'newest',
        setSortBy: (sortBy) => set({sortBy}),
    }
})


//Для список/grid
interface ViewGridStore {
    view: 'list' | 'grid';
    toggleView: () => void;
} 



export const useViewStore = create<ViewGridStore>((set) => {
    return {
        view: 'grid',
        toggleView: () => set((state) => ({view: state.view === 'list' ? 'grid' : 'list'}))
    }
})