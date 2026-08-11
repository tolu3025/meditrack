import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, LogOut, User as UserIcon, Shield, Stethoscope, Pill } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const roleMeta = {
    patient: { color: '#3B82F6', label: 'PATIENT', icon: UserIcon },
    doctor: { color: '#10B981', label: 'DOCTOR', icon: Stethoscope },
    pharmacist: { color: '#F59E0B', label: 'PHARMACY', icon: Pill },
    admin: { color: '#EF4444', label: 'ADMINISTRATOR', icon: Shield },
  };

  const meta = roleMeta[user.role] || { color: '#3B82F6', label: user.role.toUpperCase(), icon: UserIcon };
  const RoleIcon = meta.icon;

  return (
    <header style={{
      backgroundColor: '#111827',
      borderBottom: '1px solid #374151',
      padding: '0.75rem 1.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '32px',
          height: '32px',
          backgroundColor: '#2563EB',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Activity size={20} color="#FFFFFF" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{
            fontSize: '1.15rem',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-0.01em',
          }}>
            MEDITRACK HMS
          </span>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '0.15rem 0.5rem',
            borderRadius: '2px',
            backgroundColor: '#1F2937',
            color: meta.color,
            border: `1px solid ${meta.color}`,
            textTransform: 'uppercase',
          }}>
            {meta.label}
          </span>
        </div>
      </div>

      {/* User Information & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#1F2937',
          padding: '0.35rem 0.75rem',
          borderRadius: '4px',
          border: '1px solid #374151',
        }}>
          <RoleIcon size={14} color={meta.color} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F9FAFB' }}>
            {user.first_name} {user.last_name}
          </span>
        </div>

        <button
          onClick={logout}
          className="btn btn-secondary btn-sm"
          style={{ cursor: 'pointer' }}
          title="Sign Out"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
