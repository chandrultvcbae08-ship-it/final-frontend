import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Building,
  FileText,
  XCircle,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  ChevronRight
} from 'lucide-react';
import { appointmentApi } from '../api/appointmentApi';
import { prescriptionApi } from '../api/prescriptionApi';
import PrescriptionModal from '../components/PrescriptionModal';
import ConfirmModal from '../components/ConfirmModal';

const PatientAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [loadingPrescription, setLoadingPrescription] = useState(false);

  // Cancellation Modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelingApptId, setCancelingApptId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchAppointments = () => {
    setLoading(true);
    appointmentApi.getAppointments()
      .then((res) => {
        setAppointments(res.data);
      })
      .catch((err) => {
        setError('Failed to fetch your appointments. Please ensure backend is active.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleOpenCancel = (id) => {
    setCancelingApptId(id);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancelingApptId) return;
    try {
      setCancelLoading(true);
      await appointmentApi.cancelAppointment(cancelingApptId, 'Cancelled by patient');
      setCancelModalOpen(false);
      setCancelingApptId(null);
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel appointment');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleViewPrescription = async (apptId) => {
    try {
      setLoadingPrescription(true);
      const res = await prescriptionApi.getPrescriptionByAppointment(apptId);
      setSelectedPrescription(res.data);
    } catch (err) {
      alert('Prescription details not available for this appointment.');
    } finally {
      setLoadingPrescription(false);
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    if (activeTab === 'ALL') return true;
    return appt.status === activeTab;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge badge-pending">Pending Confirmation</span>;
      case 'ACCEPTED':
        return <span className="badge badge-accepted">Confirmed</span>;
      case 'COMPLETED':
        return <span className="badge badge-completed">Completed</span>;
      case 'CANCELLED':
        return <span className="badge badge-cancelled">Cancelled</span>;
      case 'REJECTED':
        return <span className="badge badge-rejected">Rejected</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="page-container">
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
            My Appointments
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            Track and manage your scheduled doctor consultations and medical prescriptions
          </p>
        </div>

        <Link to="/doctors" className="btn btn-primary" style={{ gap: '8px' }}>
          <Stethoscope size={18} /> Book New Appointment
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '24px' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs Filter */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '28px',
        overflowX: 'auto',
        paddingBottom: '2px'
      }}>
        {['ALL', 'ACCEPTED', 'PENDING', 'COMPLETED', 'CANCELLED'].map((tab) => {
          const isActive = activeTab === tab;
          const count = tab === 'ALL'
            ? appointments.length
            : appointments.filter(a => a.status === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 18px',
                border: 'none',
                background: 'none',
                fontWeight: 700,
                fontSize: '0.875rem',
                color: isActive ? 'var(--primary)' : 'var(--text-light)',
                borderBottom: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
              <span style={{
                fontSize: '0.75rem',
                backgroundColor: isActive ? '#eff6ff' : '#f1f5f9',
                color: isActive ? 'var(--primary)' : 'var(--text-light)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)'
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 20px' }}>
          <div className="spinner" style={{ width: '36px', height: '36px' }} />
        </div>
      )}

      {/* Appointments List */}
      {!loading && filteredAppointments.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredAppointments.map((appt) => {
            const isCancellable = ['PENDING', 'ACCEPTED'].includes(appt.status);
            const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(appt.doctor_name || 'Dr')}&background=2563eb&color=fff&size=160&bold=true`;

            return (
              <div
                key={appt.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  borderLeft: appt.status === 'ACCEPTED' ? '4px solid var(--primary)' :
                    appt.status === 'COMPLETED' ? '4px solid var(--success)' :
                    appt.status === 'PENDING' ? '4px solid var(--warning)' : '4px solid #cbd5e1'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  {/* Doctor Info */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <img
                      src={appt.doctor_profile_image || fallbackAvatar}
                      alt={appt.doctor_name}
                      style={{
                        width: '68px',
                        height: '68px',
                        borderRadius: 'var(--radius-lg)',
                        objectFit: 'cover',
                        border: '2px solid var(--border-color)',
                        flexShrink: 0
                      }}
                    />

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="badge badge-specialization" style={{ fontSize: '0.72rem' }}>
                          {appt.doctor_specialization}
                        </span>
                        {getStatusBadge(appt.status)}
                      </div>

                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '2px 0' }}>
                        {appt.doctor_name?.startsWith('Dr.') ? appt.doctor_name : `Dr. ${appt.doctor_name}`}
                      </h3>

                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {appt.doctor_hospital}
                      </p>
                    </div>
                  </div>

                  {/* Date & Time block */}
                  <div style={{
                    backgroundColor: 'var(--bg-main)',
                    padding: '12px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    minWidth: '220px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      <Calendar size={16} color="var(--primary)" />
                      <span>{appt.slot_date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      <Clock size={16} color="var(--secondary)" />
                      <span>{appt.slot_start_time?.slice(0, 5)} - {appt.slot_end_time?.slice(0, 5)}</span>
                    </div>
                    <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '8px', paddingTop: '6px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-light)' }}>Fee:</span>
                      <strong style={{ color: 'var(--text-main)' }}>₹{parseFloat(appt.consultation_fee).toFixed(0)}</strong>
                    </div>
                  </div>
                </div>

                {/* Symptoms / Notes */}
                {appt.patient_notes && (
                  <div style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Symptoms / Patient Notes: </span>
                    <span style={{ color: 'var(--text-main)' }}>{appt.patient_notes}</span>
                  </div>
                )}

                {/* Doctor Notes if completed or updated */}
                {appt.doctor_notes && (
                  <div style={{ backgroundColor: '#eff6ff', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', borderLeft: '3px solid var(--primary)' }}>
                    <span style={{ fontWeight: 600, color: '#1e40af' }}>Doctor's Clinical Remarks: </span>
                    <span style={{ color: '#1e3a8a' }}>{appt.doctor_notes}</span>
                  </div>
                )}

                {/* Card Actions Footer */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: '12px',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '14px',
                  marginTop: '4px'
                }}>
                  {appt.has_prescription && (
                    <button
                      onClick={() => handleViewPrescription(appt.id)}
                      className="btn btn-secondary btn-sm"
                      disabled={loadingPrescription}
                    >
                      <FileText size={16} /> View Prescription
                    </button>
                  )}

                  {isCancellable && (
                    <button
                      onClick={() => handleOpenCancel(appt.id)}
                      className="btn btn-danger-outline btn-sm"
                    >
                      <XCircle size={16} /> Cancel Appointment
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredAppointments.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#eff6ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Calendar size={28} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No Appointments Found</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 20px', fontSize: '0.9rem' }}>
            {activeTab === 'ALL'
              ? "You don't have any appointments booked yet. Browse our doctor directory to book your consultation."
              : `You have no ${activeTab.toLowerCase()} appointments.`}
          </p>
          <Link to="/doctors" className="btn btn-primary">
            Find Doctors & Book
          </Link>
        </div>
      )}

      {/* Prescription Viewer Modal */}
      {selectedPrescription && (
        <PrescriptionModal
          prescription={selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
        />
      )}

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={cancelModalOpen}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this appointment? Your reserved slot will be released for other patients."
        confirmText="Yes, Cancel Appointment"
        cancelText="Keep Appointment"
        isDanger={true}
        loading={cancelLoading}
        onConfirm={handleConfirmCancel}
        onClose={() => setCancelModalOpen(false)}
      />
    </div>
  );
};

export default PatientAppointmentsPage;
