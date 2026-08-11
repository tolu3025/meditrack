import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Lock, Mail, AlertCircle, ShieldCheck, UserCheck, Stethoscope, Pill, User } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('patient1@gmail.com');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      const dashboards = {
        patient: '/patient/dashboard',
        doctor: '/doctor/dashboard',
        pharmacist: '/pharmacy/dashboard',
        admin: '/admin/dashboard',
      };
      navigate(dashboards[user.role] || '/');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { role: 'Admin', email: 'admin@meditrack.ng', icon: ShieldCheck, color: '#F43F5E' },
    { role: 'Doctor', email: 'dr.emeka@meditrack.ng', icon: Stethoscope, color: '#10B981' },
    { role: 'Pharmacist', email: 'pharm.chioma@meditrack.ng', icon: Pill, color: '#F59E0B' },
    { role: 'Patient', email: 'patient1@gmail.com', icon: User, color: '#06B6D4' },
  ];

  const selectDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at top, #0F172A 0%, #060911 100%)',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Ambient Glow Orbs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '20%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(50px)',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '20%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
      }} />

      <div className="glass-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '2.75rem 2.5rem',
        position: 'relative',
        zIndex: 1,
        border: '1px solid rgba(6, 182, 212, 0.25)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(6, 182, 212, 0.15)',
      }}>
        {/* Hospital System Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(6, 182, 212, 0.5)',
            marginBottom: '1rem',
          }}>
            <Activity size={36} color="#FFF" />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #94A3B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            MEDITRACK HMS
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginTop: '0.25rem' }}>
            Unified Nigerian Hospital Management Portal
          </p>

          <div style={{
            marginTop: '0.85rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#10B981',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
            API Gateway & Database Active
          </div>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            borderRadius: '12px',
            padding: '0.85rem 1rem',
            color: '#F43F5E',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            marginBottom: '1.5rem',
          }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Demo Account Role Selector Pills */}
        <div style={{ marginBottom: '1.75rem' }}>
          <label className="form-label" style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.6rem' }}>
            Select Portal Role (One-Click Demo):
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            {demoAccounts.map((account) => {
              const Icon = account.icon;
              const isSelected = email === account.email;
              return (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => selectDemo(account.email)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(6, 182, 212, 0.18)' : 'rgba(15, 23, 42, 0.7)',
                    border: isSelected ? `1px solid ${account.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                    color: isSelected ? '#FFF' : '#94A3B8',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Icon size={16} color={account.color} />
                  <span>{account.role}</span>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Credentials</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#64748B" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.8rem' }}
                placeholder="email@meditrack.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#64748B" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '2.8rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Verifying Credentials...' : 'Sign In to Portal Workstation'}
          </button>
        </form>
      </div>
    </div>
  );
}
