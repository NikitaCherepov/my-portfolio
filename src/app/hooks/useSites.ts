import { useQuery } from '@tanstack/react-query';
import sitesService from '../services/sitesService';

export function useSites() {
  const {
    data,
    isLoading,
    isSuccess,
    refetch,
    isFetching,
    isError
  } = useQuery({
    queryKey: ['sites'],
    queryFn: () => sitesService.getSites(),
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