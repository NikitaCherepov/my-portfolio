import { useMutation, useQueryClient } from '@tanstack/react-query';
import genresService, { Genre, CreateGenreData, UpdateGenreData } from '@/app/services/genresService';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export function useCreateGenre() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CreateGenreData) => genresService.createGenre(data),
    onSuccess: (newGenre) => {
      queryClient.invalidateQueries({ queryKey: ['genres'] });

      queryClient.setQueryData(['genres'], (oldGenres: Genre[] | undefined) => {
        if (!oldGenres) return [newGenre];
        return [...oldGenres, newGenre].sort((a, b) => a.name.localeCompare(b.name));
      });

      toast.success(t('toasts.genreCreated'));
    },
    onError: (error: any) => {
      console.error('Error creating genre:', error);
      toast.error(error.error || t('toasts.genreCreateError'));
    },
  });
}

export function useUpdateGenre() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGenreData }) =>
      genresService.updateGenre(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['genres'] });

      const previousGenres = queryClient.getQueryData<Genre[]>(['genres']);

      queryClient.setQueryData(['genres'], (oldGenres: Genre[] | undefined) => {
        if (!oldGenres) return oldGenres;

        return oldGenres.map((genre) =>
          genre.id === id
            ? { ...genre, ...data }
            : genre
        );
      });

      return { previousGenres };
    },
    onError: (error: any, variables, context) => {
      if (context?.previousGenres) {
        queryClient.setQueryData(['genres'], context.previousGenres);
      }

      console.error('Error updating genre:', error);
      toast.error(error.error || t('toasts.genreUpdateError'));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['genres'] });
    },
    onSuccess: () => {
      toast.success(t('toasts.genreUpdated'));
    },
  });
}

export function useDeleteGenre() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => genresService.deleteGenre(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['genres'] });

      const previousGenres = queryClient.getQueryData<Genre[]>(['genres']);

      queryClient.setQueryData(['genres'], (oldGenres: Genre[] | undefined) => {
        if (!oldGenres) return oldGenres;
        return oldGenres.filter((genre) => genre.id !== id);
      });

      return { previousGenres };
    },
    onError: (error: any, variables, context) => {
      if (context?.previousGenres) {
        queryClient.setQueryData(['genres'], context.previousGenres);
      }

      console.error('Error deleting genre:', error);

      if (error.count) {
        toast.error(t('toasts.cannotDeleteGenre', { count: error.count }));
      } else {
        toast.error(error.error || t('toasts.genreDeleteError'));
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['genres'] });
    },
    onSuccess: () => {
      toast.success(t('toasts.genreDeletedHook'));
    },
  });
}

export function useGenreMutations() {
  const createGenre = useCreateGenre();
  const updateGenre = useUpdateGenre();
  const deleteGenre = useDeleteGenre();

  return {
    createGenre,
    updateGenre,
    deleteGenre,
    isLoading: createGenre.isPending || updateGenre.isPending || deleteGenre.isPending,
  };
}