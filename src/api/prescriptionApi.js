import api from './axios';

export const prescriptionApi = {
  getPrescriptions: () => api.get('/prescriptions/'),
  getPrescriptionById: (id) => api.get(`/prescriptions/${id}/`),
  getPrescriptionByAppointment: (appointmentId) =>
    api.get(`/prescriptions/appointment/${appointmentId}/`),
  createPrescription: (data) => api.post('/prescriptions/', data),
};
