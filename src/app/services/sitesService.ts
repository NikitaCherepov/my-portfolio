import axios from 'axios';

class SitesService {
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
}

const sitesService = new SitesService();
export default sitesService;