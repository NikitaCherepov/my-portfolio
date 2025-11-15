import axios from 'axios';
import Cookies from 'js-cookie';

export interface Genre {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Music {
  id: string;
  name: string;
  mainImage: string;
  youtube: string;
  spotify: string;
  vkmusic: string;
  ymusic: string;
  preview: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  genreId: string;
  genre: Genre;
}

export interface CreateMusicData {
  name: string;
  mainImage: File;
  genreId: string;
  youtube?: string;
  spotify?: string;
  vkmusic?: string;
  ymusic?: string;
  preview?: string | File;
  date: string;
}

export interface UpdateMusicData {
  name?: string;
  mainImage?: File;
  genreId?: string;
  youtube?: string;
  spotify?: string;
  vkmusic?: string;
  ymusic?: string;
  preview?: string | File;
  date?: string;
}

class MusicService {
  private getAuthHeaders() {
    const token = Cookies.get('token');
    return {
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async getMusic(): Promise<Music[]> {
    try {
      const response = await axios.get(`/api/music`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching music:', error);
      throw error;
    }
  }

  async createMusic(data: CreateMusicData): Promise<Music> {
    try {
      const formData = new FormData();

      // Добавляем текстовые поля
      formData.append('name', data.name);
      formData.append('genreId', data.genreId);
      formData.append('youtube', data.youtube || '');
      formData.append('spotify', data.spotify || '');
      formData.append('vkmusic', data.vkmusic || '');
      formData.append('ymusic', data.ymusic || '');
      formData.append('preview', data.preview || '');
      formData.append('date', data.date);

      // Добавляем файл обложки
      formData.append('mainImage', data.mainImage);

      const response = await axios.post('/api/music', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...this.getAuthHeaders(),
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error creating music:', error);
      throw error.response?.data || { error: 'Failed to create music' };
    }
  }

  async updateMusic(id: string, data: UpdateMusicData): Promise<Music> {
    try {
      const formData = new FormData();

      // Добавляем текстовые поля, если они есть
      if (data.name !== undefined) formData.append('name', data.name);
      if (data.genreId !== undefined) formData.append('genreId', data.genreId);
      if (data.youtube !== undefined) formData.append('youtube', data.youtube);
      if (data.spotify !== undefined) formData.append('spotify', data.spotify);
      if (data.vkmusic !== undefined) formData.append('vkmusic', data.vkmusic);
      if (data.ymusic !== undefined) formData.append('ymusic', data.ymusic);
      if (data.preview !== undefined) formData.append('preview', data.preview);
      if (data.date !== undefined) formData.append('date', data.date);

      // Добавляем файл обложки, если он есть
      if (data.mainImage !== undefined) {
        formData.append('mainImage', data.mainImage);
      }

      const response = await axios.put(`/api/music/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...this.getAuthHeaders(),
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error updating music:', error);
      throw error.response?.data || { error: 'Failed to update music' };
    }
  }

  async deleteMusic(id: string): Promise<{ message: string }> {
    try {
      const response = await axios.delete(`/api/music/${id}`, {
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error: any) {
      console.error('Error deleting music:', error);
      throw error.response?.data || { error: 'Failed to delete music' };
    }
  }
}

const musicService = new MusicService();
export default musicService;