import { useMutation, useQueryClient } from '@tanstack/react-query';
import sitesService from '@/app/services/sitesService';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

// Типы для данных сайтов
export interface Site {
  id: string;
  name: string;
  mainImage: string;
  directLink: string;
  github: string;
  description: string;
  stack: string[];
  features: string[];
  gallery: string[];
  date: string;
  companyName?: string | null;
  companyUrl?: string | null;
  nameEn?: string | null;
  descriptionEn?: string | null;
  featuresEn?: string[] | null;
  companyNameEn?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSiteData {
  name: string;
  mainImage: File;
  directLink: string;
  github?: string;
  description: string;
  stack: string[];
  features: string[];
  date: string;
  companyName?: string;
  companyUrl?: string;
  nameEn?: string;
  descriptionEn?: string;
  featuresEn?: string[];
  companyNameEn?: string;
  gallery?: File[];
}

export interface UpdateSiteData {
  name?: string;
  mainImage?: File;
  directLink?: string;
  github?: string;
  description?: string;
  stack?: string[];
  features?: string[];
  date?: string;
  companyName?: string;
  companyUrl?: string;
  nameEn?: string;
  descriptionEn?: string;
  featuresEn?: string[];
  companyNameEn?: string;
  gallery?: File[];
  removeGallery?: string[];
}

export function useCreateSite() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CreateSiteData) => sitesService.createSite(data),
    onSuccess: (newSite) => {
      // Обновляем кэш со списком сайтов
      queryClient.invalidateQueries({ queryKey: ['sites'] });

      // Опционально: добавляем новый сайт в кэш
      queryClient.setQueryData(['sites'], (oldSites: Site[] | undefined) => {
        if (!oldSites) return [newSite];
        return [newSite, ...oldSites];
      });

      toast.success(t('toasts.siteCreated'));
    },
    onError: (error: any) => {
      console.error('Error creating site:', error);
      toast.error(error.error || t('toasts.siteCreateError'));
    },
  });
}

export function useUpdateSite() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSiteData }) =>
      sitesService.updateSite(id, data),
    onMutate: async ({ id, data }) => {
      // Отменяем любые выходящие запросы для этого сайта
      await queryClient.cancelQueries({ queryKey: ['sites'] });

      // Получаем предыдущее состояние
      const previousSites = queryClient.getQueryData<Site[]>(['sites']);

      // Оптимистично обновляем сайт в кэше
      queryClient.setQueryData(['sites'], (oldSites: Site[] | undefined) => {
        if (!oldSites) return oldSites;

        return oldSites.map((site) =>
          site.id === id
            ? {
                ...site,
                ...data,
                // Не обновляем поля файлов в оптимистичном обновлении
                mainImage: data.mainImage ? site.mainImage : data.mainImage,
                gallery: data.gallery ? site.gallery : data.gallery,
              }
            : site
        );
      });

      return { previousSites };
    },
    onError: (error: any, variables, context) => {
      // Возвращаем предыдущее состояние при ошибке
      if (context?.previousSites) {
        queryClient.setQueryData(['sites'], context.previousSites);
      }

      console.error('Error updating site:', error);
      toast.error(error.error || t('toasts.siteUpdateError'));
    },
    onSettled: () => {
      // Всегда перезагружаем данные после завершения
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    },
    onSuccess: () => {
      toast.success(t('toasts.siteUpdated'));
    },
  });
}

export function useDeleteSite() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => sitesService.deleteSite(id),
    onMutate: async (id) => {
      // Отменяем любые выходящие запросы
      await queryClient.cancelQueries({ queryKey: ['sites'] });

      // Получаем предыдущее состояние
      const previousSites = queryClient.getQueryData<Site[]>(['sites']);

      // Оптимистично удаляем сайт из кэша
      queryClient.setQueryData(['sites'], (oldSites: Site[] | undefined) => {
        if (!oldSites) return oldSites;
        return oldSites.filter((site) => site.id !== id);
      });

      return { previousSites };
    },
    onError: (error: any, variables, context) => {
      // Возвращаем предыдущее состояние при ошибке
      if (context?.previousSites) {
        queryClient.setQueryData(['sites'], context.previousSites);
      }

      console.error('Error deleting site:', error);
      toast.error(error.error || t('toasts.siteDeleteError'));
    },
    onSettled: () => {
      // Всегда перезагружаем данные после завершения
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    },
    onSuccess: () => {
      toast.success(t('toasts.siteDeleted'));
    },
  });
}

// Комбинированный хук для всех операций с сайтами
export function useSiteMutations() {
  const createSite = useCreateSite();
  const updateSite = useUpdateSite();
  const deleteSite = useDeleteSite();

  return {
    createSite,
    updateSite,
    deleteSite,
    isLoading: createSite.isPending || updateSite.isPending || deleteSite.isPending,
  };
}
