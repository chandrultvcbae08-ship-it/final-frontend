import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Stethoscope, Mail, Lock, Phone, Building, Award, MapPin, IndianRupee, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DoctorRegisterPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    specialization: 'Cardiologist',
    qualifications: '',
    experience_years: 5,
    hospital_name: '',
    location: 'Bangalore',
    consultation_fee: 600,
    bio: '',
    profile_image: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { registerDoctor } = useAuth();
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      await registerDoctor(formData);
      navigate('/doctor/dashboard');
    } catch (err) {
      const errorMsg =
        err.response?.data?.email?.[0] ||
        err.response?.data?.detail ||
        'Doctor registration failed. Please verify your details.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '720px', padding: '40px 20px' }}>
      <div className="card" style={{ padding: '36px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            backgroundColor: '#eff6ff',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Stethoscope size={26} />
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '6px' }}>
            Doctor Registration
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Join MediConnect as a medical practitioner to open appointment schedules and manage clinical consultations
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Account Credentials */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '14px' }}>
              Account Credentials
            </h4>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name (with Dr. prefix) *</label>
                <input
                  type="text"
                  name="full_name"
                  className="form-control"
                  placeholder="e.g. Dr. Rajesh Verma"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="dr.rajesh@hospital.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="form-control"
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: showPassword ? 'var(--primary)' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '2px'
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="+91 98450 12345"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '14px' }}>
              Professional Credentials
            </h4>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Specialization *</label>
                <select
                  name="specialization"
                  className="form-control"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                >
                  {specializations.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Medical Qualifications *</label>
                <input
                  type="text"
                  name="qualifications"
                  className="form-control"
                  placeholder="e.g. MBBS, MD (Cardiology)"
                  value={formData.qualifications}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Experience (Years) *</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  name="experience_years"
                  className="form-control"
                  value={formData.experience_years}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Consultation Fee (₹) *</label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  name="consultation_fee"
                  className="form-control"
                  value={formData.consultation_fee}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Hospital / Clinic Affiliation *</label>
                <input
                  type="text"
                  name="hospital_name"
                  className="form-control"
                  placeholder="e.g. Manipal Hospital, City Heart Care"
                  value={formData.hospital_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Practice Location / City *</label>
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  placeholder="e.g. Bangalore, Indiranagar"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Profile Image URL (Optional)</label>
              <input
                type="url"
                name="profile_image"
                className="form-control"
                placeholder="https://example.com/photo.jpg"
                value={formData.profile_image}
                onChange={handleChange}
              />
              <span className="form-hint">Leave blank to use an automatic professional medical avatar.</span>
            </div>

            <div className="form-group">
              <label className="form-label">Professional Biography & Expertise</label>
              <textarea
                name="bio"
                rows="3"
                className="form-control"
                placeholder="Share your clinical background, areas of clinical expertise, and approach to patient care..."
                value={formData.bio}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
            style={{ marginBottom: '20px' }}
          >
            {loading ? <span className="spinner" style={{ width: '18px', height: '18px' }} /> : <CheckCircle2 size={18} />}
            Register Doctor Account
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Already registered? <Link to="/login" style={{ fontWeight: 700 }}>Doctor Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorRegisterPage;
