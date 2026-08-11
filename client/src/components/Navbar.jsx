import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, LogOut, User as UserIcon, Shield, Stethoscope, Pill } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const roleMeta = {
    patient: { color: '#06B6D4', label: 'PATIENT PORTAL', icon: UserIcon },
    doctor: { color: '#10B981', label: 'DOCTOR CLINICAL', icon: Stethoscope },
    pharmacist: { color: '#F59E0B', label: 'PHARMACY DISPENSARY', icon: Pill },
    admin: { color: '#F43F5E', label: 'EXECUTIVE ADMIN', icon: Shield },
  };

  const meta = roleMeta[user.role] || { color: '#06B6D4', label: user.role.toUpperCase(), icon: UserIcon };
  const RoleIcon = meta.icon;

  return (
    <header style={{
      background: 'rgba(11, 17, 32, 0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0.9rem 2.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
    }}>
      {/* Brand & System Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
        }}>
          <Activity size={24} color="#FFF" />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.3rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(90deg, #FFFFFF, #94A3B8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              MEDITRACK
            </span>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 800,
              padding: '0.15rem 0.55rem',
              borderRadius: '9999px',
              backgroundColor: `${meta.color}20`,
              color: meta.color,
              border: `1px solid ${meta.color}40`,
              letterSpacing: '0.06em',
            }}>
              {meta.label}
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            Hospital EHR System Online
          </span>
        </div>
      </div>

      {/* User Profile Chip & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: 'rgba(30, 41, 59, 0.7)',
          padding: '0.45rem 1rem',
          borderRadius: '9999px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: `${meta.color}25`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${meta.color}60`,
          }}>
            <RoleIcon size={15} color={meta.color} />
          </div>
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#F8FAFC' }}>
            {user.first_name} {user.last_name}
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
