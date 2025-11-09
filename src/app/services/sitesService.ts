import axios from 'axios';
import Cookies from 'js-cookie';

class SitesService {
  private getAuthHeaders() {
    const token = Cookies.get('token');
    return {
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async getSites() {
    try {
      const response = await axios.get(`/api/sites`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createSite(data: {
    name: string;
    mainImage: File;
    directLink: string;
    github?: string;
    description: string;
    stack: string[];
    features: string[];
    date: string;
    gallery?: File[];
  }) {
    try {
      const formData = new FormData();

      // Добавляем текстовые поля
      formData.append('name', data.name);
      formData.append('directLink', data.directLink);
      formData.append('github', data.github || '');
      formData.append('description', data.description);
      formData.append('stack', JSON.stringify(data.stack));
      formData.append('features', JSON.stringify(data.features));
      formData.append('date', data.date);

      // Добавляем файлы
      formData.append('mainImage', data.mainImage);

      if (data.gallery && data.gallery.length > 0) {
        data.gallery.forEach((file) => {
          formData.append('gallery', file);
        });
      }

      const response = await axios.post('/api/sites', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...this.getAuthHeaders(),
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error creating site:', error);
      throw error.response?.data || { error: 'Failed to create site' };
    }
  }

  async updateSite(id: string, data: {
    name?: string;
    mainImage?: File;
    directLink?: string;
    github?: string;
    description?: string;
    stack?: string[];
    features?: string[];
    date?: string;
    gallery?: File[];
    removeGallery?: string[];
  }) {
    try {
      const formData = new FormData();

      // Добавляем текстовые поля, если они есть
      if (data.name !== undefined) formData.append('name', data.name);
      if (data.directLink !== undefined) formData.append('directLink', data.directLink);
      if (data.github !== undefined) formData.append('github', data.github);
      if (data.description !== undefined) formData.append('description', data.description);
      if (data.stack !== undefined) formData.append('stack', JSON.stringify(data.stack));
      if (data.features !== undefined) formData.append('features', JSON.stringify(data.features));
      if (data.date !== undefined) formData.append('date', data.date);
      if (data.removeGallery !== undefined) formData.append('removeGallery', JSON.stringify(data.removeGallery));

      // Добавляем файлы, если они есть
      if (data.mainImage !== undefined) {
        formData.append('mainImage', data.mainImage);
      }

      if (data.gallery && data.gallery.length > 0) {
        data.gallery.forEach((file) => {
          formData.append('gallery', file);
        });
      }

      const response = await axios.put(`/api/sites/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...this.getAuthHeaders(),
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error updating site:', error);
      throw error.response?.data || { error: 'Failed to update site' };
    }
  }

  async deleteSite(id: string) {
    try {
      const response = await axios.delete(`/api/sites/${id}`, {
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error: any) {
      console.error('Error deleting site:', error);
      throw error.response?.data || { error: 'Failed to delete site' };
    }
  }
}

const sitesService = new SitesService();
export default sitesService;