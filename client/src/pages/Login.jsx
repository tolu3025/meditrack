import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

const ROLE_DASHBOARDS = {
  admin: '/admin/dashboard',
  doctor: '/doctor/dashboard',
  pharmacist: '/pharmacy/dashboard',
  patient: '/patient/dashboard',
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect immediately
  useEffect(() => {
    if (user) {
      navigate(ROLE_DASHBOARDS[user.role] || '/patient/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);

    const res = await login(email.trim(), password);
    setLoading(false);

    if (res && res.success) {
      setSuccess('Login successful! Redirecting...');
      const dest = ROLE_DASHBOARDS[res.user?.role] || '/patient/dashboard';
      setTimeout(() => navigate(dest, { replace: true }), 600);
    } else {
      setError((res && res.message) || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      fontFamily: "'Outfit', sans-serif",
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '28px',
        padding: '2.75rem 2.5rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(29,78,216,0.12)',
        border: '1px solid rgba(229,231,235,0.8)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'linear-gradient(135deg,#1D4ED8,#3B82F6)',
            borderRadius: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            boxShadow: '0 8px 24px rgba(29,78,216,0.25)',
          }}>
            <Activity size={28} color="#fff" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
            Welcome Back
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>
            Sign in to your MediTrack account
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div style={{
            background: '#FEF2F2',
            color: '#DC2626',
            padding: '0.9rem 1rem',
            borderRadius: '14px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            border: '1px solid #FECACA',
            display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
          }}>
            <span style={{ flexShrink: 0, marginTop: '0.1rem' }}>&#x26A0;</span>
            <span>{error}</span>
          </div>
        )}

        {/* Success banner */}
        {success && (
          <div style={{
            background: '#F0FDF4',
            color: '#059669',
            padding: '0.9rem 1rem',
            borderRadius: '14px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            border: '1px solid #A7F3D0',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <CheckCircle size={16} />
            {success}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#9CA3AF" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '0.9rem 1rem 0.9rem 2.75rem',
                  background: '#F9FAFB', border: '1.5px solid #E5E7EB',
                  borderRadius: '14px', color: '#111827', fontSize: '0.9rem',
                  fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#1D4ED8'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#9CA3AF" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '0.9rem 3rem 0.9rem 2.75rem',
                  background: '#F9FAFB', border: '1.5px solid #E5E7EB',
                  borderRadius: '14px', color: '#111827', fontSize: '0.9rem',
                  fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#1D4ED8'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#9CA3AF' }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '0.95rem',
              background: loading ? '#93C5FD' : 'linear-gradient(135deg,#1D4ED8,#2563EB)',
              color: '#fff', border: 'none', borderRadius: '14px',
              fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(29,78,216,0.35)',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)',
                  borderTop: '2px solid #fff', borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                  display: 'inline-block',
                }} />
                Signing in…
              </>
            ) : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#1D4ED8', fontWeight: 700, textDecoration: 'none' }}>
              Create account
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
