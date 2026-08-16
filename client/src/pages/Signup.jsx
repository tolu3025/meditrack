import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Mail, Lock, ArrowLeft, User } from 'lucide-react';

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await register({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      role: 'patient' // Defaulting to patient for public signup
    });
    setLoading(false);
    if (res && res.success) {
      navigate('/patient/dashboard');
    } else {
      setError((res && res.message) || 'Registration failed. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F7F8FA',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: "'Outfit', sans-serif"
    }}>
      {/* Back to home */}
      <Link to="/" style={{
        position: 'absolute', top: '1.5rem', left: '2rem',
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        color: '#6B7280', fontSize: '0.85rem', fontWeight: 500,
        textDecoration: 'none'
      }}>
        <ArrowLeft size={16} /> Back to home
      </Link>

      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: '3rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
        border: '1px solid #F3F4F6'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '52px', height: '52px',
            background: '#EFF6FF',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem auto'
          }}>
            <Activity size={28} color="#1D4ED8" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827', marginBottom: '0.4rem' }}>
            Create an Account
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
            Join MediTrack to manage your health
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#FEE2E2',
            color: '#DC2626',
            padding: '0.85rem 1rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            border: '1px solid #FECACA'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            {/* First Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                First Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#9CA3AF" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                  style={{
                    width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem',
                    background: '#F9FAFB', border: '1.5px solid #E5E7EB',
                    borderRadius: '12px', color: '#111827', fontSize: '0.9rem',
                    fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#1D4ED8'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Last Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#9CA3AF" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                  style={{
                    width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem',
                    background: '#F9FAFB', border: '1.5px solid #E5E7EB',
                    borderRadius: '12px', color: '#111827', fontSize: '0.9rem',
                    fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#1D4ED8'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1rem' }}>
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
                style={{
                  width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem',
                  background: '#F9FAFB', border: '1.5px solid #E5E7EB',
                  borderRadius: '12px', color: '#111827', fontSize: '0.9rem',
                  fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#1D4ED8'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#9CA3AF" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem',
                  background: '#F9FAFB', border: '1.5px solid #E5E7EB',
                  borderRadius: '12px', color: '#111827', fontSize: '0.9rem',
                  fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#1D4ED8'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '0.9rem', background: loading ? '#93C5FD' : '#1D4ED8',
              color: '#fff', border: 'none', borderRadius: '9999px', fontWeight: 700,
              fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', transition: 'background 0.2s'
            }}
          >
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#1D4ED8', fontWeight: 600, textDecoration: 'none' }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
