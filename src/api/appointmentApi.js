import api from './axios';

export const appointmentApi = {
  // Slots
  getSlots: (params = {}) => api.get('/appointments/slots/', { params }),
  createSlot: (data) => api.post('/appointments/slots/', data),
  updateSlot: (id, data) => api.put(`/appointments/slots/${id}/`, data),
  deleteSlot: (id) => api.delete(`/appointments/slots/${id}/`),

  // Bookings
  bookAppointment: (data) => api.post('/appointments/book/', data),
  getAppointments: (params = {}) => api.get('/appointments/', { params }),
  getAppointmentById: (id) => api.get(`/appointments/${id}/`),
  cancelAppointment: (id, reason = '') => api.post(`/appointments/${id}/cancel/`, { reason }),
  updateStatus: (id, status, doctorNotes = '') =>
    api.post(`/appointments/${id}/status/`, { status, doctor_notes: doctorNotes }),
};
