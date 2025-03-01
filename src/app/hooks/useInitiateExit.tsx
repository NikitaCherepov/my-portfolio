import { usePathname, useRouter } from 'next/navigation';
import { useExitStore } from '../store/useExitStore';

export function useInitiateExit() {
    const pathname = usePathname();
    const router = useRouter();
    const { handleExit } = useExitStore();

    return (address: string) => {
        handleExit(pathname, router, address);
    };
}