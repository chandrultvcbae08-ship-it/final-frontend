import api from './axios';

export const authApi = {
  login: (credentials) => api.post('/accounts/login/', credentials),
  registerPatient: (data) => api.post('/accounts/register/patient/', data),
  registerDoctor: (data) => api.post('/accounts/register/doctor/', data),
  logout: (refreshToken) => api.post('/accounts/logout/', { refresh: refreshToken }),
  getCurrentUser: () => api.get('/accounts/me/'),
  updateProfile: (data) => api.put('/accounts/me/', data),
  deleteAccount: (data) => api.post('/accounts/delete-account/', data),
};
