import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Search, Bell, User, ChevronDown, LogOut, Settings, HelpCircle, X } from 'lucide-react';

const roleTabMap = {
  patient: [
    { path: '/patient/dashboard', label: 'Overview' },
    { path: '/patient/history',   label: 'Documents' },
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
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const dropRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user) return null;

  const tabs = roleTabMap[user.role] || [];

  return (
    <header style={{
      height: 60, background: '#fff', borderBottom: '1px solid #F3F4F6',
      display: 'flex', alignItems: 'center', padding: '0 1.25rem',
      justifyContent: 'space-between',
      gap: '1rem', position: 'sticky', top: 0, zIndex: 100, flexShrink: 0,
    }}>
      {/* Tab nav */}
      {!isMobile ? (
        <nav style={{ display: 'flex', gap: '0.25rem', background: '#F3F4F6', borderRadius: 9999, padding: '0.25rem', flex: 1, overflow: 'hidden', maxWidth: 'max-content' }}>
          {tabs.map(t => (
            <NavLink
              key={t.path}
              to={t.path}
              style={({ isActive }) => ({
                padding: '0.35rem 1rem', borderRadius: 9999,
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.82rem',
                color: isActive ? '#111827' : '#6B7280',
                background: isActive ? '#fff' : 'transparent',
                boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                textDecoration: 'none', transition: 'all 0.15s', whiteSpace: 'nowrap',
              })}
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={20} color="#1D4ED8" strokeWidth={2.5} />
          <span style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>MediTrack</span>
        </div>
      )}

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        {/* Search */}
        {searchOpen ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F3F4F6', borderRadius: 9999, padding: '0.35rem 0.75rem' }}>
            <Search size={14} color="#6B7280" />
            <input
              autoFocus
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Search…"
              style={{ border: 'none', background: 'transparent', fontSize: '0.82rem', color: '#111827', outline: 'none', width: 140, fontFamily: 'inherit' }}
            />
            <button onClick={() => { setSearchOpen(false); setSearchVal(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0, display: 'flex' }}>
              <X size={14} />
            </button>
          </div>
        ) : (
          <button onClick={() => setSearchOpen(true)} style={{ width: 36, height: 36, borderRadius: '50%', background: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
            <Search size={15} />
          </button>
        )}

        {/* Notifications */}
        <button
          onClick={() => navigate('/notifications')}
          style={{ width: 36, height: 36, borderRadius: '50%', background: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', position: 'relative' }}
          title="Notifications"
        >
          <Bell size={15} />
          <span style={{ position: 'absolute', top: 7, right: 8, width: 6, height: 6, borderRadius: '50%', background: '#EF4444', border: '1.5px solid #fff' }} />
        </button>

        {/* Profile dropdown */}
        <div ref={dropRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileOpen(p => !p)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', padding: '0.35rem 0.5rem', borderRadius: 9999 }}
          >
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1D4ED8', fontWeight: 700, fontSize: '0.82rem' }}>
              {user.first_name?.[0]}{user.last_name?.[0]}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111827', lineHeight: 1 }}>{user.first_name} {user.last_name}</div>
              <div style={{ fontSize: '0.65rem', color: '#9CA3AF', textTransform: 'capitalize' }}>{user.role}</div>
            </div>
            <ChevronDown size={14} color="#9CA3AF" style={{ transform: profileOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
          </button>

          {/* Dropdown menu */}
          {profileOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 0.5rem)', right: 0,
              background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: '1px solid #F3F4F6', minWidth: 200, zIndex: 200,
              overflow: 'hidden',
            }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid #F3F4F6' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>{user.first_name} {user.last_name}</div>
                <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{user.email}</div>
              </div>
              {[
                { icon: User,       label: 'Profile',      action: () => { navigate('/settings'); setProfileOpen(false); } },
                { icon: Settings,   label: 'Settings',     action: () => { navigate('/settings'); setProfileOpen(false); } },
                { icon: HelpCircle, label: 'Help & Support',action: () => { navigate('/help'); setProfileOpen(false); } },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={item.action}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', color: '#374151', fontWeight: 500, fontFamily: 'inherit', textAlign: 'left' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <item.icon size={15} color="#6B7280" />
                  {item.label}
                </button>
              ))}
              <div style={{ borderTop: '1px solid #F3F4F6' }}>
                <button
                  onClick={logout}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', color: '#EF4444', fontWeight: 600, fontFamily: 'inherit', textAlign: 'left' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <LogOut size={15} color="#EF4444" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
