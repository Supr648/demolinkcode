import axiosClient from './axiosClient';

export const orderApi = {
  create: (data) => axiosClient.post('/orders', data),
  getMyOrders: () => axiosClient.get('/orders/my-orders'),
  getAdminOrders: () => axiosClient.get('/admin/orders'),
  updateStatus: (id, status) => axiosClient.patch(`/admin/orders/${id}/status`, { status }),
};
