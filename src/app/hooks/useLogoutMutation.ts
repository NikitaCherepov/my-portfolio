import { useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '../services/authService';

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return authService.logout();
    },
    mutationKey: ['logout'],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['auth'],
      });
      queryClient.clear();
      console.log('Успешный выход');
    },
    onError: (error) => {
      console.error('Ошибка выхода:', error);
    }
  });
}