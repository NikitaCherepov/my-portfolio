import axios from 'axios';
import Cookies from 'js-cookie';

export interface Genre {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGenreData {
  name: string;
  description?: string;
}

export interface UpdateGenreData {
  name?: string;
  description?: string;
}

class GenresService {
  private getAuthHeaders() {
    const token = Cookies.get('token');
    return {
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async getGenres(): Promise<Genre[]> {
    try {
      const response = await axios.get(`/api/genres`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw error;
    }
  }

  async createGenre(data: CreateGenreData): Promise<Genre> {
    try {
      const response = await axios.post('/api/genres', data, {
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error creating genre:', error);
      throw error.response?.data || { error: 'Failed to create genre' };
    }
  }

  async updateGenre(id: string, data: UpdateGenreData): Promise<Genre> {
    try {
      const response = await axios.put(`/api/genres/${id}`, data, {
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error updating genre:', error);
      throw error.response?.data || { error: 'Failed to update genre' };
    }
  }

  async deleteGenre(id: string): Promise<{ message: string }> {
    try {
      const response = await axios.delete(`/api/genres/${id}`, {
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error: any) {
      console.error('Error deleting genre:', error);
      throw error.response?.data || { error: 'Failed to delete genre' };
    }
  }
}

const genresService = new GenresService();
export default genresService;