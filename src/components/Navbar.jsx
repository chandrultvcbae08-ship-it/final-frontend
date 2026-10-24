import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HeartPulse,
  Calendar,
  Clock,
  FileText,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Stethoscope,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isPatient, isDoctor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        padding: '0 20px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
          }}>
            <HeartPulse size={24} />
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e3a8a', letterSpacing: '-0.02em' }}>
              Medi<span style={{ color: '#2563eb' }}>Connect</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '-3px' }}>
              Healthcare System
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '28px' }} className="desktop-nav">
          <Link
            to="/"
            style={{
              fontWeight: 600,
              fontSize: '0.95rem',
              color: isActive('/') ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: isActive('/') ? '2px solid var(--primary)' : '2px solid transparent',
              paddingBottom: '4px'
            }}
          >
            Home
          </Link>
          <Link
            to="/doctors"
            style={{
              fontWeight: 600,
              fontSize: '0.95rem',
              color: isActive('/doctors') ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: isActive('/doctors') ? '2px solid var(--primary)' : '2px solid transparent',
              paddingBottom: '4px'
            }}
          >
            Find Doctors
          </Link>
          <Link
            to="/about"
            style={{
              fontWeight: 600,
              fontSize: '0.95rem',
              color: isActive('/about') ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: isActive('/about') ? '2px solid var(--primary)' : '2px solid transparent',
              paddingBottom: '4px'
            }}
          >
            About Us
          </Link>

          {/* Role specific quick links */}
          {user && isPatient && (
            <Link
              to="/patient/appointments"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600,
                fontSize: '0.95rem',
                color: isActive('/patient/appointments') ? 'var(--primary)' : 'var(--text-muted)',
              }}
            >
              <Calendar size={18} />
              My Appointments
            </Link>
          )}

          {user && isDoctor && (
            <>
              <Link
                to="/doctor/dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: isActive('/doctor/dashboard') ? 'var(--primary)' : 'var(--text-muted)',
                }}
              >
                <Stethoscope size={18} />
                Doctor Dashboard
              </Link>
              <Link
                to="/doctor/slots"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: isActive('/doctor/slots') ? 'var(--primary)' : 'var(--text-muted)',
                }}
              >
                <Clock size={18} />
                Manage Slots
              </Link>
            </>
          )}

          {user && (
            <Link
              to="/prescriptions"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600,
                fontSize: '0.95rem',
                color: isActive('/prescriptions') ? 'var(--primary)' : 'var(--text-muted)',
              }}
            >
              <FileText size={18} />
              Prescriptions
            </Link>
          )}
        </nav>

        {/* User Auth actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'var(--primary-light)',
                  border: '1px solid var(--primary-border)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}>
                  {user.full_name?.charAt(0) || 'U'}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.1 }}>
                    {user.full_name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600 }}>
                    {user.role}
                  </div>
                </div>
                <ChevronDown size={16} color="var(--primary)" />
              </button>

              {userDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '230px',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '8px 0',
                    zIndex: 100
                  }}
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border-color)', marginBottom: '4px' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Signed in as</p>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', wordBreak: 'break-all' }}>
                      {user.email}
                    </p>
                  </div>

                  {isPatient && (
                    <>
                      <Link to="/patient/appointments" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                        <Calendar size={16} /> My Appointments
                      </Link>
                      <Link to="/patient/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                        <User size={16} /> Patient Profile
                      </Link>
                    </>
                  )}

                  {isDoctor && (
                    <>
                      <Link to="/doctor/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                        <Stethoscope size={16} /> Doctor Dashboard
                      </Link>
                      <Link to="/doctor/slots" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                        <Clock size={16} /> Schedule Slots
                      </Link>
                      <Link to="/doctor/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                        <User size={16} /> Doctor Profile
                      </Link>
                    </>
                  )}

                  <Link to="/prescriptions" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                    <FileText size={16} /> Medical Prescriptions
                  </Link>

                  <Link to="/settings" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                    <Settings size={16} /> Account Settings
                  </Link>

                  <div style={{ borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      color: 'var(--danger)',
                      background: 'none',
                      border: 'none',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Log In
              </Link>
              <Link to="/register/patient" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-main)'
            }}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--border-color)',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }} className="mobile-menu">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px 0', fontWeight: 600 }}>Home</Link>
          <Link to="/doctors" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px 0', fontWeight: 600 }}>Find Doctors</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px 0', fontWeight: 600 }}>About Us</Link>
          {user && isPatient && (
            <Link to="/patient/appointments" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px 0', fontWeight: 600 }}>My Appointments</Link>
          )}
          {user && isDoctor && (
            <>
              <Link to="/doctor/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px 0', fontWeight: 600 }}>Doctor Dashboard</Link>
              <Link to="/doctor/slots" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px 0', fontWeight: 600 }}>Manage Slots</Link>
            </>
          )}
          {user && (
            <Link to="/prescriptions" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px 0', fontWeight: 600 }}>Prescriptions</Link>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 868px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
