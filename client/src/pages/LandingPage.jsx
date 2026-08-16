import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Shield, Clock, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
      {/* Navigation */}
      <nav style={{ padding: '1.5rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'var(--color-primary-light)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)'
          }}>
            <Activity size={24} strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            MediTrack
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '2rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          <a href="#features" className="hover:text-primary">Features</a>
          <a href="#solutions" className="hover:text-primary">Solutions</a>
          <a href="#about" className="hover:text-primary">About Us</a>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login" className="btn btn-secondary">
            Log In
          </Link>
          <Link to="/login" className="btn btn-primary">
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{ padding: '6rem 4rem', display: 'flex', gap: '4rem', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ flex: 1 }}>
          <div className="badge" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', marginBottom: '1.5rem', fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
            ✨ The future of Healthtech
          </div>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Manage your healthcare <span style={{ color: 'var(--color-primary)' }}>effortlessly.</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6, maxWidth: '90%' }}>
            A complete, intelligent platform for patients, doctors, and hospital administrators. Experience seamless appointment booking, EHR management, and real-time health analytics.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Book an Appointment
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Patient Portal
            </Link>
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div style={{ flex: 1, position: 'relative' }}>
           <div className="soft-card" style={{ padding: '2rem', borderRadius: '32px', transform: 'rotate(2deg)', position: 'relative', zIndex: 2, background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                 <div style={{ display: 'flex', gap: '1rem' }}>
                   <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)' }}></div>
                   <div>
                     <div style={{ height: '16px', width: '120px', backgroundColor: 'var(--border-light)', borderRadius: '8px', marginBottom: '8px' }}></div>
                     <div style={{ height: '12px', width: '80px', backgroundColor: 'var(--border-light)', borderRadius: '8px' }}></div>
                   </div>
                 </div>
                 <div style={{ width: '100px', height: '32px', borderRadius: '16px', backgroundColor: 'var(--color-success)', opacity: 0.2 }}></div>
              </div>
              <div style={{ height: '200px', backgroundColor: 'var(--bg-app)', borderRadius: '16px', marginBottom: '1.5rem' }}></div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, height: '100px', backgroundColor: 'var(--color-primary-light)', borderRadius: '16px' }}></div>
                <div style={{ flex: 1, height: '100px', backgroundColor: 'var(--color-accent-light)', borderRadius: '16px' }}></div>
              </div>
           </div>
           
           {/* Decorative elements */}
           <div style={{ position: 'absolute', top: '-2rem', right: '-2rem', width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-accent), #F59E0B)', zIndex: 1, filter: 'blur(40px)', opacity: 0.5 }}></div>
           <div style={{ position: 'absolute', bottom: '-4rem', left: '2rem', width: '150px', height: '150px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), #3B82F6)', zIndex: 1, filter: 'blur(50px)', opacity: 0.3 }}></div>
        </div>
      </header>

      {/* Feature Highlights */}
      <section style={{ padding: '4rem', display: 'flex', justifyContent: 'center', gap: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
         <div className="soft-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.5rem' }}>
           <div style={{ padding: '1rem', backgroundColor: 'var(--color-primary-light)', borderRadius: '16px', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
             <Clock size={32} />
           </div>
           <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Instant Booking</h3>
           <p style={{ color: 'var(--text-secondary)' }}>Schedule appointments with top doctors instantly without waiting in long hospital queues.</p>
         </div>

         <div className="soft-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.5rem' }}>
           <div style={{ padding: '1rem', backgroundColor: 'var(--color-accent-light)', borderRadius: '16px', color: 'var(--color-warning)', marginBottom: '1.5rem' }}>
             <Shield size={32} />
           </div>
           <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Secure EHR</h3>
           <p style={{ color: 'var(--text-secondary)' }}>Your electronic health records are encrypted and securely accessible anywhere, anytime.</p>
         </div>

         <div className="soft-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.5rem' }}>
           <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '16px', color: 'var(--color-success)', marginBottom: '1.5rem' }}>
             <Users size={32} />
           </div>
           <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Unified Portals</h3>
           <p style={{ color: 'var(--text-secondary)' }}>Dedicated workstations for patients, doctors, pharmacists, and administrators.</p>
         </div>
      </section>
    </div>
  );
}
