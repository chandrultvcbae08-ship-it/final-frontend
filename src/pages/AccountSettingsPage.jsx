import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  ShieldAlert,
  Lock,
  Trash2,
  AlertCircle,
  CheckCircle2,
  FileText,
  AlertTriangle,
  UserCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import ConfirmModal from '../components/ConfirmModal';

const AccountSettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmCheckbox, setConfirmCheckbox] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Deletion Modal
  const [showModal, setShowModal] = useState(false);

  const handleOpenDeleteModal = (e) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Please provide your current account password to authorize deletion.');
      return;
    }

    if (!confirmCheckbox) {
      setError('You must confirm that you understand the medical compliance retention policy.');
      return;
    }

    setShowModal(true);
  };

  const handleConfirmAccountDeletion = async () => {
    try {
      setLoading(true);
      setError('');
      await authApi.deleteAccount({
        password,
        confirmation: true
      });
      // Logout client state
      await logout();
      alert('Your account has been deactivated and deleted. Your medical records remain archived in accordance with healthcare compliance.');
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.password?.[0] ||
        err.response?.data?.error ||
        'Password verification failed. Account could not be deleted.'
      );
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '680px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
          Account Settings
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          Manage your security settings, active credentials, and account lifecycle
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Account Info Card */}
      <div className="card" style={{ padding: '28px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>
          Account Information
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '0.9rem' }}>
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)' }}>Account Email</span>
            <strong>{user?.email}</strong>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)' }}>Account Role</span>
            <span className="badge badge-role" style={{ marginTop: '2px' }}>{user?.role}</span>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)' }}>Account Name</span>
            <span>{user?.full_name}</span>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)' }}>Status</span>
            <span className="badge badge-completed" style={{ marginTop: '2px' }}>Active</span>
          </div>
        </div>
      </div>

      {/* Danger Zone: Delete / Deactivate Account */}
      <div className="card" style={{ padding: '28px', border: '1.5px solid var(--danger-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: 'var(--danger)' }}>
          <ShieldAlert size={22} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
            Delete / Deactivate Account
          </h3>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
          Once your account is deleted, your active access and refresh tokens will be immediately invalidated and you will not be able to log in again.
        </p>

        {/* Regulatory & Retention Policy Disclosure */}
        <div style={{
          backgroundColor: '#fff1f2',
          borderLeft: '4px solid var(--danger)',
          borderRadius: 'var(--radius-sm)',
          padding: '14px 18px',
          marginBottom: '24px',
          fontSize: '0.85rem',
          color: '#881337',
          lineHeight: 1.5
        }}>
          <strong style={{ display: 'block', marginBottom: '4px' }}>Medical Record Retention Policy:</strong>
          In compliance with healthcare regulations and medical governance laws, existing consultations, past prescriptions, and audit logs are legally retained in an encrypted, archived state. Soft-deletion prevents accidental destruction of vital health records required by other patients or medical providers.
        </div>

        <form onSubmit={handleOpenDeleteModal}>
          <div className="form-group">
            <label className="form-label" htmlFor="del-pass">
              Confirm Current Password *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="del-pass"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Enter your password to verify ownership"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '40px', paddingRight: '40px' }}
              />
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
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

          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <input
              type="checkbox"
              id="confirm-del"
              checked={confirmCheckbox}
              onChange={(e) => setConfirmCheckbox(e.target.checked)}
              style={{ width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer' }}
              required
            />
            <label htmlFor="confirm-del" style={{ fontSize: '0.85rem', color: 'var(--text-main)', cursor: 'pointer', lineHeight: 1.4 }}>
              I understand that account deletion is permanent, my active tokens will be revoked, and I will be logged out immediately.
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-danger btn-full"
            style={{ gap: '8px' }}
          >
            <Trash2 size={16} /> Request Account Deletion
          </button>
        </form>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showModal}
        title="Final Account Deletion Confirmation"
        message={`Are you absolutely sure you want to delete the account associated with ${user?.email}? This action cannot be undone.`}
        confirmText="Yes, Deactivate & Delete"
        cancelText="Keep Account"
        isDanger={true}
        loading={loading}
        onConfirm={handleConfirmAccountDeletion}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default AccountSettingsPage;
