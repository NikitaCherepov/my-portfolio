import { useMutation, useQuery } from '@tanstack/react-query';
import musicService, { Music, CreateMusicData, UpdateMusicData } from '@/app/services/musicService';
export type { Music, CreateMusicData, UpdateMusicData };
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

export function useCreateMusic() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CreateMusicData) => musicService.createMusic(data),
    onSuccess: (newMusic) => {
      // Обновляем кэш со списком музыки
      queryClient.invalidateQueries({ queryKey: ['music'] });

      // Опционально: добавляем новую музыку в кэш
      queryClient.setQueryData(['music'], (oldMusic: Music[] | undefined) => {
        if (!oldMusic) return [newMusic];
        return [newMusic, ...oldMusic];
      });

      toast.success(t('toasts.musicCreated'));
    },
    onError: (error: any) => {
      console.error('Error creating music:', error);
      toast.error(error.error || t('toasts.musicCreateError'));
    },
  });
}

export function useUpdateMusic() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMusicData }) =>
      musicService.updateMusic(id, data),
    onMutate: async ({ id, data }) => {
      // Отменяем любые выходящие запросы для этого трека
      await queryClient.cancelQueries({ queryKey: ['music'] });

      // Получаем предыдущее состояние
      const previousMusic = queryClient.getQueryData<Music[]>(['music']);

      // Оптимистично обновляем трек в кэше
      queryClient.setQueryData(['music'], (oldMusic: Music[] | undefined) => {
        if (!oldMusic) return oldMusic;

        return oldMusic.map((track) =>
          track.id === id
            ? {
                ...track,
                ...data,
                // Не обновляем поля файлов в оптимистичном обновлении
                mainImage: data.mainImage ? track.mainImage : data.mainImage,
              }
            : track
        );
      });

      return { previousMusic };
    },
    onError: (error: any, variables, context) => {
      // Возвращаем предыдущее состояние при ошибке
      if (context?.previousMusic) {
        queryClient.setQueryData(['music'], context.previousMusic);
      }

      console.error('Error updating music:', error);
      toast.error(error.error || t('toasts.musicUpdateError'));
    },
    onSettled: () => {
      // Всегда перезагружаем данные после завершения
      queryClient.invalidateQueries({ queryKey: ['music'] });
    },
    onSuccess: () => {
      toast.success(t('toasts.musicUpdated'));
    },
  });
}

export function useDeleteMusic() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => musicService.deleteMusic(id),
    onMutate: async (id) => {
      // Отменяем любые выходящие запросы
      await queryClient.cancelQueries({ queryKey: ['music'] });

      // Получаем предыдущее состояние
      const previousMusic = queryClient.getQueryData<Music[]>(['music']);

      // Оптимистично удаляем трек из кэша
      queryClient.setQueryData(['music'], (oldMusic: Music[] | undefined) => {
        if (!oldMusic) return oldMusic;
        return oldMusic.filter((track) => track.id !== id);
      });

      return { previousMusic };
    },
    onError: (error: any, variables, context) => {
      // Возвращаем предыдущее состояние при ошибке
      if (context?.previousMusic) {
        queryClient.setQueryData(['music'], context.previousMusic);
      }

      console.error('Error deleting music:', error);
      toast.error(error.error || t('toasts.musicDeleteErrorHook'));
    },
    onSettled: () => {
      // Всегда перезагружаем данные после завершения
      queryClient.invalidateQueries({ queryKey: ['music'] });
    },
    onSuccess: () => {
      toast.success(t('toasts.musicDeletedHook'));
    },
  });
}

export function useMusic(id: string) {
  const {
    data,
    isLoading,
    isSuccess,
    isError
  } = useQuery({
    queryKey: ['music', id],
    queryFn: async () => {
      const music = await musicService.getMusic();
      return music.find(track => track.id === id) || null;
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

// Комбинированный хук для всех операций с музыкой
export function useMusicMutations() {
  const createMusic = useCreateMusic();
  const updateMusic = useUpdateMusic();
  const deleteMusic = useDeleteMusic();

  return {
    createMusic,
    updateMusic,
    deleteMusic,
    isLoading: createMusic.isPending || updateMusic.isPending || deleteMusic.isPending,
  };
}