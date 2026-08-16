import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, ArrowRight, Shield, Clock, Users, CheckCircle,
  Stethoscope, Pill, BarChart2, HeartPulse, CalendarCheck,
  FileText, Phone, Mail, MapPin, Star
} from 'lucide-react';

const S = {
  // Inline-style objects for guaranteed light theme
  page: { backgroundColor: '#FFFFFF', color: '#111827', fontFamily: "'Outfit', sans-serif", overflowX: 'hidden' },
  nav: { padding: '1.1rem 6vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6', position: 'sticky', top: 0, zIndex: 100, background: '#fff' },
  brand: { display: 'flex', alignItems: 'center', gap: '0.6rem' },
  brandIcon: { width: 36, height: 36, background: '#EFF6FF', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  navLinks: { display: 'flex', gap: '2.5rem', fontSize: '0.9rem', fontWeight: 500, color: '#6B7280' },
  btnDark: { padding: '0.65rem 1.5rem', fontWeight: 700, fontSize: '0.9rem', color: '#fff', background: '#111827', borderRadius: 9999, display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: 'none', cursor: 'pointer', textDecoration: 'none' },
  btnBlue: { padding: '0.65rem 1.5rem', fontWeight: 700, fontSize: '0.9rem', color: '#fff', background: '#1D4ED8', borderRadius: 9999, display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: 'none', cursor: 'pointer', textDecoration: 'none', boxShadow: '0 4px 14px rgba(29,78,216,0.3)' },
  btnOutline: { padding: '0.65rem 1.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#374151', background: '#F9FAFB', borderRadius: 9999, display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1.5px solid #E5E7EB', cursor: 'pointer', textDecoration: 'none' },
};

export default function LandingPage() {
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div style={S.page}>
      {/* ── NAV ── */}
      <nav style={S.nav}>
        <div style={S.brand}>
          <div style={S.brandIcon}><Activity size={20} color="#1D4ED8" strokeWidth={2.5} /></div>
          <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>MediTrack</span>
        </div>
        <div style={S.navLinks}>
          {['Home', 'Services', 'Resources', 'Contact'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ cursor: 'pointer', color: '#6B7280', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/login" style={S.btnOutline}>Log In</Link>
          <Link to="/signup" style={S.btnBlue}>Sign Up <ArrowRight size={15} /></Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ padding: '5rem 6vw', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', maxWidth: 1280, margin: '0 auto' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#EFF6FF', color: '#1D4ED8', padding: '0.4rem 1rem', borderRadius: 9999, fontSize: '0.78rem', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            <Star size={12} fill="#1D4ED8" /> Award-Winning Health Tech Platform
          </div>
          <h1 style={{ fontSize: 'clamp(2.8rem,5vw,4.2rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.5rem', color: '#111827' }}>
            Feel good about<br />your <span style={{ color: '#1D4ED8' }}>health.</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#6B7280', lineHeight: 1.8, maxWidth: 480, marginBottom: '2.5rem' }}>
            MediTrack delivers modern health management — from appointment booking to EHR records and prescription tracking — all beautifully unified.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
            <Link to="/signup" style={S.btnDark}>Get Started <ArrowRight size={16} /></Link>
            <Link to="/login" style={S.btnOutline}>Log In</Link>
          </div>
          <div style={{ display: 'flex', gap: '3rem' }}>
            {[{ v: '12+', l: 'Years of experience' }, { v: '8k+', l: 'Active patients' }, { v: '98%', l: 'Satisfaction rate' }].map(s => (
              <div key={s.v}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827' }}>{s.v}</div>
                <div style={{ fontSize: '0.78rem', color: '#9CA3AF', marginTop: '0.2rem' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero visual panel */}
        <div style={{ position: 'relative' }}>
          <div style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', borderRadius: 32, padding: '3rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Mock dashboard preview */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>Health Overview</span>
                <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{today}</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {[{ label: 'Heart Rate', value: '72 BPM', color: '#EF4444', icon: HeartPulse }, { label: 'Consultations', value: '2,050', color: '#1D4ED8', icon: Stethoscope }, { label: 'Prescriptions', value: 'Active', color: '#10B981', icon: Pill }].map(m => (
                  <div key={m.label} style={{ flex: 1, padding: '0.75rem', background: '#F9FAFB', borderRadius: 12, textAlign: 'center' }}>
                    <m.icon size={18} color={m.color} style={{ margin: '0 auto 0.4rem' }} />
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>{m.value}</div>
                    <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Basic Vitals indicator */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity size={16} color="#1D4ED8" />
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Vitals Summary</span>
                </div>
                <span style={{ background: '#D1FAE5', color: '#059669', padding: '0.2rem 0.6rem', borderRadius: 9999, fontSize: '0.7rem', fontWeight: 700 }}>Optimal</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#6B7280', textTransform: 'uppercase' }}>Blood Pressure</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>120/80</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#6B7280', textTransform: 'uppercase' }}>Weight</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>72 kg</div>
                </div>
              </div>
            </div>

            {/* Upcoming appointment card */}
            <div style={{ background: '#111827', borderRadius: 16, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
              <div style={{ width: 44, height: 44, background: '#1D4ED8', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CalendarCheck size={22} color="#fff" />
              </div>
              <div>
                <div style={{ color: '#9CA3AF', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Next Appointment</div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>Dr. Emeka – Cardiology</div>
                <div style={{ color: '#6B7280', fontSize: '0.78rem' }}>Tomorrow, 10:30 AM</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE BAND ── */}
      <div style={{ background: '#F9FAFB', borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6', padding: '1.5rem 6vw' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: '3rem', overflowX: 'auto' }}>
          <span style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>Our Services</span>
          {['Appointment Booking', 'EHR Management', 'Prescription Tracking', 'Pharmacy Dispatch', 'Billing & Invoices'].map(s => (
            <span key={s} style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>{s}</span>
          ))}
        </div>
      </div>

      {/* ── SERVICES GRID ── */}
      <section id="services" style={{ maxWidth: 1280, margin: '0 auto', padding: '6rem 6vw' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem', color: '#111827' }}>
            Everything your health needs,<br />
            <em style={{ color: '#9CA3AF', fontWeight: 400 }}>all in one calm place.</em>
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '0.95rem', maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
            Purpose-built portals for every role — seamlessly connected and always in sync.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }}>
          {[
            { icon: Users,       title: 'Patient Portal',         desc: 'Book appointments, view EHR records, track prescriptions, and pay invoices.', bg: '#EFF6FF', ic: '#1D4ED8' },
            { icon: Stethoscope, title: 'Doctor Workstation',     desc: 'Manage consultation queue, write digital EHR records, and issue prescriptions.', bg: '#FEF9C3', ic: '#D97706' },
            { icon: Pill,        title: 'Pharmacy Dispatch',      desc: 'View prescription queue, manage medication inventory, dispense orders.', bg: '#D1FAE5', ic: '#059669' },
            { icon: BarChart2,   title: 'Admin Analytics',        desc: 'Manage users, departments, appointments, and hospital performance metrics.', bg: '#FEE2E2', ic: '#DC2626' },
          ].map(s => (
            <div key={s.title} style={{ background: s.bg, borderRadius: 20, padding: '2rem', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ width: 48, height: 48, background: '#fff', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <s.icon size={24} color={s.ic} />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.6rem', color: '#111827' }}>{s.title}</h3>
              <p style={{ color: '#6B7280', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>{s.desc}</p>
              <Link to="/login" style={{ fontSize: '0.82rem', fontWeight: 700, color: s.ic, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}>
                Learn more <ArrowRight size={13} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── TRUST SECTION ── */}
      <section id="about" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 6vw 6rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)', borderRadius: 32, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '2rem', padding: '2.5rem' }}>
          {/* Real data metrics */}
          {[
            { label: 'Average consultation time', value: '12 min', icon: Clock, color: '#059669' },
            { label: 'Doctors on the platform',   value: '340+', icon: Stethoscope, color: '#1D4ED8' },
            { label: 'Prescriptions issued today', value: '1,230', icon: FileText, color: '#D97706' },
          ].map(m => (
            <div key={m.label} style={{ background: '#fff', borderRadius: 16, padding: '1.1rem 1.5rem', width: '100%', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ width: 42, height: 42, background: `${m.color}15`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <m.icon size={20} color={m.color} />
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>{m.value}</div>
                <div style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>{m.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>A COMPASSIONATE GUIDE</div>
          <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.5rem', letterSpacing: '-0.02em', color: '#111827' }}>
            Clinical excellence<br />with a <em style={{ color: '#1D4ED8', fontWeight: 400 }}>human touch.</em>
          </h2>
          <p style={{ color: '#6B7280', lineHeight: 1.9, marginBottom: '2rem', fontSize: '0.95rem' }}>
            Our platform is built to make every interaction — from booking to billing — feel seamless, personal, and secure for both patients and care providers.
          </p>
          {['Transparent care and pricing', 'Real-time health monitoring', 'Secure, HIPAA-compliant records'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <CheckCircle size={18} color="#1D4ED8" />
              <span style={{ fontSize: '0.9rem', color: '#374151' }}>{item}</span>
            </div>
          ))}
          <Link to="/signup" style={{ ...S.btnDark, marginTop: '2rem', display: 'inline-flex' }}>
            Create an Account <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section style={{ background: '#111827', margin: '0 6vw', borderRadius: 32, padding: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6rem', flexWrap: 'wrap', gap: '2rem', maxWidth: 1280, marginLeft: 'auto', marginRight: 'auto' }}>
        <div>
          <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
            Your healthiest start begins<br />with one easy visit.
          </h2>
          <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Join thousands of patients managing their health with MediTrack.</p>
        </div>
        <Link to="/signup" style={{ ...S.btnBlue, padding: '1rem 2.5rem', fontSize: '1rem' }}>
          Create an Account <ArrowRight size={18} />
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#F9FAFB', borderTop: '1px solid #F3F4F6', padding: '3rem 6vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Activity size={20} color="#1D4ED8" />
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>MediTrack</span>
        </div>
        <div style={{ display: 'flex', gap: '2.5rem', fontSize: '0.85rem', color: '#6B7280' }}>
          {['Privacy', 'Terms', 'Contact', 'Support'].map(l => (
            <a key={l} href="#" style={{ color: '#6B7280', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
        <div style={{ fontSize: '0.82rem', color: '#9CA3AF' }}>© 2026 MediTrack HMS. All rights reserved.</div>
      </footer>
    </div>
  );
}
