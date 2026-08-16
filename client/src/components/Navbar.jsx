import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Search, Bell, ChevronDown, User } from 'lucide-react';

const roleTabMap = {
  patient: [
    { path: '/patient/dashboard', label: 'Overview' },
    { path: '/patient/history',   label: 'Document' },
    { path: '/patient/bills',     label: 'Billing' },
    { path: '/patient/book',      label: 'Book Appt' },
  ],
  doctor: [
    { path: '/doctor/dashboard',    label: 'Overview' },
    { path: '/doctor/consultation', label: 'Consult' },
    { path: '/doctor/appointments', label: 'Schedule' },
    { path: '/doctor/patients',     label: 'Patients' },
  ],
  pharmacist: [
    { path: '/pharmacy/dashboard',  label: 'Overview' },
    { path: '/pharmacy/queue',      label: 'Queue' },
    { path: '/pharmacy/inventory',  label: 'Inventory' },
  ],
  admin: [
    { path: '/admin/dashboard',    label: 'Overview' },
    { path: '/admin/users',        label: 'Users' },
    { path: '/admin/departments',  label: 'Departments' },
    { path: '/admin/appointments', label: 'Appointments' },
    { path: '/admin/billing',      label: 'Billing' },
  ],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const tabs = roleTabMap[user.role] || [];

  return (
    <header style={{
      height: 60,
      background: '#fff',
      borderBottom: '1px solid #F3F4F6',
      display: 'flex',
      alignItems: 'center',
      padding: '0 1.5rem',
      gap: '1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      flexShrink: 0,
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, background: '#EFF6FF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Activity size={18} color="#1D4ED8" strokeWidth={2.5} />
        </div>
        <span style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', letterSpacing: '-0.02em' }}>MediTrack</span>
      </div>

      {/* Tab nav (pill-shaped, Mediscan style) */}
      <nav style={{ display: 'flex', gap: '0.25rem', background: '#F3F4F6', borderRadius: 9999, padding: '0.25rem', flex: 1 }}>
        {tabs.map(t => (
          <NavLink
            key={t.path}
            to={t.path}
            style={({ isActive }) => ({
              padding: '0.35rem 1rem',
              borderRadius: 9999,
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.82rem',
              color: isActive ? '#111827' : '#6B7280',
              background: isActive ? '#fff' : 'transparent',
              boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              textDecoration: 'none',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            })}
          >
            {t.label}
          </NavLink>
        ))}
      </nav>

      {/* Right side actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
        <button style={{ width: 36, height: 36, borderRadius: '50%', background: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
          <Search size={16} />
        </button>
        <button style={{ width: 36, height: 36, borderRadius: '50%', background: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', position: 'relative' }}>
          <Bell size={16} />
          <span style={{ position: 'absolute', top: 7, right: 8, width: 6, height: 6, borderRadius: '50%', background: '#EF4444', border: '1.5px solid #fff' }} />
        </button>
        <button style={{ width: 36, height: 36, borderRadius: '50%', background: '#EFF6FF', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1D4ED8' }}>
          <User size={16} />
        </button>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', paddingLeft: '0.5rem', borderLeft: '1px solid #F3F4F6' }}
          onClick={logout}
          title="Logout"
        >
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111827', lineHeight: 1 }}>{user.first_name} {user.last_name}</div>
            <div style={{ fontSize: '0.65rem', color: '#9CA3AF', textTransform: 'capitalize' }}>{user.role}</div>
          </div>
          <ChevronDown size={14} color="#9CA3AF" />
        </div>
      </div>
    </header>
  );
}
