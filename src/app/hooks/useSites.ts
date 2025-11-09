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

export function useSite(id: string) {
  const {
    data,
    isLoading,
    isSuccess,
    isError
  } = useQuery({
    queryKey: ['sites', id],
    queryFn: async () => {
      const sites = await sitesService.getSites();
      return sites.find(site => site.id === id) || null;
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