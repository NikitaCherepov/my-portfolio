import axios from 'axios';
import Cookies from 'js-cookie';

class AuthService {
  BASE_URL = '/api';

  async login(login: string, password: string) {
    try {
      const response = await axios.post(`${this.BASE_URL}/auth/login`, {
        login,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Ошибка авторизации:', error);
      throw error.response?.data || { error: 'Ошибка сети' };
    }
  }

  async checkAuth() {
    try {
      const token = Cookies.get('token');

      if (!token) {
        return { authenticated: false, error: 'Токен отсутствует' };
      }

      const response = await axios.get(`${this.BASE_URL}/auth/check`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('Ошибка проверки аутентификации:', error);
      return { authenticated: false, error: error.response?.data?.error || 'Ошибка сети' };
    }
  }

  async logout() {
    try {
      Cookies.remove('token');
      console.log('Токен удален из cookies');
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  }
}

const authService = new AuthService();
export default authService;