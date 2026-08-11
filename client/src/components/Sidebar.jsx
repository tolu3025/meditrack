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
      { path: '/patient/history', label: 'EHR Medical History', icon: FileText },
      { path: '/patient/bills', label: 'Hospital Invoices', icon: CreditCard },
    ],
    doctor: [
      { path: '/doctor/dashboard', label: 'Workstation Queue', icon: LayoutDashboard },
      { path: '/doctor/consultation', label: 'New EHR Consultation', icon: PlusCircle },
      { path: '/doctor/appointments', label: 'Schedule Calendar', icon: Calendar },
      { path: '/doctor/patients', label: 'Patient EHR Lookup', icon: Users },
    ],
    pharmacist: [
      { path: '/pharmacy/dashboard', label: 'Dispensary Queue', icon: LayoutDashboard },
      { path: '/pharmacy/queue', label: 'Pending Prescriptions', icon: Pill },
      { path: '/pharmacy/inventory', label: 'Medication Inventory', icon: Package },
    ],
    admin: [
      { path: '/admin/dashboard', label: 'Executive Analytics', icon: LayoutDashboard },
      { path: '/admin/users', label: 'User Accounts', icon: Users },
      { path: '/admin/departments', label: 'Departments', icon: Building },
      { path: '/admin/appointments', label: 'Hospital Appointments', icon: Calendar },
      { path: '/admin/billing', label: 'Invoices & Revenue', icon: CreditCard },
    ],
  };

  const navItems = roleNavItems[user.role] || [];

  return (
    <aside style={{
      width: '230px',
      backgroundColor: '#111827',
      borderRight: '1px solid #374151',
      padding: '1.25rem 0.75rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4rem',
    }}>
      <div style={{
        padding: '0 0.5rem 0.75rem 0.5rem',
        fontSize: '0.68rem',
        fontWeight: 700,
        color: '#9CA3AF',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        borderBottom: '1px solid #1F2937',
        marginBottom: '0.5rem',
      }}>
        {user.role} WORKSTATION
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
              gap: '0.75rem',
              padding: '0.65rem 0.85rem',
              borderRadius: '4px',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.85rem',
              color: isActive ? '#FFFFFF' : '#D1D5DB',
              backgroundColor: isActive ? '#2563EB' : 'transparent',
              border: isActive ? '1px solid #1D4ED8' : '1px solid transparent',
              transition: 'all 0.15s ease',
            })}
          >
            <Icon size={16} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </aside>
  );
}
