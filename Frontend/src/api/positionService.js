import axiosClient from './axiosClient';

const formatPayload = (data) => ({
  title: (data.title || '').trim(),
});

export const positionService = {
  getAll: async () => {
    const res = await axiosClient.get('/positions');
    return Array.isArray(res) ? res : (res?.data || []);
  },

  getById: async (id) => {
    const res = await axiosClient.get(`/positions/${id}`);
    return res?.data || res;
  },

  create: async (data) => {
    return await axiosClient.post('/positions', formatPayload(data));
  },

  update: async (id, data) => {
    return await axiosClient.put(`/positions/${id}`, formatPayload(data));
  },

  delete: async (id) => {
    return await axiosClient.delete(`/positions/${id}`);
  },
};

export default positionService;
