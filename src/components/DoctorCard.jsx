import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Building, Award, Calendar, Clock } from 'lucide-react';

const DoctorCard = ({ doctor }) => {
  const [imgError, setImgError] = useState(false);

  // Fallback avatar with medical styling
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.full_name)}&background=2563eb&color=fff&size=200&bold=true`;

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
        <img
          src={!imgError && doctor.profile_image ? doctor.profile_image : fallbackAvatar}
          alt={doctor.full_name}
          onError={() => setImgError(true)}
          style={{
            width: '84px',
            height: '84px',
            borderRadius: 'var(--radius-lg)',
            objectFit: 'cover',
            border: '2px solid var(--primary-border)',
            flexShrink: 0
          }}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span className="badge badge-specialization" style={{ fontSize: '0.72rem' }}>
              {doctor.specialization}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 700, marginLeft: 'auto' }}>
              <Star size={14} fill="#f59e0b" />
              <span>{doctor.rating || '4.8'}</span>
              <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>({doctor.total_reviews || 15})</span>
            </div>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {doctor.full_name.startsWith('Dr.') ? doctor.full_name : `Dr. ${doctor.full_name}`}
          </h3>

          <p style={{ fontSize: '0.825rem', color: 'var(--text-light)', marginBottom: '6px' }}>
            {doctor.qualifications}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Award size={14} color="var(--primary)" />
            <span>{doctor.experience_years} years experience</span>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginBottom: '16px', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '6px' }}>
          <Building size={14} color="var(--primary)" />
          <span style={{ fontWeight: 600 }}>{doctor.hospital_name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)' }}>
          <MapPin size={14} color="var(--secondary)" />
          <span>{doctor.location}</span>
        </div>
      </div>

      <div style={{
        marginTop: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '14px',
        borderTop: '1px solid var(--border-color)'
      }}>
        <div>
          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)' }}>Consultation Fee</span>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
            ₹{parseFloat(doctor.consultation_fee).toFixed(0)}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to={`/doctors/${doctor.id}`} className="btn btn-secondary btn-sm">
            View Details
          </Link>
          <Link to={`/book/${doctor.id}`} className="btn btn-primary btn-sm">
            Book
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
