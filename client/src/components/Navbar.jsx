import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const roleColors = {
    patient: '#0EA5E9',
    doctor: '#10B981',
    pharmacist: '#F59E0B',
    admin: '#EC4899',
  };

  return (
    <header style={{
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      padding: '0.9rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(14, 165, 233, 0.4)',
        }}>
          <Activity size={22} color="#FFF" />
        </div>
        <div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #FFF, #94A3B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            MEDITRACK
          </span>
          <span style={{ fontSize: '0.65rem', display: 'block', color: '#0EA5E9', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Hospital Management System
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: 'rgba(30, 41, 59, 0.6)',
          padding: '0.4rem 0.85rem',
          borderRadius: '9999px',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <UserIcon size={16} color="#94A3B8" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            {user.first_name} {user.last_name}
          </span>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 800,
            padding: '0.15rem 0.5rem',
            borderRadius: '9999px',
            backgroundColor: `${roleColors[user.role] || '#0EA5E9'}20`,
            color: roleColors[user.role] || '#0EA5E9',
            border: `1px solid ${roleColors[user.role] || '#0EA5E9'}50`,
            textTransform: 'uppercase',
          }}>
            {user.role}
          </span>
        </div>

        <button
          onClick={logout}
          className="btn btn-secondary btn-sm"
          style={{ cursor: 'pointer' }}
          title="Sign Out"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
