import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#0f172a',
      color: '#cbd5e1',
      paddingTop: '60px',
      paddingBottom: '30px',
      borderTop: '1px solid #1e293b'
    }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <HeartPulse size={22} />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                Medi<span style={{ color: '#38bdf8' }}>Connect</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '16px' }}>
              Seamless doctor-patient healthcare platform designed for hassle-free appointment bookings, verified doctor profiles, clinical slot management, and secure medical records.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600 }}>
              <ShieldCheck size={18} />
              <span>HIPAA-Compliant & Secure Data</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li><Link to="/" style={{ color: '#94a3b8' }}>Home</Link></li>
              <li><Link to="/doctors" style={{ color: '#94a3b8' }}>Find Doctors</Link></li>
              <li><Link to="/about" style={{ color: '#94a3b8' }}>About Platform</Link></li>
              <li><Link to="/register/patient" style={{ color: '#94a3b8' }}>Patient Registration</Link></li>
              <li><Link to="/register/doctor" style={{ color: '#94a3b8' }}>Doctor Registration</Link></li>
            </ul>
          </div>

          {/* Specializations */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Specializations</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li><Link to="/doctors?specialization=Cardiologist" style={{ color: '#94a3b8' }}>Cardiology</Link></li>
              <li><Link to="/doctors?specialization=Dermatologist" style={{ color: '#94a3b8' }}>Dermatology</Link></li>
              <li><Link to="/doctors?specialization=Neurologist" style={{ color: '#94a3b8' }}>Neurology</Link></li>
              <li><Link to="/doctors?specialization=Pediatrician" style={{ color: '#94a3b8' }}>Pediatrics</Link></li>
              <li><Link to="/doctors?specialization=General+Physician" style={{ color: '#94a3b8' }}>General Medicine</Link></li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Healthcare Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8' }}>
                <Phone size={16} color="#38bdf8" />
                <span>+91 800-MEDICONNECT</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8' }}>
                <Mail size={16} color="#38bdf8" />
                <span>support@mediconnect.health</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8' }}>
                <MapPin size={16} color="#38bdf8" />
                <span>Indiranagar, Bangalore, Karnataka 560038</span>
              </div>
              <div style={{ marginTop: '8px', padding: '10px', backgroundColor: '#1e293b', borderRadius: '8px', fontSize: '0.8rem', color: '#f87171' }}>
                <strong>Medical Emergency?</strong> Call local emergency services (112 or 108) immediately.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          fontSize: '0.825rem',
          color: '#64748b'
        }}>
          <div>
            © {new Date().getFullYear()} MediConnect Healthcare System. All rights reserved.
          </div>
          <div>
            Designed for compassionate, accessible medical care.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
