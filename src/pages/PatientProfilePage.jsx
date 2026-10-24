import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Calendar, Heart, AlertCircle, CheckCircle2, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';

const PatientProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    date_of_birth: '',
    gender: 'Male',
    blood_group: 'O+',
    address: '',
    emergency_contact: '',
    medical_history: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      const profile = user.patient_profile || {};
      setFormData({
        full_name: user.full_name || '',
        phone: user.phone || '',
        date_of_birth: profile.date_of_birth || '',
        gender: profile.gender || 'Male',
        blood_group: profile.blood_group || 'O+',
        address: profile.address || '',
        emergency_contact: profile.emergency_contact || '',
        medical_history: profile.medical_history || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await authApi.updateProfile(formData);
      updateUser(res.data.user);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '680px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
          Patient Profile
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          Manage your personal identity, contact, emergency details, and clinical health history
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
          {/* Identity & Contact */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '14px' }}>
              Personal Identity
            </h4>

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

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email Address (Read-only)</label>
                <input
                  type="email"
                  className="form-control"
                  value={user?.email || ''}
                  disabled
                  style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Clinical Profile */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '14px' }}>
              Clinical Attributes
            </h4>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  className="form-control"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  name="gender"
                  className="form-control"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select
                  name="blood_group"
                  className="form-control"
                  value={formData.blood_group}
                  onChange={handleChange}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Residential Address</label>
              <input
                type="text"
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Emergency Contact Info</label>
              <input
                type="text"
                name="emergency_contact"
                className="form-control"
                placeholder="Name & Relationship (e.g. Spouse, Guardian + Phone)"
                value={formData.emergency_contact}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Medical History & Allergies</label>
              <textarea
                name="medical_history"
                rows="3"
                className="form-control"
                value={formData.medical_history}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? <span className="spinner" style={{ width: '16px', height: '16px' }} /> : <Save size={16} />}
            Save Profile Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientProfilePage;
