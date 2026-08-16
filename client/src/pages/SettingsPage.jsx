import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Lock, Bell, Shield, Palette, Save } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifs, setNotifs] = useState({ appointments: true, prescriptions: true, billing: false, general: true });

  const tabs = [
    { id: 'profile',  icon: User,    label: 'Profile' },
    { id: 'security', icon: Lock,    label: 'Security' },
    { id: 'notifs',   icon: Bell,    label: 'Notifications' },
    { id: 'privacy',  icon: Shield,  label: 'Privacy' },
  ];

  const handleSave = () => addToast('Settings saved successfully!', 'success');

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: '#F7F8FA', minHeight: '100%', padding: '2rem' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>Settings</h1>
          <p style={{ color: '#9CA3AF', fontSize: '0.88rem', marginTop: '0.25rem' }}>Manage your account preferences and privacy.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '1.5rem' }}>
          {/* Left: tabs */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', height: 'fit-content' }}>
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 0.9rem', borderRadius: 12, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.84rem', marginBottom: '0.25rem', background: activeTab === t.id ? '#EFF6FF' : 'transparent', color: activeTab === t.id ? '#1D4ED8' : '#6B7280', textAlign: 'left' }}
              >
                <t.icon size={16} />
                {t.label}
              </button>
            ))}
          </div>

          {/* Right: content */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            {activeTab === 'profile' && (
              <div>
                <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111827', marginBottom: '1.5rem' }}>Profile Information</h2>
                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#1D4ED8,#60A5FA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.5rem', color: '#fff' }}>
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#111827' }}>{user?.first_name} {user?.last_name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#9CA3AF', textTransform: 'capitalize' }}>{user?.role}</div>
                  </div>
                </div>
                {[
                  { label: 'First Name',  value: user?.first_name },
                  { label: 'Last Name',   value: user?.last_name },
                  { label: 'Email',       value: user?.email, type: 'email' },
                  { label: 'Phone',       value: '+234 800 000 0000' },
                ].map(f => (
                  <div key={f.label} style={{ marginBottom: '1.1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>{f.label}</label>
                    <input
                      defaultValue={f.value || ''}
                      type={f.type || 'text'}
                      style={{ width: '100%', padding: '0.75rem 1rem', background: '#F9FAFB', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: '0.875rem', color: '#111827', outline: 'none', fontFamily: 'inherit' }}
                      onFocus={e => e.target.style.borderColor = '#1D4ED8'}
                      onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111827', marginBottom: '1.5rem' }}>Security</h2>
                {['Current Password', 'New Password', 'Confirm New Password'].map(f => (
                  <div key={f} style={{ marginBottom: '1.1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>{f}</label>
                    <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '0.75rem 1rem', background: '#F9FAFB', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', color: '#111827' }} onFocus={e => e.target.style.borderColor = '#1D4ED8'} onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                  </div>
                ))}
                <div style={{ background: '#FEF9C3', border: '1.5px solid #FDE68A', borderRadius: 12, padding: '0.9rem 1rem', fontSize: '0.82rem', color: '#92400E', marginTop: '1rem' }}>
                  🔒 Use a strong password of at least 8 characters with numbers and symbols.
                </div>
              </div>
            )}

            {activeTab === 'notifs' && (
              <div>
                <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111827', marginBottom: '1.5rem' }}>Notification Preferences</h2>
                {[
                  { key: 'appointments',  label: 'Appointment reminders',     sub: 'Get notified 24h before your appointment' },
                  { key: 'prescriptions', label: 'Prescription updates',       sub: 'When a prescription is dispensed or ready' },
                  { key: 'billing',       label: 'Billing & invoices',         sub: 'New invoices and payment confirmations' },
                  { key: 'general',       label: 'General announcements',      sub: 'Platform updates and health tips' },
                ].map(n => (
                  <div key={n.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #F3F4F6' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{n.label}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{n.sub}</div>
                    </div>
                    <button
                      onClick={() => setNotifs(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                      style={{
                        width: 44, height: 24, borderRadius: 9999, border: 'none', cursor: 'pointer',
                        background: notifs[n.key] ? '#1D4ED8' : '#E5E7EB',
                        position: 'relative', transition: 'background 0.2s',
                      }}
                    >
                      <span style={{
                        position: 'absolute', top: 3, left: notifs[n.key] ? 23 : 3,
                        width: 18, height: 18, borderRadius: '50%', background: '#fff',
                        transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'privacy' && (
              <div>
                <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111827', marginBottom: '1.5rem' }}>Privacy</h2>
                <div style={{ background: '#F9FAFB', borderRadius: 14, padding: '1.25rem', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 600, color: '#111827', marginBottom: '0.4rem' }}>Data & Privacy</div>
                  <p style={{ fontSize: '0.84rem', color: '#6B7280', lineHeight: 1.7 }}>MediTrack is fully HIPAA-compliant. Your health data is encrypted, never sold, and only shared with your care team upon consent.</p>
                </div>
                <button onClick={() => addToast('Data export request submitted', 'info')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.25rem', background: '#F9FAFB', border: '1.5px solid #E5E7EB', borderRadius: 9999, fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', color: '#374151', fontFamily: 'inherit', marginBottom: '0.75rem' }}>
                  Export my data
                </button>
                <button onClick={() => addToast('Account deletion requires email verification. Check your inbox.', 'info')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.25rem', background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: 9999, fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', color: '#DC2626', fontFamily: 'inherit' }}>
                  Delete account
                </button>
              </div>
            )}

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #F3F4F6' }}>
              <button
                onClick={handleSave}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', background: '#1D4ED8', color: '#fff', border: 'none', borderRadius: 9999, fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <Save size={15} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
