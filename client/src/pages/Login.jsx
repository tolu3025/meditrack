import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Lock, Mail, AlertCircle, Shield, Stethoscope, Pill, User } from 'lucide-react';

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
    { role: 'Admin', email: 'admin@meditrack.ng', icon: Shield },
    { role: 'Doctor', email: 'dr.emeka@meditrack.ng', icon: Stethoscope },
    { role: 'Pharmacist', email: 'pharm.chioma@meditrack.ng', icon: Pill },
    { role: 'Patient', email: 'patient1@gmail.com', icon: User },
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
      backgroundColor: '#0B0F19',
      padding: '1.5rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        backgroundColor: '#1F2937',
        border: '1px solid #374151',
        borderRadius: '4px',
        padding: '2.25rem 2rem',
      }}>
        {/* Header */}
        <div style={{ borderBottom: '1px solid #374151', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#2563EB',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Activity size={22} color="#FFFFFF" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                MEDITRACK HMS
              </h1>
              <p style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
                Enterprise Hospital Management Platform
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#7F1D1D',
            border: '1px solid #DC2626',
            borderRadius: '4px',
            padding: '0.75rem 1rem',
            color: '#FCA5A5',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.25rem',
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Demo Account Selector */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label className="form-label" style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
            Demo Quick Login Presets:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
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
                    padding: '0.5rem 0.75rem',
                    borderRadius: '4px',
                    backgroundColor: isSelected ? '#2563EB' : '#111827',
                    border: '1px solid',
                    borderColor: isSelected ? '#3B82F6' : '#374151',
                    color: isSelected ? '#FFFFFF' : '#D1D5DB',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  <Icon size={14} />
                  <span>{account.role}</span>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Workstation Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#9CA3AF" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="user@meditrack.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#9CA3AF" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
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
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In to System'}
          </button>
        </form>
      </div>
    </div>
  );
}
