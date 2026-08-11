import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  CreditCard,
  User,
  Users,
  Pill,
  ShieldCheck,
  Building,
  Package,
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;

  const roleNavItems = {
    patient: [
      { path: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/patient/book', label: 'Book Appointment', icon: Calendar },
      { path: '/patient/history', label: 'Medical History', icon: FileText },
      { path: '/patient/bills', label: 'My Bills', icon: CreditCard },
      { path: '/patient/profile', label: 'My Profile', icon: User },
    ],
    doctor: [
      { path: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/doctor/appointments', label: 'Appointments', icon: Calendar },
      { path: '/doctor/patients', label: 'Patient Search & EHR', icon: Users },
      { path: '/doctor/consultation', label: 'New Consultation', icon: FileText },
      { path: '/doctor/prescriptions', label: 'Prescriptions Issued', icon: Pill },
    ],
    pharmacist: [
      { path: '/pharmacy/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/pharmacy/queue', label: 'Pending Queue', icon: Pill },
      { path: '/pharmacy/inventory', label: 'Medication Inventory', icon: Package },
    ],
    admin: [
      { path: '/admin/dashboard', label: 'Analytics Dashboard', icon: LayoutDashboard },
      { path: '/admin/users', label: 'User Management', icon: Users },
      { path: '/admin/departments', label: 'Departments', icon: Building },
      { path: '/admin/appointments', label: 'All Appointments', icon: Calendar },
      { path: '/admin/billing', label: 'Billing & Invoices', icon: CreditCard },
    ],
  };

  const navItems = roleNavItems[user.role] || [];

  return (
    <aside style={{
      width: '240px',
      background: '#1E293B',
      borderRight: '1px solid rgba(255,255,255,0.08)',
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    }}>
      <div style={{ padding: '0 0.5rem 1rem 0.5rem', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {user.role} NAVIGATION
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.9rem',
              color: isActive ? '#0EA5E9' : '#94A3B8',
              backgroundColor: isActive ? 'rgba(14, 165, 233, 0.12)' : 'transparent',
              border: isActive ? '1px solid rgba(14, 165, 233, 0.25)' : '1px solid transparent',
              transition: 'all 0.2s ease',
            })}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </aside>
  );
}
