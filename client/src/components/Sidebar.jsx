import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  CreditCard,
  Users,
  Pill,
  Building,
  Package,
  PlusCircle,
  LogOut,
  Settings,
  HelpCircle,
  Headphones
} from 'lucide-react';
import { Activity } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const roleNavItems = {
    patient: [
      { path: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/patient/book', label: 'Appointments', icon: Calendar },
      { path: '/patient/history', label: 'Records', icon: FileText },
      { path: '/patient/bills', label: 'Billing', icon: CreditCard },
    ],
    doctor: [
      { path: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/doctor/consultation', label: 'Consult', icon: PlusCircle },
      { path: '/doctor/appointments', label: 'Schedule', icon: Calendar },
      { path: '/doctor/patients', label: 'Patients', icon: Users },
    ],
    pharmacist: [
      { path: '/pharmacy/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/pharmacy/queue', label: 'Queue', icon: Pill },
      { path: '/pharmacy/inventory', label: 'Inventory', icon: Package },
    ],
    admin: [
      { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/admin/users', label: 'Users', icon: Users },
      { path: '/admin/departments', label: 'Departments', icon: Building },
      { path: '/admin/appointments', label: 'Appointments', icon: Calendar },
      { path: '/admin/billing', label: 'Billing', icon: CreditCard },
    ],
  };

  const navItems = roleNavItems[user.role] || [];

  return (
    <aside style={{
      width: '80px',
      backgroundColor: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1.5rem 0',
      height: '100vh',
      position: 'sticky',
      top: '0',
    }}>
      {/* Brand Icon */}
      <div style={{ marginBottom: '2.5rem', color: 'var(--color-accent)' }}>
        <Activity size={32} strokeWidth={2.5} />
      </div>

      {/* Navigation Icons */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, width: '100%', alignItems: 'center' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={item.label}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                color: isActive ? 'var(--color-accent)' : 'var(--text-muted)',
                backgroundColor: isActive ? 'var(--color-accent-light)' : 'transparent',
                transition: 'var(--transition)',
              })}
              className={({ isActive }) => !isActive ? 'hover-nav' : ''}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Icons (Settings, Support, Logout) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', alignItems: 'center' }}>
        <button title="Support" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}>
          <Headphones size={22} strokeWidth={2} />
        </button>
        <button title="Help" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}>
          <HelpCircle size={22} strokeWidth={2} />
        </button>
        <button title="Settings" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}>
          <Settings size={22} strokeWidth={2} />
        </button>
        <button title="Logout" onClick={logout} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem', marginTop: '0.5rem' }}>
          <LogOut size={22} strokeWidth={2} />
        </button>
      </div>

      <style>{`
        .hover-nav:hover {
          color: var(--color-primary) !important;
          background-color: var(--color-primary-light) !important;
        }
      `}</style>
    </aside>
  );
}
