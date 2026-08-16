import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Shield, Clock, Users, CheckCircle, Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#111827', fontFamily: "'Outfit', sans-serif" }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        padding: '1.25rem 5vw',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #F3F4F6',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '36px', height: '36px',
            background: '#EFF6FF',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Activity size={20} color="#1D4ED8" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
            MediTrack
          </span>
        </div>

        <div style={{ display: 'flex', gap: '2.5rem', fontSize: '0.9rem', fontWeight: 500, color: '#6B7280' }}>
          <a href="#features" style={{ cursor: 'pointer' }}>Home</a>
          <a href="#solutions" style={{ cursor: 'pointer' }}>Services</a>
          <a href="#about" style={{ cursor: 'pointer' }}>Resources</a>
          <a href="#contact" style={{ cursor: 'pointer' }}>Contact</a>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link to="/login" style={{
            padding: '0.6rem 1.25rem',
            fontWeight: 600, fontSize: '0.9rem',
            color: '#111827',
            background: '#F3F4F6',
            borderRadius: '9999px',
            border: '1px solid #E5E7EB'
          }}>
            Log In
          </Link>
          <Link to="/login" style={{
            padding: '0.6rem 1.25rem',
            fontWeight: 600, fontSize: '0.9rem',
            color: '#fff',
            background: '#1D4ED8',
            borderRadius: '9999px',
            display: 'flex', alignItems: 'center', gap: '0.4rem'
          }}>
            Book a Visit <ArrowRight size={15} />
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        padding: '6rem 5vw',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center',
        maxWidth: '1300px',
        margin: '0 auto'
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: '#EFF6FF', color: '#1D4ED8',
            padding: '0.4rem 1rem', borderRadius: '9999px',
            fontSize: '0.8rem', fontWeight: 600,
            marginBottom: '1.5rem'
          }}>
            ✦ AWARD-WINNING HEALTH TECH PLATFORM
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
            color: '#111827'
          }}>
            Feel good about<br />your <span style={{ color: '#1D4ED8' }}>health.</span>
          </h1>

          <p style={{
            fontSize: '1.1rem', color: '#6B7280',
            lineHeight: 1.8, maxWidth: '480px',
            marginBottom: '2.5rem'
          }}>
            MediTrack delivers modern health management through thoughtful design — from hello to healthy. Book appointments, track records, and manage prescriptions all in one place.
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
            <Link to="/login" style={{
              padding: '0.9rem 2rem', fontWeight: 700, fontSize: '0.95rem',
              color: '#fff', background: '#111827',
              borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              Book an appointment <ArrowRight size={16} />
            </Link>
            <Link to="/login" style={{
              padding: '0.9rem 2rem', fontWeight: 600, fontSize: '0.95rem',
              color: '#1D4ED8', background: '#EFF6FF',
              borderRadius: '9999px'
            }}>
              Enable my care ↗
            </Link>
          </div>

          {/* Social proof */}
          <div style={{ display: 'flex', gap: '3rem' }}>
            {[
              { value: '12+', label: 'Years of experience' },
              { value: '8k+', label: 'Active patients' },
              { value: '98%', label: 'Satisfaction rate' },
            ].map(stat => (
              <div key={stat.value}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>{stat.value}</div>
                <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginTop: '0.2rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Image placeholder card */}
        <div style={{ position: 'relative' }}>
          <div style={{
            backgroundColor: '#F0FDF4',
            borderRadius: '32px',
            height: '480px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {/* Floating appointment card */}
            <div style={{
              position: 'absolute', bottom: '2rem', right: '-1.5rem',
              background: 'white', borderRadius: '16px',
              padding: '1rem 1.25rem',
              boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              minWidth: '220px'
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Clock size={20} color="#1D4ED8" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 500 }}>Today's Appointment</div>
                <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem' }}>Dr. Emeka – 10:30 AM</div>
              </div>
            </div>

            {/* Large visual icon */}
            <Activity size={160} color="#D1FAE5" strokeWidth={1} />
          </div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <div style={{ background: '#F9FAFB', borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{
          maxWidth: '1300px', margin: '0 auto',
          padding: '2rem 5vw',
          display: 'flex', gap: '3rem', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            OUR SERVICES
          </span>
          {['Appointment Booking', 'EHR Management', 'Prescription Tracking', 'Pharmacy Dispatch', 'Billing & Invoices'].map(s => (
            <span key={s} style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>{s}</span>
          ))}
        </div>
      </div>

      {/* ── SERVICES SECTION ── */}
      <section id="features" style={{ maxWidth: '1300px', margin: '0 auto', padding: '6rem 5vw' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Everything your health needs,<br />
            <span style={{ color: '#6B7280', fontStyle: 'italic', fontWeight: 400 }}>all in one calm place.</span>
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
            Purpose-built portals for every role — from patients booking appointments to admins tracking revenue.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {[
            { title: 'Patient Portal', desc: 'Book appointments, view EHR records, track prescriptions, and pay invoices with ease.', bg: '#EFF6FF', icon: '👤', color: '#1D4ED8' },
            { title: 'Doctor Workstation', desc: 'Manage your consultation queue, write EHR records, and issue prescriptions digitally.', bg: '#FEF9C3', icon: '🩺', color: '#D97706' },
            { title: 'Pharmacy Dispatch', desc: 'View the prescription queue, manage medication inventory, and dispense orders efficiently.', bg: '#D1FAE5', icon: '💊', color: '#059669' },
            { title: 'Admin Analytics', desc: 'Manage users, departments, appointments, and get a bird\'s-eye view of hospital performance.', bg: '#FEE2E2', icon: '📊', color: '#DC2626' },
          ].map(s => (
            <div key={s.title} style={{
              background: s.bg,
              borderRadius: '20px',
              padding: '2rem',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{s.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.75rem', color: '#111827' }}>{s.title}</h3>
              <p style={{ color: '#6B7280', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>{s.desc}</p>
              <Link to="/login" style={{ fontSize: '0.85rem', fontWeight: 600, color: s.color, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Learn more <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section style={{
        maxWidth: '1300px', margin: '0 auto', padding: '0 5vw 6rem 5vw',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center'
      }}>
        <div style={{
          background: '#F0FDF4', borderRadius: '32px',
          height: '380px',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Users size={120} color="#D1FAE5" strokeWidth={1} />
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
            A COMPASSIONATE GUIDE AT YOUR SIDE
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            Clinical excellence<br />with a <span style={{ color: '#1D4ED8', fontStyle: 'italic', fontWeight: 400 }}>human touch.</span>
          </h2>
          <p style={{ color: '#6B7280', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Our platform is built to make every interaction — from booking to billing — feel seamless, personal, and reassuring for both patients and care providers.
          </p>

          {['Transparent care and pricing', 'Real-time health monitoring', 'A safe space for all patients'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <CheckCircle size={18} color="#1D4ED8" />
              <span style={{ fontSize: '0.9rem', color: '#374151' }}>{item}</span>
            </div>
          ))}

          <Link to="/login" style={{
            marginTop: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.9rem 2rem', fontWeight: 700, color: '#fff', background: '#111827',
            borderRadius: '9999px', fontSize: '0.9rem'
          }}>
            Read more <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── BOTTOM CTA BAND ── */}
      <section style={{ background: '#EFF6FF', padding: '4rem 5vw' }}>
        <div style={{
          maxWidth: '1300px', margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '2rem'
        }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
              Your healthiest start<br />begins with one easy visit.
            </h2>
          </div>
          <Link to="/login" style={{
            padding: '1rem 2.5rem', fontWeight: 700, fontSize: '1rem',
            color: '#fff', background: '#1D4ED8', borderRadius: '9999px',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            boxShadow: '0 4px 20px rgba(29,78,216,0.3)'
          }}>
            Book an appointment <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#111827', color: '#9CA3AF', padding: '2.5rem 5vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Activity size={20} color="#3B82F6" />
          <span style={{ color: '#F9FAFB', fontWeight: 700 }}>MediTrack</span>
        </div>
        <div style={{ fontSize: '0.85rem' }}>© 2026 MediTrack HMS. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem' }}>
          <a href="#" style={{ color: '#9CA3AF' }}>Privacy</a>
          <a href="#" style={{ color: '#9CA3AF' }}>Terms</a>
          <a href="#" style={{ color: '#9CA3AF' }}>Contact</a>
        </div>
      </footer>
    </div>
  );
}
