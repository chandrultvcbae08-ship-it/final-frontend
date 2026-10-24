import React, { useState, useEffect } from 'react';
import { FileText, Calendar, User, Stethoscope, AlertCircle, Eye, Printer } from 'lucide-react';
import { prescriptionApi } from '../api/prescriptionApi';
import { useAuth } from '../context/AuthContext';
import PrescriptionModal from '../components/PrescriptionModal';

const PrescriptionsListPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const { user, isDoctor, isPatient } = useAuth();

  useEffect(() => {
    setLoading(true);
    prescriptionApi.getPrescriptions()
      .then((res) => {
        setPrescriptions(res.data);
      })
      .catch((err) => {
        setError('Failed to load prescriptions list.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
          {isDoctor ? 'Prescriptions Written by You' : 'My Medical Prescriptions'}
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          {isDoctor
            ? 'Archive of clinical diagnoses, prescribed medications, and medical instructions issued to patients'
            : 'Access official clinical prescriptions, dosage guidelines, and doctor follow-up instructions'}
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '24px' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 20px' }}>
          <div className="spinner" style={{ width: '36px', height: '36px' }} />
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#eff6ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <FileText size={28} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No Prescriptions Found</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto', fontSize: '0.9rem' }}>
            {isDoctor
              ? 'You have not written any digital prescriptions yet. Complete an accepted appointment to issue one.'
              : 'You do not have any digital prescriptions on record yet.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {prescriptions.map((rx) => {
            return (
              <div key={rx.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#eff6ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={18} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Prescription #{rx.id}</span>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
                        {new Date(rx.created_at).toLocaleDateString()}
                      </strong>
                    </div>
                  </div>

                  <span className="badge badge-completed" style={{ fontSize: '0.7rem' }}>
                    {rx.items?.length || 0} Medications
                  </span>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '12px 0', margin: '8px 0', fontSize: '0.85rem' }}>
                  <div style={{ marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-light)' }}>
                      {isDoctor ? 'Patient: ' : 'Doctor: '}
                    </span>
                    <strong style={{ color: 'var(--text-main)' }}>
                      {isDoctor ? rx.patient_name : (rx.doctor_name?.startsWith('Dr.') ? rx.doctor_name : `Dr. ${rx.doctor_name}`)}
                    </strong>
                  </div>

                  {!isDoctor && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {rx.doctor_specialization} • {rx.doctor_hospital}
                    </div>
                  )}

                  <div style={{ marginTop: '10px', backgroundColor: '#eff6ff', padding: '8px 12px', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
                      Diagnosis
                    </span>
                    <span style={{ color: '#1e3a8a', fontWeight: 600 }}>
                      {rx.diagnosis}
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setSelectedPrescription(rx)}
                    className="btn btn-primary btn-sm btn-full"
                    style={{ gap: '6px' }}
                  >
                    <Eye size={16} /> View & Print Prescription
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedPrescription && (
        <PrescriptionModal
          prescription={selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
        />
      )}
    </div>
  );
};

export default PrescriptionsListPage;
