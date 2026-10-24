import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Calendar,
  Clock,
  User,
  Check,
  X,
  FileText,
  AlertCircle,
  PlusCircle,
  CheckCircle2,
  Phone,
  Mail,
  Activity
} from 'lucide-react';
import { appointmentApi } from '../api/appointmentApi';
import CreatePrescriptionModal from '../components/CreatePrescriptionModal';
import PrescriptionModal from '../components/PrescriptionModal';
import { prescriptionApi } from '../api/prescriptionApi';

const DoctorDashboardPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('PENDING');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Prescription modal state
  const [selectedApptForPrescription, setSelectedApptForPrescription] = useState(null);
  const [viewPrescription, setViewPrescription] = useState(null);

  // Status updating state
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchDoctorAppointments = () => {
    setLoading(true);
    appointmentApi.getAppointments()
      .then((res) => {
        setAppointments(res.data);
      })
      .catch((err) => {
        setError('Failed to fetch doctor appointments.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDoctorAppointments();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      setActionLoadingId(id);
      await appointmentApi.updateStatus(id, status);
      fetchDoctorAppointments();
    } catch (err) {
      alert(err.response?.data?.error || `Failed to mark appointment as ${status}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleOpenPrescriptionViewer = async (apptId) => {
    try {
      const res = await prescriptionApi.getPrescriptionByAppointment(apptId);
      setViewPrescription(res.data);
    } catch (err) {
      alert('Prescription not found.');
    }
  };

  const pendingCount = appointments.filter(a => a.status === 'PENDING').length;
  const acceptedCount = appointments.filter(a => a.status === 'ACCEPTED').length;
  const completedCount = appointments.filter(a => a.status === 'COMPLETED').length;

  const filteredAppointments = appointments.filter((appt) => {
    if (activeTab === 'ALL') return true;
    return appt.status === activeTab;
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
            Doctor Dashboard
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            Manage incoming appointment requests, consultations, and patient clinical records
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/doctor/slots" className="btn btn-primary" style={{ gap: '6px' }}>
            <Clock size={16} /> Manage Appointment Slots
          </Link>
          <Link to="/doctor/profile" className="btn btn-outline" style={{ gap: '6px' }}>
            <User size={16} /> My Profile
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--warning)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase' }}>
            Pending Requests
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
            {pendingCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--warning-text)', fontWeight: 600 }}>
            Awaiting your confirmation
          </span>
        </div>

        <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--primary)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase' }}>
            Upcoming Confirmed
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
            {acceptedCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
            Accepted visits
          </span>
        </div>

        <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--success)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase' }}>
            Completed Consultations
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
            {completedCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--success-text)', fontWeight: 600 }}>
            Prescriptions issued
          </span>
        </div>

        <div className="card" style={{ padding: '20px', borderLeft: '4px solid #64748b' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase' }}>
            Total Appts
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
            {appointments.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
            All-time bookings
          </span>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '24px' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '28px',
        overflowX: 'auto',
        paddingBottom: '2px'
      }}>
        {[
          { key: 'PENDING', label: 'Pending Requests' },
          { key: 'ACCEPTED', label: 'Accepted' },
          { key: 'COMPLETED', label: 'Completed' },
          { key: 'CANCELLED', label: 'Cancelled' },
          { key: 'ALL', label: 'All Appointments' }
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          const count = tab.key === 'ALL'
            ? appointments.length
            : appointments.filter(a => a.status === tab.key).length;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
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
              {tab.label}
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
            const isLoadingThis = actionLoadingId === appt.id;

            return (
              <div
                key={appt.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  {/* Patient Info */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="badge badge-role" style={{ fontSize: '0.7rem' }}>Patient</span>
                      <span className={`badge badge-${appt.status.toLowerCase()}`}>{appt.status}</span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '2px 0', color: 'var(--text-main)' }}>
                      {appt.patient_name}
                    </h3>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                      {appt.patient_phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Phone size={14} color="var(--primary)" />
                          <span>{appt.patient_phone}</span>
                        </div>
                      )}
                      {appt.patient_email && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Mail size={14} color="var(--primary)" />
                          <span>{appt.patient_email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Scheduled Slot */}
                  <div style={{
                    backgroundColor: 'var(--bg-main)',
                    padding: '12px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    minWidth: '220px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 700 }}>
                      <Calendar size={16} color="var(--primary)" />
                      <span>{appt.slot_date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      <Clock size={16} color="var(--secondary)" />
                      <span>{appt.slot_start_time?.slice(0, 5)} - {appt.slot_end_time?.slice(0, 5)}</span>
                    </div>
                    <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '8px', paddingTop: '6px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-light)' }}>Fee:</span>
                      <strong>₹{parseFloat(appt.consultation_fee).toFixed(0)}</strong>
                    </div>
                  </div>
                </div>

                {/* Patient notes */}
                {appt.patient_notes && (
                  <div style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
                    <strong style={{ color: 'var(--text-muted)' }}>Symptoms / Patient Reason: </strong>
                    <span style={{ color: 'var(--text-main)' }}>{appt.patient_notes}</span>
                  </div>
                )}

                {/* Doctor notes */}
                {appt.doctor_notes && (
                  <div style={{ backgroundColor: '#eff6ff', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', borderLeft: '3px solid var(--primary)' }}>
                    <strong style={{ color: '#1e40af' }}>Your Clinical Notes: </strong>
                    <span style={{ color: '#1e3a8a' }}>{appt.doctor_notes}</span>
                  </div>
                )}

                {/* Actions */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: '10px',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '14px',
                  marginTop: '4px',
                  flexWrap: 'wrap'
                }}>
                  {appt.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(appt.id, 'ACCEPTED')}
                        className="btn btn-success btn-sm"
                        disabled={isLoadingThis}
                      >
                        <Check size={16} /> Accept Appointment
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(appt.id, 'REJECTED')}
                        className="btn btn-danger-outline btn-sm"
                        disabled={isLoadingThis}
                      >
                        <X size={16} /> Reject Request
                      </button>
                    </>
                  )}

                  {appt.status === 'ACCEPTED' && (
                    <>
                      <button
                        onClick={() => setSelectedApptForPrescription(appt)}
                        className="btn btn-primary btn-sm"
                      >
                        <FileText size={16} /> Complete & Write Prescription
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(appt.id, 'COMPLETED')}
                        className="btn btn-success btn-sm"
                        disabled={isLoadingThis}
                      >
                        <CheckCircle2 size={16} /> Mark Completed
                      </button>
                    </>
                  )}

                  {appt.status === 'COMPLETED' && (
                    <>
                      {appt.has_prescription ? (
                        <button
                          onClick={() => handleOpenPrescriptionViewer(appt.id)}
                          className="btn btn-secondary btn-sm"
                        >
                          <FileText size={16} /> View Prescription
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedApptForPrescription(appt)}
                          className="btn btn-primary btn-sm"
                        >
                          <FileText size={16} /> Add Prescription
                        </button>
                      )}
                    </>
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
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No Appointments in this Category</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 20px', fontSize: '0.9rem' }}>
            You do not have any {activeTab.toLowerCase()} appointment bookings right now.
          </p>
          <Link to="/doctor/slots" className="btn btn-primary">
            Manage Availability Slots
          </Link>
        </div>
      )}

      {/* Create Prescription Modal */}
      {selectedApptForPrescription && (
        <CreatePrescriptionModal
          appointment={selectedApptForPrescription}
          onClose={() => setSelectedApptForPrescription(null)}
          onSuccess={() => {
            fetchDoctorAppointments();
          }}
        />
      )}

      {/* Prescription View Modal */}
      {viewPrescription && (
        <PrescriptionModal
          prescription={viewPrescription}
          onClose={() => setViewPrescription(null)}
        />
      )}
    </div>
  );
};

export default DoctorDashboardPage;
