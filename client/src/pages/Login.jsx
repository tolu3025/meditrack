import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      if (res.user.role === 'admin') navigate('/admin/dashboard');
      else if (res.user.role === 'doctor') navigate('/doctor/dashboard');
      else if (res.user.role === 'pharmacist') navigate('/pharmacy/dashboard');
      else navigate('/patient/dashboard');
    } else {
      setError(res.message);
    }
  };

  const loadDemo = (role) => {
    const demos = {
      admin: { e: 'admin@meditrack.ng', p: 'Password123!' },
      doctor: { e: 'dr.emeka@meditrack.ng', p: 'Password123!' },
      pharmacy: { e: 'pharm.chioma@meditrack.ng', p: 'Password123!' },
      patient: { e: 'patient1@gmail.com', p: 'Password123!' },
    };
    setEmail(demos[role].e);
    setPassword(demos[role].p);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="soft-card" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'var(--color-primary-light)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            color: 'var(--color-primary)'
          }}>
            <Activity size={28} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Sign in to continue to MediTrack.</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Email Address</label>
            <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '2.25rem' }} />
            <input
              type="email"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group" style={{ position: 'relative', marginBottom: '2rem' }}>
            <label className="form-label">Password</label>
            <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '2.25rem' }} />
            <input
              type="password"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Demo Quick Login Presets
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
             <button type="button" onClick={() => loadDemo('patient')} className="btn btn-secondary btn-sm" style={{ padding: '0.5rem' }}>Patient</button>
             <button type="button" onClick={() => loadDemo('doctor')} className="btn btn-secondary btn-sm" style={{ padding: '0.5rem' }}>Doctor</button>
             <button type="button" onClick={() => loadDemo('pharmacy')} className="btn btn-secondary btn-sm" style={{ padding: '0.5rem' }}>Pharmacy</button>
             <button type="button" onClick={() => loadDemo('admin')} className="btn btn-secondary btn-sm" style={{ padding: '0.5rem' }}>Admin</button>
          </div>
        </div>
      </div>
    </div>
  );
}
