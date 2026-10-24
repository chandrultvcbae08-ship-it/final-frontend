import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// 16 Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PatientRegisterPage from './pages/PatientRegisterPage';
import DoctorRegisterPage from './pages/DoctorRegisterPage';
import DoctorsListingPage from './pages/DoctorsListingPage';
import DoctorDetailPage from './pages/DoctorDetailPage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import PatientAppointmentsPage from './pages/PatientAppointmentsPage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import DoctorSlotsPage from './pages/DoctorSlotsPage';
import PrescriptionsListPage from './pages/PrescriptionsListPage';
import PatientProfilePage from './pages/PatientProfilePage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/doctors" element={<DoctorsListingPage />} />
              <Route path="/doctors/:id" element={<DoctorDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register/patient" element={<PatientRegisterPage />} />
              <Route path="/register/doctor" element={<DoctorRegisterPage />} />

              {/* Patient Protected Routes */}
              <Route
                path="/book/:doctorId"
                element={
                  <ProtectedRoute allowedRoles={['PATIENT']}>
                    <BookAppointmentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient/appointments"
                element={
                  <ProtectedRoute allowedRoles={['PATIENT']}>
                    <PatientAppointmentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient/profile"
                element={
                  <ProtectedRoute allowedRoles={['PATIENT']}>
                    <PatientProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Doctor Protected Routes */}
              <Route
                path="/doctor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['DOCTOR']}>
                    <DoctorDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/slots"
                element={
                  <ProtectedRoute allowedRoles={['DOCTOR']}>
                    <DoctorSlotsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/profile"
                element={
                  <ProtectedRoute allowedRoles={['DOCTOR']}>
                    <DoctorProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Common Authenticated Routes */}
              <Route
                path="/prescriptions"
                element={
                  <ProtectedRoute>
                    <PrescriptionsListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <AccountSettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
