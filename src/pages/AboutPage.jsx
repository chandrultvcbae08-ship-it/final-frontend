import React from 'react';
import { HeartPulse, ShieldCheck, Users, Clock, Award, Phone, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="page-container" style={{ maxWidth: '960px' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '48px', paddingTop: '20px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          backgroundColor: '#eff6ff',
          borderRadius: 'var(--radius-full)',
          marginBottom: '16px',
          border: '1px solid var(--primary-border)'
        }}>
          <HeartPulse size={16} color="var(--primary)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
            About MediConnect Healthcare
          </span>
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px' }}>
          Bridging Patients & Doctors Through Modern Technology
        </h1>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '720px', margin: '0 auto' }}>
          MediConnect is designed to make quality clinical healthcare accessible, transparent, and seamless. From instantaneous slot reservations to verified digital prescriptions, we empower healthcare delivery.
        </p>
      </div>

      {/* Core Pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eff6ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <ShieldCheck size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Verified Medical Specialists</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Every doctor profile on MediConnect undergoes background qualification reviews and medical council verification to ensure patients receive top-tier medical consultations.
          </p>
        </div>

        <div className="card" style={{ padding: '28px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#f0f9ff', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Clock size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Zero Double-Booking Guarantee</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Our PostgreSQL-backed atomic booking engine guarantees zero overlapping bookings, ensuring doctors and patients respect dedicated consultation windows.
          </p>
        </div>

        <div className="card" style={{ padding: '28px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <HeartPulse size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Digital Medical Continuity</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Secure electronic prescriptions with dosages, clinical notes, and follow-up directives ensure comprehensive continuity of medical care for patients.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="card" style={{ padding: '36px', marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '24px', textAlign: 'center' }}>
          How MediConnect Works
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>01</div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>Search & Choose</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Filter specialists by Cardiology, Dermatology, Neurology, Pediatrics, or General Practice.
            </p>
          </div>

          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '8px' }}>02</div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>Select Live Slot</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Choose a dedicated consultation slot and provide reason for consultation in seconds.
            </p>
          </div>

          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)', marginBottom: '8px' }}>03</div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>Consult & Receive Care</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Meet your doctor and view your official digital prescription and medical recommendations anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Disclaimer */}
      <div style={{
        backgroundColor: '#fff1f2',
        border: '1.5px solid #fecdd3',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '40px'
      }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#ffe4e6', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Phone size={22} />
        </div>
        <div>
          <h4 style={{ color: '#9f1239', fontSize: '1.05rem', fontWeight: 800, marginBottom: '4px' }}>Emergency Healthcare Notice</h4>
          <p style={{ color: '#be123c', fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>
            MediConnect is designed for scheduled consultations. If you are experiencing acute chest pain, severe bleeding, breathing distress, or another emergency, immediately call emergency medical services (112 / 108) or visit the nearest emergency room.
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Link to="/doctors" className="btn btn-primary btn-lg">
          Browse Verified Doctors
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
