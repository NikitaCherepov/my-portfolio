import { useQuery } from '@tanstack/react-query';
import musicService, { Music } from '../services/musicService';

export function useMusic() {
  const {
    data,
    isLoading,
    isSuccess,
    refetch,
    isFetching,
    isError
  } = useQuery<Music[]>({
    queryKey: ['music'],
    queryFn: () => musicService.getMusic(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isLoading,
    isSuccess,
    refetch,
    isFetching,
    isError
  };
}

export function useMusicById(id: string) {
  const {
    data,
    isLoading,
    isSuccess,
    isError
  } = useQuery<Music | null>({
    queryKey: ['music', id],
    queryFn: async () => {
      const music = await musicService.getMusic();
      return music.find(item => item.id === id) || null;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  return {
    data,
    isLoading,
    isSuccess,
    isError
  };
}