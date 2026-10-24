import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Building,
  MapPin,
  Award,
  Calendar,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Edit
} from 'lucide-react';
import { doctorApi } from '../api/doctorApi';
import { useAuth } from '../context/AuthContext';

const DoctorDetailPage = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imgError, setImgError] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  const { user, isDoctor } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    doctorApi.getDoctorById(id)
      .then((res) => {
        setDoctor(res.data);
        if (res.data.available_slots?.length > 0) {
          // Group by unique dates
          const dates = [...new Set(res.data.available_slots.map(s => s.date))];
          setSelectedDate(dates[0]);
        }
      })
      .catch((err) => {
        setError('Doctor profile not found or unavailable.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', padding: '80px 20px' }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }} />
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div className="alert alert-danger" style={{ maxWidth: '480px', margin: '0 auto 20px' }}>
          {error || 'Doctor not found'}
        </div>
        <Link to="/doctors" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Doctor Directory
        </Link>
      </div>
    );
  }

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.full_name)}&background=2563eb&color=fff&size=200&bold=true`;
  const isOwnerDoctor = isDoctor && user?.doctor_id === doctor.id;

  // Group slots by date
  const slotsByDate = (doctor.available_slots || []).reduce((acc, slot) => {
    acc[slot.date] = acc[slot.date] || [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  const availableDates = Object.keys(slotsByDate).sort();
  const filteredSlots = selectedDate ? (slotsByDate[selectedDate] || []) : [];

  return (
    <div className="page-container">
      {/* Back button */}
      <div style={{ marginBottom: '24px' }}>
        <Link to="/doctors" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          <ArrowLeft size={16} /> Back to Doctor Directory
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        {/* Left Column: Doctor Profile Card */}
        <div>
          <div className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap' }}>
              <img
                src={!imgError && doctor.profile_image ? doctor.profile_image : fallbackAvatar}
                alt={doctor.full_name}
                onError={() => setImgError(true)}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: 'var(--radius-xl)',
                  objectFit: 'cover',
                  border: '3px solid var(--primary-border)',
                  boxShadow: 'var(--shadow-md)'
                }}
              />

              <div style={{ flex: 1, minWidth: '200px' }}>
                <span className="badge badge-specialization" style={{ marginBottom: '8px' }}>
                  {doctor.specialization}
                </span>

                <h1 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '6px' }}>
                  {doctor.full_name.startsWith('Dr.') ? doctor.full_name : `Dr. ${doctor.full_name}`}
                </h1>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  {doctor.qualifications}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '0.9rem', fontWeight: 700 }}>
                  <Star size={16} fill="#f59e0b" />
                  <span>{doctor.rating || '4.8'}</span>
                  <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>({doctor.total_reviews || 15} patient reviews)</span>
                </div>
              </div>
            </div>

            {/* Quick stats grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              backgroundColor: 'var(--bg-main)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '24px',
              border: '1px solid var(--border-color)'
            }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)' }}>Experience</span>
                <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{doctor.experience_years} Years</strong>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)' }}>Consultation Fee</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>₹{parseFloat(doctor.consultation_fee).toFixed(0)}</strong>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)' }}>Hospital</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{doctor.hospital_name}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)' }}>City / Location</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{doctor.location}</span>
              </div>
            </div>

            {/* Doctor Bio */}
            {doctor.bio && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>About Doctor</h4>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {doctor.bio}
                </p>
              </div>
            )}

            {/* Verification badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', backgroundColor: '#ecfdf5', borderRadius: 'var(--radius-md)', border: '1px solid #a7f3d0' }}>
              <ShieldCheck size={20} color="#059669" />
              <div style={{ fontSize: '0.825rem', color: '#065f46' }}>
                <strong>Verified Medical Practitioner</strong>
                <div>Credentials and license validated with MediConnect Medical Council.</div>
              </div>
            </div>

            {isOwnerDoctor && (
              <div style={{ marginTop: '20px' }}>
                <Link to="/doctor/profile" className="btn btn-secondary btn-full">
                  <Edit size={16} /> Edit My Doctor Profile
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Appointment Booking & Slot Picker */}
        <div>
          <div className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Available Appointment Slots</h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-light)' }}>Select a date and time slot to book your visit</p>
              </div>
              <div className="badge badge-accepted">
                {doctor.available_slots?.length || 0} Slots Open
              </div>
            </div>

            {availableDates.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 16px' }}>
                <Clock size={36} color="var(--text-light)" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>No Slots Available</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  This doctor has no available booking slots scheduled currently. Check back later or browse other doctors.
                </p>
              </div>
            ) : (
              <div>
                {/* Date Selection Carousel / Buttons */}
                <div style={{ marginBottom: '24px' }}>
                  <label className="form-label" style={{ marginBottom: '10px' }}>Select Consultation Date</label>
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
                    {availableDates.map((dateStr) => {
                      const d = new Date(dateStr + 'T00:00:00');
                      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                      const dayNum = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                      const isSelected = selectedDate === dateStr;

                      return (
                        <button
                          key={dateStr}
                          type="button"
                          onClick={() => setSelectedDate(dateStr)}
                          style={{
                            padding: '10px 16px',
                            borderRadius: 'var(--radius-md)',
                            border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                            backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                            cursor: 'pointer',
                            textAlign: 'center',
                            minWidth: '84px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: isSelected ? 'var(--primary)' : 'var(--text-light)', textTransform: 'uppercase' }}>
                            {dayName}
                          </span>
                          <span style={{ display: 'block', fontSize: '0.95rem', fontWeight: 800, color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                            {dayNum}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Slots for Selected Date */}
                <div style={{ marginBottom: '28px' }}>
                  <label className="form-label" style={{ marginBottom: '12px' }}>
                    Available Times ({filteredSlots.length} slots on {selectedDate})
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                    {filteredSlots.map((slot) => (
                      <Link
                        key={slot.id}
                        to={`/book/${doctor.id}?slot_id=${slot.id}`}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '12px 10px',
                          borderRadius: 'var(--radius-md)',
                          border: '1.5px solid var(--primary-border)',
                          backgroundColor: '#ffffff',
                          color: 'var(--text-main)',
                          textDecoration: 'none',
                          transition: 'all 0.15s ease',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--primary)';
                          e.currentTarget.style.color = '#ffffff';
                          e.currentTarget.style.borderColor = 'var(--primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#ffffff';
                          e.currentTarget.style.color = 'var(--text-main)';
                          e.currentTarget.style.borderColor = 'var(--primary-border)';
                        }}
                      >
                        <span style={{ fontWeight: 700, fontSize: '0.925rem' }}>
                          {slot.start_time} - {slot.end_time}
                        </span>
                        <span style={{ fontSize: '0.72rem', opacity: 0.85, marginTop: '2px' }}>
                          ₹{parseFloat(slot.consultation_fee).toFixed(0)} • {slot.duration_minutes}m
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontWeight: 600, marginBottom: '4px' }}>
                    <CheckCircle2 size={16} color="var(--success)" /> Instant Booking Guarantee
                  </div>
                  Click any available time slot above to proceed to patient intake and appointment confirmation.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailPage;
