import { useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '../services/authService';
import Cookies from 'js-cookie';

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ login, password }: { login: string; password: string }) => {
      return authService.login(login, password);
    },
    mutationKey: ['login'],
    onSuccess: (data) => {
      if (data.token) {
        Cookies.set('token', data.token, { expires: 7 });
      }

      queryClient.invalidateQueries({
        queryKey: ['auth'],
      });
      console.log('Успешная авторизация:', data);
    },
    onError: (error) => {
      console.error('Ошибка авторизации:', error);
    }
  });
}