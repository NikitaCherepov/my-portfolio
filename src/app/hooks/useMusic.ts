import { useState, useEffect, useCallback } from 'react';
import musicService, { Music, CreateMusicData, UpdateMusicData } from '../services/musicService';
import { toast } from 'sonner';

interface UseMusicReturn {
  music: Music[];
  loading: boolean;
  error: string | null;
  createMusic: (data: CreateMusicData) => Promise<void>;
  updateMusic: (id: string, data: UpdateMusicData) => Promise<void>;
  deleteMusic: (id: string) => Promise<void>;
  refreshMusic: () => Promise<void>;
}

export function useMusic(): UseMusicReturn {
  const [music, setMusic] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMusic = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await musicService.getMusic();
      setMusic(data);
    } catch (err: any) {
      setError(err.error || 'Failed to fetch music');
      toast.error(err.error || 'Failed to fetch music');
    } finally {
      setLoading(false);
    }
  }, []);

  const createMusic = async (data: CreateMusicData) => {
    try {
      const newMusic = await musicService.createMusic(data);
      setMusic(prev => [newMusic, ...prev]);
      toast.success('Музыка успешно добавлена');
    } catch (err: any) {
      const errorMessage = err.error || 'Failed to create music';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateMusic = async (id: string, data: UpdateMusicData) => {
    try {
      const updatedMusic = await musicService.updateMusic(id, data);
      setMusic(prev => prev.map(item =>
        item.id === id ? updatedMusic : item
      ));
      toast.success('Музыка успешно обновлена');
    } catch (err: any) {
      const errorMessage = err.error || 'Failed to update music';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteMusic = async (id: string) => {
    try {
      await musicService.deleteMusic(id);
      setMusic(prev => prev.filter(item => item.id !== id));
      toast.success('Музыка успешно удалена');
    } catch (err: any) {
      const errorMessage = err.error || 'Failed to delete music';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  const refreshMusic = useCallback(async () => {
    await fetchMusic();
  }, [fetchMusic]);

  useEffect(() => {
    fetchMusic();
  }, [fetchMusic]);

  return {
    music,
    loading,
    error,
    createMusic,
    updateMusic,
    deleteMusic,
    refreshMusic
  };
}