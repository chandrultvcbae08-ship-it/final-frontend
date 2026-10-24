import React, { useState, useEffect } from 'react';
import { Stethoscope, Building, MapPin, Award, IndianRupee, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { doctorApi } from '../api/doctorApi';
import { useAuth } from '../context/AuthContext';

const DoctorProfilePage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    specialization: 'Cardiologist',
    qualifications: '',
    experience_years: 1,
    hospital_name: '',
    location: '',
    consultation_fee: 500,
    bio: '',
    profile_image: '',
    is_available: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const specializations = [
    'Cardiologist',
    'Dermatologist',
    'Neurologist',
    'Pediatrician',
    'General Physician',
    'Orthopedic',
    'Gynecologist',
    'Ophthalmologist',
    'Psychiatrist',
    'Dentist'
  ];

  useEffect(() => {
    doctorApi.getMyDoctorProfile()
      .then((res) => {
        const d = res.data;
        setFormData({
          full_name: d.full_name || '',
          phone: d.phone || '',
          specialization: d.specialization || 'Cardiologist',
          qualifications: d.qualifications || '',
          experience_years: d.experience_years || 1,
          hospital_name: d.hospital_name || '',
          location: d.location || '',
          consultation_fee: d.consultation_fee || 500,
          bio: d.bio || '',
          profile_image: d.profile_image || '',
          is_available: d.is_available ?? true,
        });
      })
      .catch((err) => {
        setError('Failed to fetch doctor profile details.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);

    try {
      await doctorApi.updateMyDoctorProfile(formData);
      setMessage('Doctor profile updated successfully!');
    } catch (err) {
      setError('Failed to update doctor profile. Please verify your inputs.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', padding: '60px 20px' }}>
        <div className="spinner" style={{ width: '36px', height: '36px' }} />
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '720px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
          Doctor Profile Settings
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          Update your public medical profile, clinical specialization, hospital affiliations, and consultation fees
        </p>
      </div>

      {message && (
        <div className="alert alert-success" style={{ marginBottom: '20px' }}>
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="card" style={{ padding: '32px' }}>
        <form onSubmit={handleSubmit}>
          {/* Identity */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '14px' }}>
              Doctor Identity
            </h4>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="full_name"
                  className="form-control"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Profile Image URL</label>
              <input
                type="url"
                name="profile_image"
                className="form-control"
                placeholder="https://example.com/doctor-photo.jpg"
                value={formData.profile_image}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Credentials & Rates */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '14px' }}>
              Credentials & Clinical Rates
            </h4>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Specialization</label>
                <select
                  name="specialization"
                  className="form-control"
                  value={formData.specialization}
                  onChange={handleChange}
                >
                  {specializations.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Qualifications</label>
                <input
                  type="text"
                  name="qualifications"
                  className="form-control"
                  value={formData.qualifications}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Experience (Years)</label>
                <input
                  type="number"
                  min="0"
                  name="experience_years"
                  className="form-control"
                  value={formData.experience_years}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Consultation Fee (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  name="consultation_fee"
                  className="form-control"
                  value={formData.consultation_fee}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Hospital / Clinic</label>
                <input
                  type="text"
                  name="hospital_name"
                  className="form-control"
                  value={formData.hospital_name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location / City</label>
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Professional Bio</label>
              <textarea
                name="bio"
                rows="3"
                className="form-control"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="is_available"
                name="is_available"
                checked={formData.is_available}
                onChange={handleChange}
                style={{ width: '18px', height: '18px' }}
              />
              <label htmlFor="is_available" style={{ fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                Open for new patient bookings
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={saving}
          >
            {saving ? <span className="spinner" style={{ width: '16px', height: '16px' }} /> : <Save size={16} />}
            Save Profile Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfilePage;
