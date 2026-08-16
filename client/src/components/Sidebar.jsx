import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Calendar, FileText, CreditCard,
  Users, Pill, Building, Package, PlusCircle, Activity
} from 'lucide-react';

const roleItems = {
  patient: [
    { path: '/patient/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { path: '/patient/book',      icon: Calendar,        label: 'Book' },
    { path: '/patient/history',   icon: FileText,        label: 'Records' },
    { path: '/patient/bills',     icon: CreditCard,      label: 'Billing' },
  ],
  doctor: [
    { path: '/doctor/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/doctor/consultation', icon: PlusCircle,      label: 'Consult' },
    { path: '/doctor/appointments', icon: Calendar,        label: 'Schedule' },
    { path: '/doctor/patients',     icon: Users,           label: 'Patients' },
  ],
  pharmacist: [
    { path: '/pharmacy/dashboard', icon: LayoutDashboard, label: 'Home' },
    { path: '/pharmacy/queue',     icon: Pill,            label: 'Queue' },
    { path: '/pharmacy/inventory', icon: Package,         label: 'Stock' },
  ],
  admin: [
    { path: '/admin/dashboard',    icon: LayoutDashboard, label: 'Analytics' },
    { path: '/admin/users',        icon: Users,           label: 'Users' },
    { path: '/admin/departments',  icon: Building,        label: 'Depts' },
    { path: '/admin/appointments', icon: Calendar,        label: 'Appts' },
    { path: '/admin/billing',      icon: CreditCard,      label: 'Billing' },
  ],
};

export default function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;
  const items = roleItems[user.role] || [];

  return (
    <aside style={{
      width: 72, background: '#fff', borderRight: '1px solid #F3F4F6',
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: '1rem 0', gap: '0.25rem', flexShrink: 0,
    }}>
      {/* NO LOGO HERE — Navbar has the brand */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem', alignItems: 'center', width: '100%', paddingTop: '0.5rem' }}>
        {items.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            title={label}
            style={({ isActive }) => ({
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '0.2rem', width: 52, height: 52, borderRadius: 14,
              color: isActive ? '#1D4ED8' : '#9CA3AF',
              background: isActive ? '#EFF6FF' : 'transparent',
              textDecoration: 'none', transition: 'all 0.15s',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span style={{ fontSize: '0.48rem', fontWeight: 600, letterSpacing: '0.02em', textAlign: 'center' }}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
