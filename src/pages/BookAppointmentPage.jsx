import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Building,
  CreditCard,
  ShieldCheck
} from 'lucide-react';
import { doctorApi } from '../api/doctorApi';
import { appointmentApi } from '../api/appointmentApi';
import { useAuth } from '../context/AuthContext';

const BookAppointmentPage = () => {
  const { doctorId } = useParams();
  const [searchParams] = useSearchParams();
  const slotIdParam = searchParams.get('slot_id');

  const [doctor, setDoctor] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(slotIdParam ? parseInt(slotIdParam) : null);
  const [patientNotes, setPatientNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const { user, isPatient } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    doctorApi.getDoctorById(doctorId)
      .then((res) => {
        setDoctor(res.data);
        if (!selectedSlotId && res.data.available_slots?.length > 0) {
          setSelectedSlotId(res.data.available_slots[0].id);
        }
      })
      .catch((err) => {
        setError('Doctor details could not be loaded.');
      })
      .finally(() => setLoading(false));
  }, [doctorId]);

  const selectedSlot = doctor?.available_slots?.find(s => s.id === selectedSlotId);

  const handleBook = async (e) => {
    e.preventDefault();
    setError('');

    if (!isPatient) {
      setError('Only registered patients can book appointments. Please sign in as a patient.');
      return;
    }

    if (!selectedSlotId) {
      setError('Please select an available appointment slot.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await appointmentApi.bookAppointment({
        slot_id: selectedSlotId,
        patient_notes: patientNotes
      });
      setBookingSuccess(res.data);
    } catch (err) {
      const msg = err.response?.data?.error || 'Unable to complete appointment booking. The slot might already be reserved.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', padding: '80px 20px' }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }} />
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="page-container" style={{ maxWidth: '580px', padding: '60px 20px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '48px 32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#ecfdf5',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.2)'
          }}>
            <CheckCircle2 size={36} />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px', color: '#065f46' }}>
            Appointment Booked!
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Your consultation request has been submitted to <strong>{bookingSuccess.doctor_name}</strong>.
          </p>

          <div style={{
            backgroundColor: 'var(--bg-main)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            textAlign: 'left',
            marginBottom: '28px',
            border: '1px solid var(--border-color)',
            fontSize: '0.9rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-light)' }}>Date & Time:</span>
              <strong>{bookingSuccess.slot_date} at {bookingSuccess.slot_start_time?.slice(0, 5)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-light)' }}>Doctor:</span>
              <span>{bookingSuccess.doctor_name} ({bookingSuccess.doctor_specialization})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-light)' }}>Hospital / Clinic:</span>
              <span>{bookingSuccess.doctor_hospital}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-light)' }}>Status:</span>
              <span className="badge badge-pending">Pending Doctor Confirmation</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-light)' }}>Consultation Fee:</span>
              <strong>₹{parseFloat(bookingSuccess.consultation_fee).toFixed(0)}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
            <Link to="/patient/appointments" className="btn btn-primary">
              View My Appointments
            </Link>
            <Link to="/doctors" className="btn btn-outline">
              Find More Doctors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to={`/doctors/${doctorId}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          <ArrowLeft size={16} /> Back to Doctor Profile
        </Link>
      </div>

      <div className="card" style={{ padding: '36px' }}>
        <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '6px' }}>
          Confirm Doctor Consultation
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
          Please review appointment details and state your symptoms or reason for visit
        </p>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Doctor Summary Header */}
        <div style={{
          display: 'flex',
          gap: '16px',
          backgroundColor: '#eff6ff',
          padding: '18px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--primary-border)',
          marginBottom: '28px',
          alignItems: 'center'
        }}>
          <img
            src={doctor.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.full_name)}&background=2563eb&color=fff&size=160&bold=true`}
            alt={doctor.full_name}
            style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }}
          />
          <div>
            <span className="badge badge-specialization" style={{ fontSize: '0.72rem', marginBottom: '4px' }}>
              {doctor.specialization}
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '2px 0' }}>
              {doctor.full_name.startsWith('Dr.') ? doctor.full_name : `Dr. ${doctor.full_name}`}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {doctor.hospital_name} • {doctor.location}
            </p>
          </div>
        </div>

        <form onSubmit={handleBook}>
          {/* Select Slot */}
          <div className="form-group">
            <label className="form-label">Select Available Time Slot *</label>
            {doctor.available_slots && doctor.available_slots.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
                {doctor.available_slots.map((slot) => {
                  const isSelected = selectedSlotId === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlotId(slot.id)}
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: isSelected ? 'var(--primary)' : 'var(--text-light)' }}>
                        {slot.date}
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                        {slot.start_time} - {slot.end_time}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        ₹{parseFloat(slot.consultation_fee).toFixed(0)} • {slot.duration_minutes}m
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="alert alert-info">
                No slots currently available for this doctor. Please check back later.
              </div>
            )}
          </div>

          {/* Reason for visit */}
          <div className="form-group">
            <label className="form-label">Symptoms / Reason for Consultation</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="e.g. Mild chest discomfort, seasonal allergy symptoms, follow-up on medication..."
              value={patientNotes}
              onChange={(e) => setPatientNotes(e.target.value)}
            />
            <span className="form-hint">Briefly describing your symptoms helps your doctor prepare for the consultation.</span>
          </div>

          {/* Fee & Policy Breakdown */}
          {selectedSlot && (
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Doctor Consultation Fee</span>
                <span style={{ fontWeight: 600 }}>₹{parseFloat(selectedSlot.consultation_fee).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>MediConnect Platform Fee</span>
                <span style={{ color: 'var(--success-text)', fontWeight: 600 }}>₹0 (Complimentary)</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800 }}>
                <span>Total Payable at Clinic</span>
                <span style={{ color: 'var(--primary)' }}>₹{parseFloat(selectedSlot.consultation_fee).toFixed(2)}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={submitting || !selectedSlotId || !doctor.available_slots?.length}
          >
            {submitting ? <span className="spinner" style={{ width: '18px', height: '18px' }} /> : <CreditCard size={18} />}
            Confirm & Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointmentPage;
