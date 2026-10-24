import React from 'react';
import { X, Printer, HeartPulse, CheckCircle2 } from 'lucide-react';

const PrescriptionModal = ({ prescription, onClose }) => {
  if (!prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '750px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HeartPulse size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Medical Prescription</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" id="printable-prescription" style={{ padding: '32px' }}>
          {/* Clinic Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '2px solid var(--primary)',
            paddingBottom: '20px',
            marginBottom: '24px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}>
                  <HeartPulse size={18} />
                </div>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                  MediConnect Healthcare
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                Digital Consultation & Clinical Prescription Record
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {prescription.doctor_hospital || 'City Hospital Clinic'}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {prescription.doctor_name?.startsWith('Dr.') ? prescription.doctor_name : `Dr. ${prescription.doctor_name}`}
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--primary)', fontWeight: 600 }}>
                {prescription.doctor_specialization}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                {prescription.doctor_qualifications}
              </p>
            </div>
          </div>

          {/* Patient and Date Details */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            backgroundColor: 'var(--bg-main)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px',
            border: '1px solid var(--border-color)',
            fontSize: '0.875rem'
          }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)' }}>Patient Name</span>
              <strong style={{ color: 'var(--text-main)' }}>{prescription.patient_name}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)' }}>Patient Contact</span>
              <span>{prescription.patient_phone || prescription.patient_email}</span>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)' }}>Date of Issue</span>
              <span>{prescription.created_at ? new Date(prescription.created_at).toLocaleDateString() : 'Today'}</span>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)' }}>Appointment Ref</span>
              <span style={{ fontFamily: 'monospace' }}>#{prescription.appointment}</span>
            </div>
          </div>

          {/* Clinical Diagnosis */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
              Clinical Diagnosis
            </h4>
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#eff6ff',
              borderLeft: '4px solid var(--primary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.95rem',
              color: '#1e3a8a',
              fontWeight: 600
            }}>
              {prescription.diagnosis}
            </div>
          </div>

          {/* Medications Table */}
          <div style={{ marginBottom: '28px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
              Prescribed Medications (Rx)
            </h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 12px', fontWeight: 600 }}>#</th>
                    <th style={{ padding: '10px 12px', fontWeight: 600 }}>Medicine Name</th>
                    <th style={{ padding: '10px 12px', fontWeight: 600 }}>Dosage</th>
                    <th style={{ padding: '10px 12px', fontWeight: 600 }}>Frequency</th>
                    <th style={{ padding: '10px 12px', fontWeight: 600 }}>Duration</th>
                    <th style={{ padding: '10px 12px', fontWeight: 600 }}>Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {prescription.items && prescription.items.length > 0 ? (
                    prescription.items.map((item, index) => (
                      <tr key={item.id || index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '10px 12px', color: 'var(--text-light)' }}>{index + 1}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--text-main)' }}>{item.medicine_name}</td>
                        <td style={{ padding: '10px 12px' }}>{item.dosage}</td>
                        <td style={{ padding: '10px 12px' }}>{item.frequency}</td>
                        <td style={{ padding: '10px 12px' }}>{item.duration}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{item.instructions || 'As advised'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ padding: '16px', textAlign: 'center', color: 'var(--text-light)' }}>
                        No medications listed.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Doctor's Advice / Notes */}
          {prescription.notes && (
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                General Advice & Follow-up
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6, padding: '12px', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                {prescription.notes}
              </p>
            </div>
          )}

          {/* Digital Signature & Disclaimer */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '20px',
            fontSize: '0.75rem',
            color: 'var(--text-light)'
          }}>
            <div style={{ maxWidth: '340px' }}>
              <p>This is a digitally generated medical record from MediConnect Healthcare. Keep for clinical follow-up.</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontWeight: 600, marginBottom: '4px' }}>
                <CheckCircle2 size={16} /> Digitally Certified
              </div>
              <p style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                {prescription.doctor_name?.startsWith('Dr.') ? prescription.doctor_name : `Dr. ${prescription.doctor_name}`}
              </p>
            </div>
          </div>
        </div>

        <div className="modal-footer no-print">
          <button onClick={handlePrint} className="btn btn-secondary">
            <Printer size={16} /> Print Prescription
          </button>
          <button onClick={onClose} className="btn btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionModal;
