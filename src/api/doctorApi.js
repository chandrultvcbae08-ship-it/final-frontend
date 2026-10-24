import api from './axios';

export const doctorApi = {
  getDoctors: (params = {}) => api.get('/doctors/', { params }),
  getDoctorById: (id) => api.get(`/doctors/${id}/`),
  getSpecializations: () => api.get('/doctors/specializations/'),
  getMyDoctorProfile: () => api.get('/doctors/profile/'),
  updateMyDoctorProfile: (data) => api.put('/doctors/profile/', data),
};
