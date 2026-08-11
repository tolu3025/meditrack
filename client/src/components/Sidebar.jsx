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
  Building,
  Package,
  PlusCircle,
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;

  const roleNavItems = {
    patient: [
      { path: '/patient/dashboard', label: 'Overview', icon: LayoutDashboard },
      { path: '/patient/book', label: 'Book Appointment', icon: Calendar },
      { path: '/patient/history', label: 'EHR Health History', icon: FileText },
      { path: '/patient/bills', label: 'Hospital Invoices', icon: CreditCard },
    ],
    doctor: [
      { path: '/doctor/dashboard', label: 'Workstation', icon: LayoutDashboard },
      { path: '/doctor/consultation', label: 'New Consultation', icon: PlusCircle },
      { path: '/doctor/appointments', label: 'Schedule Calendar', icon: Calendar },
      { path: '/doctor/patients', label: 'Patient EHR Search', icon: Users },
    ],
    pharmacist: [
      { path: '/pharmacy/dashboard', label: 'Workstation', icon: LayoutDashboard },
      { path: '/pharmacy/queue', label: 'Pending Dispense Queue', icon: Pill },
      { path: '/pharmacy/inventory', label: 'Drug Inventory', icon: Package },
    ],
    admin: [
      { path: '/admin/dashboard', label: 'Executive Analytics', icon: LayoutDashboard },
      { path: '/admin/users', label: 'User Accounts', icon: Users },
      { path: '/admin/departments', label: 'Departments', icon: Building },
      { path: '/admin/appointments', label: 'Hospital Appointments', icon: Calendar },
      { path: '/admin/billing', label: 'Revenue & Invoices', icon: CreditCard },
    ],
  };

  const navItems = roleNavItems[user.role] || [];

  return (
    <aside style={{
      width: '250px',
      background: 'rgba(11, 17, 32, 0.98)',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '1.75rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.6rem',
    }}>
      <div style={{
        padding: '0 0.75rem 0.75rem 0.75rem',
        fontSize: '0.7rem',
        fontWeight: 800,
        color: '#64748B',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}>
        {user.role} Navigation
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
              padding: '0.8rem 1rem',
              borderRadius: '12px',
              fontWeight: isActive ? 800 : 600,
              fontSize: '0.88rem',
              color: isActive ? '#06B6D4' : '#94A3B8',
              backgroundColor: isActive ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
              border: isActive ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid transparent',
              boxShadow: isActive ? '0 0 15px rgba(6, 182, 212, 0.15)' : 'none',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
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
