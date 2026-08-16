import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, Settings, Plus, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <header className="soft-card" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem 1.5rem',
      marginBottom: '2rem',
      position: 'sticky',
      top: '1rem',
      zIndex: 100,
    }}>
      {/* Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', flex: 1, maxWidth: '400px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search"
            style={{ paddingLeft: '2.5rem', border: 'none', backgroundColor: 'var(--bg-app)', boxShadow: 'none' }}
          />
        </div>
      </div>

      {/* URL or Page Title Placeholder */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem 1rem',
        backgroundColor: 'var(--bg-app)',
        borderRadius: '9999px',
        fontSize: '0.8rem',
        fontWeight: 600,
        color: 'var(--text-secondary)'
      }}>
        meditrack.io
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn-icon">
          <CalendarIcon />
        </button>
        <button className="btn-icon" style={{ position: 'relative' }}>
          <Bell size={18} />
          <span style={{
            position: 'absolute',
            top: '8px',
            right: '10px',
            width: '6px',
            height: '6px',
            backgroundColor: 'var(--color-danger)',
            borderRadius: '50%'
          }}></span>
        </button>

        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-light)', margin: '0 0.5rem' }}></div>

        {/* User Profile Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
          <div className="avatar">
            {user.first_name[0]}{user.last_name[0]}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {user.first_name} {user.last_name}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
              {user.role}
            </span>
          </div>
          <ChevronDown size={16} color="var(--text-muted)" />
        </div>
      </div>
    </header>
  );
}

// Simple Calendar icon wrapper for visual consistency with screenshot
function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}
