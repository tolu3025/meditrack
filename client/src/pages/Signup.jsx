import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Mail, Lock, Eye, EyeOff, User, CheckCircle, ArrowLeft } from 'lucide-react';

export default function Signup() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/patient/dashboard', { replace: true });
  }, [user, navigate]);

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.first_name.trim() || !form.last_name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await register({
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: 'patient',
    });
    setLoading(false);

    if (res && res.success) {
      setSuccess('Account created! Redirecting to your dashboard...');
      setTimeout(() => navigate('/patient/dashboard', { replace: true }), 800);
    } else {
      setError((res && res.message) || 'Registration failed. Please try again.');
    }
  };

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    padding: '0.9rem 1rem 0.9rem 2.75rem',
    background: '#F9FAFB', border: '1.5px solid #E5E7EB',
    borderRadius: '14px', color: '#111827', fontSize: '0.9rem',
    fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block', fontSize: '0.85rem', fontWeight: 600,
    color: '#374151', marginBottom: '0.5rem',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F0FDF4 0%, #EFF6FF 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem', fontFamily: "'Outfit', sans-serif",
    }}>
      <div style={{
        background: '#FFFFFF', borderRadius: '28px',
        padding: '2.75rem 2.5rem', width: '100%', maxWidth: '460px',
        boxShadow: '0 20px 60px rgba(29,78,216,0.12)',
        border: '1px solid rgba(229,231,235,0.8)',
      }}>
        {/* Back link */}
        <Link to="/login" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
          color: '#6B7280', fontSize: '0.82rem', fontWeight: 500,
          textDecoration: 'none', marginBottom: '1.5rem',
        }}>
          <ArrowLeft size={15} /> Back to login
        </Link>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'linear-gradient(135deg,#059669,#10B981)',
            borderRadius: '18px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 1rem auto',
            boxShadow: '0 8px 24px rgba(5,150,105,0.25)',
          }}>
            <Activity size={28} color="#fff" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
            Create Account
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
            Join MediTrack — your health, managed
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#FEF2F2', color: '#DC2626',
            padding: '0.9rem 1rem', borderRadius: '14px',
            marginBottom: '1.25rem', fontSize: '0.875rem',
            border: '1px solid #FECACA',
            display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
          }}>
            <span style={{ flexShrink: 0 }}>&#x26A0;</span>
            <span>{error}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div style={{
            background: '#F0FDF4', color: '#059669',
            padding: '0.9rem 1rem', borderRadius: '14px',
            marginBottom: '1.25rem', fontSize: '0.875rem',
            border: '1px solid #A7F3D0',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <CheckCircle size={16} /> {success}
          </div>
        )}

        <form onSubmit={handleSignup}>
          {/* Name row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            {[['first_name', 'First Name', 'John'], ['last_name', 'Last Name', 'Doe']].map(([field, label, ph]) => (
              <div key={field}>
                <label style={labelStyle}>{label}</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} color="#9CA3AF" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    value={form[field]}
                    onChange={update(field)}
                    placeholder={ph}
                    required
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#059669'}
                    onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} color="#9CA3AF" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="you@example.com"
                required
                autoComplete="email"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#059669'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} color="#9CA3AF" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={update('password')}
                placeholder="Min. 6 characters"
                required
                autoComplete="new-password"
                style={{ ...inputStyle, paddingRight: '3rem' }}
                onFocus={e => e.target.style.borderColor = '#059669'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#9CA3AF' }}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={labelStyle}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} color="#9CA3AF" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                type="password"
                value={form.confirm}
                onChange={update('confirm')}
                placeholder="Repeat password"
                required
                autoComplete="new-password"
                style={{
                  ...inputStyle,
                  borderColor: form.confirm && form.password !== form.confirm ? '#EF4444' : '#E5E7EB',
                }}
                onFocus={e => e.target.style.borderColor = '#059669'}
                onBlur={e => e.target.style.borderColor = form.confirm && form.password !== form.confirm ? '#EF4444' : '#E5E7EB'}
              />
            </div>
            {form.confirm && form.password !== form.confirm && (
              <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.35rem' }}>Passwords don't match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '0.95rem',
              background: loading ? '#6EE7B7' : 'linear-gradient(135deg,#059669,#10B981)',
              color: '#fff', border: 'none', borderRadius: '14px',
              fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(5,150,105,0.35)',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)',
                  borderTop: '2px solid #fff', borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite', display: 'inline-block',
                }} />
                Creating account…
              </>
            ) : 'Create My Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: '#9CA3AF' }}>
          Your account will be registered as a <strong style={{ color: '#374151' }}>Patient</strong>.{' '}
          Contact admin to change your role.
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
