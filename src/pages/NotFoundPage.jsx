import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Home, Stethoscope } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="page-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '20px',
        backgroundColor: '#eff6ff',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <HeartPulse size={36} />
      </div>

      <h1 style={{ fontSize: '4.5rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1, marginBottom: '12px' }}>
        404
      </h1>

      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text-main)' }}>
        Page Not Found
      </h2>

      <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 32px', lineHeight: 1.6 }}>
        The healthcare page or medical resource you are searching for might have been moved, renamed, or is currently unavailable.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary" style={{ gap: '6px' }}>
          <Home size={16} /> Return to Home
        </Link>
        <Link to="/doctors" className="btn btn-outline" style={{ gap: '6px' }}>
          <Stethoscope size={16} /> Find Doctors
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
