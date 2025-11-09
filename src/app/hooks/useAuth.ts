import { useQuery } from '@tanstack/react-query';
import authService from '../services/authService';

export function useAuth() {
  const {
    data,
    isLoading,
    isSuccess,
    refetch,
    isError,
    error
  } = useQuery({
    queryKey: ['auth'],
    queryFn: () => authService.checkAuth(),
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isLoading,
    isSuccess,
    isAuthenticated: data?.authenticated || false,
    user: data?.user || null,
    refetch,
    isError,
    error
  };
}