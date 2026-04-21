import axiosClient from './axiosClient';

const systemConfigService = {
  getAll: async () => {
    return await axiosClient.get('/system-configs');
  },

  updateMany: async (items) => {
    return await axiosClient.put('/system-configs', { items });
  }
};

export default systemConfigService;
