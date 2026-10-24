import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, confirmText = 'Confirm', cancelText = 'Cancel', isDanger = false, onConfirm, onClose, loading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} color={isDanger ? 'var(--danger)' : 'var(--warning)'} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{title}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {message}
          </p>
        </div>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-outline" disabled={loading}>
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`}
            disabled={loading}
          >
            {loading ? <span className="spinner" style={{ width: '16px', height: '16px' }} /> : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
