import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { doctorApi } from '../api/doctorApi';
import DoctorCard from '../components/DoctorCard';
import DoctorSearch from '../components/DoctorSearch';
import SpecializationFilter from '../components/SpecializationFilter';
import { Stethoscope, Filter, AlertCircle } from 'lucide-react';

const DoctorsListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentSearch = searchParams.get('search') || '';
  const currentSpecialization = searchParams.get('specialization') || '';

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  // Load specializations on mount
  useEffect(() => {
    doctorApi.getSpecializations()
      .then((res) => setSpecializations(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch doctors whenever query params change
  useEffect(() => {
    setLoading(true);
    setError('');

    const params = {};
    if (currentSearch) params.search = currentSearch;
    if (currentSpecialization) params.specialization = currentSpecialization;

    doctorApi.getDoctors(params)
      .then((res) => {
        setDoctors(res.data);
      })
      .catch((err) => {
        setError('Failed to load doctors list. Please ensure the backend is running.');
      })
      .finally(() => setLoading(false));
  }, [currentSearch, currentSpecialization]);

  const handleSearchSubmit = () => {
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm.trim()) {
      newParams.set('search', searchTerm.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleSelectSpecialization = (spec) => {
    const newParams = new URLSearchParams(searchParams);
    if (spec) {
      newParams.set('specialization', spec);
    } else {
      newParams.delete('specialization');
    }
    setSearchParams(newParams);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px' }}>
          Find & Book Top Doctors
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>
          Browse verified specialists across India, check clinical slot availability, and book appointments instantly.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '32px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <DoctorSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={handleSearchSubmit}
          />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <Filter size={14} /> Filter By Specialization:
          </div>
          <SpecializationFilter
            specializations={specializations}
            selected={currentSpecialization}
            onSelect={handleSelectSpecialization}
          />
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
          {loading ? 'Searching doctors...' : `${doctors.length} Specialist${doctors.length === 1 ? '' : 's'} Available`}
        </h3>

        {(currentSearch || currentSpecialization) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSearchParams({});
            }}
            className="btn btn-outline btn-sm"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: '16px' }}>
          <div className="spinner" style={{ width: '36px', height: '36px' }} />
          <p style={{ color: 'var(--text-muted)' }}>Fetching available healthcare specialists...</p>
        </div>
      )}

      {/* Doctors Grid */}
      {!loading && doctors.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && doctors.length === 0 && !error && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#eff6ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Stethoscope size={28} />
          </div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>No Doctors Found</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 20px' }}>
            We couldn't find any doctors matching your search filters. Try clearing your search or selecting another medical specialty.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSearchParams({});
            }}
            className="btn btn-primary"
          >
            Show All Doctors
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorsListingPage;
