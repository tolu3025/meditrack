import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Calendar, FileText, CreditCard,
  Users, Pill, Building, Package, PlusCircle,
  Settings, HelpCircle, LogOut, Activity
} from 'lucide-react';

const roleItems = {
  patient: [
    { path: '/patient/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { path: '/patient/book',      icon: Calendar,        label: 'Book Appt' },
    { path: '/patient/history',   icon: FileText,        label: 'Records' },
    { path: '/patient/bills',     icon: CreditCard,      label: 'Billing' },
  ],
  doctor: [
    { path: '/doctor/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/doctor/consultation',  icon: PlusCircle,      label: 'Consult' },
    { path: '/doctor/appointments',  icon: Calendar,        label: 'Schedule' },
    { path: '/doctor/patients',      icon: Users,           label: 'Patients' },
  ],
  pharmacist: [
    { path: '/pharmacy/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/pharmacy/queue',      icon: Pill,            label: 'Queue' },
    { path: '/pharmacy/inventory',  icon: Package,         label: 'Inventory' },
  ],
  admin: [
    { path: '/admin/dashboard',     icon: LayoutDashboard, label: 'Analytics' },
    { path: '/admin/users',         icon: Users,           label: 'Users' },
    { path: '/admin/departments',   icon: Building,        label: 'Depts' },
    { path: '/admin/appointments',  icon: Calendar,        label: 'Appts' },
    { path: '/admin/billing',       icon: CreditCard,      label: 'Billing' },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const items = roleItems[user.role] || [];

  return (
    <aside style={{
      width: 72,
      background: '#fff',
      borderRight: '1px solid #F3F4F6',
      height: '100vh',
      position: 'sticky',
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1.25rem 0',
      gap: '0.25rem',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ marginBottom: '1.5rem', color: '#1D4ED8' }}>
        <Activity size={28} strokeWidth={2.5} />
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'center', width: '100%' }}>
        {items.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            title={label}
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.2rem',
              width: 52,
              height: 52,
              borderRadius: 14,
              color: isActive ? '#1D4ED8' : '#9CA3AF',
              background: isActive ? '#EFF6FF' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s',
              cursor: 'pointer',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span style={{ fontSize: '0.5rem', fontWeight: 600, letterSpacing: '0.02em' }}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom icons */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
        <button title="Help" onClick={() => {}} style={{ width: 44, height: 44, borderRadius: 12, background: 'transparent', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <HelpCircle size={20} strokeWidth={1.8} />
        </button>
        <button title="Settings" onClick={() => {}} style={{ width: 44, height: 44, borderRadius: 12, background: 'transparent', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Settings size={20} strokeWidth={1.8} />
        </button>
        <button title="Logout" onClick={logout} style={{ width: 44, height: 44, borderRadius: 12, background: '#FEE2E2', border: 'none', cursor: 'pointer', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LogOut size={18} strokeWidth={2} />
        </button>
      </div>
    </aside>
  );
}
