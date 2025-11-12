import { useQuery } from '@tanstack/react-query';
import genresService, { Genre } from '../services/genresService';

export function useGenres() {
  const {
    data,
    isLoading,
    isSuccess,
    refetch,
    isFetching,
    isError
  } = useQuery<Genre[]>({
    queryKey: ['genres'],
    queryFn: () => genresService.getGenres(),
    staleTime: 5 * 60 * 1000,
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

export function useGenre(id: string) {
  const {
    data,
    isLoading,
    isSuccess,
    isError
  } = useQuery<Genre | null>({
    queryKey: ['genres', id],
    queryFn: async () => {
      const genres = await genresService.getGenres();
      return genres.find(genre => genre.id === id) || null;
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