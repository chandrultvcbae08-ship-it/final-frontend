import React, { useState } from 'react';
import { X, Plus, Trash2, HeartPulse, Send } from 'lucide-react';
import { prescriptionApi } from '../api/prescriptionApi';

const CreatePrescriptionModal = ({ appointment, onClose, onSuccess }) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([
    { medicine_name: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!appointment) return null;

  const handleAddItem = () => {
    setItems([
      ...items,
      { medicine_name: '', dosage: '', frequency: '', duration: '', instructions: '' }
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!diagnosis.trim()) {
      setError('Please provide a clinical diagnosis.');
      return;
    }

    const validItems = items.filter(i => i.medicine_name.trim());
    if (validItems.length === 0) {
      setError('Please add at least one medication.');
      return;
    }

    try {
      setLoading(true);
      await prescriptionApi.createPrescription({
        appointment: appointment.id,
        diagnosis,
        notes,
        items: validItems
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save prescription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HeartPulse size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Write Prescription & Complete Visit</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
                {error}
              </div>
            )}

            {/* Patient Header */}
            <div style={{
              backgroundColor: '#eff6ff',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px',
              border: '1px solid var(--primary-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 600 }}>Patient:</span>
                <strong style={{ display: 'block', fontSize: '1rem', color: '#1e3a8a' }}>{appointment.patient_name}</strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 600 }}>Appointment:</span>
                <span style={{ display: 'block', fontSize: '0.9rem', color: '#1e3a8a' }}>
                  {appointment.slot_date} at {appointment.slot_start_time?.slice(0, 5)}
                </span>
              </div>
            </div>

            {/* Diagnosis */}
            <div className="form-group">
              <label className="form-label">Clinical Diagnosis *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Acute Bronchitis, Essential Hypertension"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                required
              />
            </div>

            {/* Medications Table / Rows */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label className="form-label" style={{ margin: 0 }}>Medications (Rx) *</label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '4px' }}
                >
                  <Plus size={14} /> Add Medicine
                </button>
              </div>

              {items.map((item, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#f8fafc',
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    marginBottom: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                      Medicine #{index + 1}
                    </span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--danger)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.75rem'
                        }}
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '8px' }}>
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Medicine Name (e.g. Paracetamol)"
                        value={item.medicine_name}
                        onChange={(e) => handleItemChange(index, 'medicine_name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Dosage (e.g. 500mg, 1 tablet)"
                        value={item.dosage}
                        onChange={(e) => handleItemChange(index, 'dosage', e.target.value)}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Frequency (e.g. 1-0-1 after food)"
                        value={item.frequency}
                        onChange={(e) => handleItemChange(index, 'frequency', e.target.value)}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Duration (e.g. 5 days)"
                        value={item.duration}
                        onChange={(e) => handleItemChange(index, 'duration', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Special instructions (e.g. take with warm water, avoid dairy)"
                      value={item.instructions}
                      onChange={(e) => handleItemChange(index, 'instructions', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Doctor's Advice */}
            <div className="form-group">
              <label className="form-label">Doctor's Advice & Follow-up Instructions</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="e.g. Drink plenty of fluids, rest adequately. Review in 1 week if symptoms persist."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: '16px', height: '16px' }} /> : <Send size={16} />}
              Save Prescription & Mark Completed
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePrescriptionModal;
