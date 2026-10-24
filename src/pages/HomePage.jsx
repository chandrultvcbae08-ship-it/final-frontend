import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Calendar,
  UserCheck,
  ShieldCheck,
  Clock,
  HeartPulse,
  ArrowRight,
  Star,
  Activity,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';
import { doctorApi } from '../api/doctorApi';
import DoctorCard from '../components/DoctorCard';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    doctorApi.getDoctors()
      .then((res) => {
        setFeaturedDoctors(res.data.slice(0, 3));
      })
      .catch((err) => {
        console.error('Error fetching doctors:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/doctors?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/doctors');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #f0fdfa 100%)',
        padding: '70px 20px 80px',
        borderBottom: '1px solid var(--border-color)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'center'
        }}>
          {/* Hero Left Content */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-full)',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '20px',
              border: '1px solid var(--primary-border)'
            }}>
              <HeartPulse size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--primary)' }}>
                Trusted Healthcare Network & Online Appointments
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.25rem)',
              fontWeight: 800,
              color: '#0f172a',
              lineHeight: 1.15,
              marginBottom: '20px',
              letterSpacing: '-0.02em'
            }}>
              Your Health, <span style={{ color: 'var(--primary)' }}>Our Priority</span>
            </h1>

            <p style={{
              fontSize: '1.1rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              marginBottom: '32px',
              maxWidth: '540px'
            }}>
              Connect with India’s leading healthcare specialists, consult in real-time, view verified schedules, and book instant appointment slots at your convenience.
            </p>

            {/* Doctor Search Bar */}
            <form onSubmit={handleSearch} style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-full)',
                padding: '6px 8px 6px 20px',
                boxShadow: 'var(--shadow-lg)',
                border: '2px solid var(--primary-border)',
                maxWidth: '520px'
              }}>
                <Search size={20} color="var(--primary)" style={{ flexShrink: 0, marginRight: '10px' }} />
                <input
                  type="text"
                  placeholder="Search doctor, specialty (e.g. Cardiologist)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.95rem',
                    color: 'var(--text-main)',
                    backgroundColor: 'transparent'
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ borderRadius: 'var(--radius-full)', padding: '10px 24px' }}
                >
                  Search
                </button>
              </div>
            </form>

            {/* Trust points */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={18} color="var(--success)" />
                <span>Verified Specialists</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={18} color="var(--success)" />
                <span>Real-Time Slot Booking</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={18} color="var(--success)" />
                <span>Digital Prescriptions</span>
              </div>
            </div>
          </div>

          {/* Hero Right Graphic */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-color)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <Stethoscope size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', margin: 0 }}>Dr. Arun Kumar</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>Cardiologist • City Hospital</span>
                  </div>
                </div>
                <div className="badge badge-completed" style={{ fontSize: '0.7rem' }}>Available Today</div>
              </div>

              <div style={{
                backgroundColor: 'var(--bg-main)',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-light)' }}>Next Available Slot</span>
                  <span style={{ fontWeight: 700, color: 'var(--success-text)' }}>10:30 AM - 11:00 AM</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                  <span style={{ color: 'var(--text-light)' }}>Consultation Fee</span>
                  <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>₹800</span>
                </div>
              </div>

              <Link to="/doctors" className="btn btn-primary btn-full">
                Book Immediate Consultation
              </Link>

              {/* Floating mini stat badge */}
              <div style={{
                position: 'absolute',
                bottom: '-20px',
                left: '-15px',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: '12px 16px',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Activity size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>99.4%</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>Patient Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Main Feature Cards */}
      <section style={{ padding: '60px 20px', maxWidth: 'var(--max-width)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '12px' }}>
            Comprehensive Healthcare, Simplified
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            MediConnect bridges the gap between doctors and patients through unified clinical workflows and immediate scheduling.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
          {/* Card 1: Find Doctors */}
          <div className="card card-hover" style={{ textAlign: 'center', padding: '36px 24px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              backgroundColor: '#eff6ff',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)'
            }}>
              <Search size={30} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Find Doctors</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
              Search across leading cardiologists, dermatologists, neurologists, and pediatricians with verified clinical backgrounds and patient ratings.
            </p>
            <Link to="/doctors" style={{ fontWeight: 700, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              Browse All Doctors <ArrowRight size={16} />
            </Link>
          </div>

          {/* Card 2: Book Appointment */}
          <div className="card card-hover" style={{ textAlign: 'center', padding: '36px 24px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              backgroundColor: '#f0f9ff',
              color: 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.15)'
            }}>
              <Calendar size={30} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Book Appointment</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
              Choose from available daily time slots with zero double-booking risk. Manage upcoming visits and receive automated booking updates.
            </p>
            <Link to="/doctors" style={{ fontWeight: 700, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              Select a Slot <ArrowRight size={16} />
            </Link>
          </div>

          {/* Card 3: Get Medical Care */}
          <div className="card card-hover" style={{ textAlign: 'center', padding: '36px 24px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              backgroundColor: '#ecfdf5',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
            }}>
              <HeartPulse size={30} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Get Medical Care</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
              Consult your doctor, obtain official digital prescriptions with accurate dosages, and securely track your longitudinal health history.
            </p>
            <Link to="/about" style={{ fontWeight: 700, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              Learn How It Works <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section style={{ backgroundColor: '#ffffff', padding: '60px 20px', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Specialist Showcase
              </div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Our Top Rated Specialists</h2>
            </div>
            <Link to="/doctors" className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
              View All Doctors <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <div className="spinner" />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {featuredDoctors.map((doc) => (
                <DoctorCard key={doc.id} doctor={doc} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Join as Doctor / Patient Banner */}
      <section style={{ padding: '60px 20px', maxWidth: 'var(--max-width)', margin: '0 auto' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '48px 36px',
          color: '#ffffff',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
          alignItems: 'center',
          boxShadow: 'var(--shadow-xl)'
        }}>
          <div>
            <h2 style={{ color: '#ffffff', fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>
              Are you a Medical Practitioner?
            </h2>
            <p style={{ color: '#bfdbfe', fontSize: '1rem', lineHeight: 1.6, maxWidth: '500px', marginBottom: '24px' }}>
              Join MediConnect to build your digital clinical practice, create flexible custom appointment slots, manage patient queues, and write verified e-prescriptions.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
              <Link to="/register/doctor" className="btn btn-secondary" style={{ backgroundColor: '#ffffff', color: 'var(--primary)', border: 'none' }}>
                Register as Doctor
              </Link>
              <Link to="/login" className="btn btn-outline" style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)' }}>
                Doctor Login
              </Link>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '20px', borderRadius: 'var(--radius-lg)', backdropFilter: 'blur(8px)' }}>
              <Clock size={28} color="#93c5fd" style={{ marginBottom: '8px' }} />
              <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '4px' }}>Slot Control</h4>
              <p style={{ color: '#bfdbfe', fontSize: '0.8rem' }}>Set your custom days, hours, and consultation rates anytime.</p>
            </div>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '20px', borderRadius: 'var(--radius-lg)', backdropFilter: 'blur(8px)' }}>
              <ShieldCheck size={28} color="#93c5fd" style={{ marginBottom: '8px' }} />
              <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '4px' }}>Zero No-Shows</h4>
              <p style={{ color: '#bfdbfe', fontSize: '0.8rem' }}>Automated scheduling and verified booking requests.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
