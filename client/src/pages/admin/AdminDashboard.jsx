import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { apiRequest } from '../../utils/api';
import { Users, Calendar, CreditCard, TrendingUp, Activity, RefreshCw, AlertCircle, Building, Plus, CheckCircle, Clock } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, CartesianGrid, Legend,
} from 'recharts';
import LoadingSpinner from '../../components/LoadingSpinner';

const PIE_COLORS = ['#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED', '#0891B2'];

export default function AdminDashboard() {
  const { pathname } = useLocation();
  const [stats, setStats] = useState(null);
  const [revenueStats, setRevenueStats] = useState(null);
  const [apptStats, setApptStats] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [allInvoices, setAllInvoices] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastRefresh, setLastRefresh] = useState(null);

  // New Department Form State
  const [deptForm, setDeptForm] = useState({ name: '', description: '', location: '' });
  const [submittingDept, setSubmittingDept] = useState(false);

  const fetchData = useCallback(async () => {
    setError('');
    try {
      // 1. Fetch default overview stats
      const [statsRes, revRes, apptRes] = await Promise.all([
        apiRequest('/admin/dashboard'),
        apiRequest('/admin/revenue'),
        apiRequest('/admin/appointments'),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      else setError(statsRes.message || 'Failed to load dashboard stats.');

      if (revRes.success) setRevenueStats(revRes.data);
      if (apptRes.success) setApptStats(apptRes.data);

      // 2. Fetch specific tab stats conditionally or in parallel
      if (pathname.includes('/departments')) {
        const deptRes = await apiRequest('/admin/departments');
        if (deptRes.success) setDepartments(deptRes.data);
      } else if (pathname.includes('/appointments')) {
        const apptListRes = await apiRequest('/appointments');
        if (apptListRes.success) setAllAppointments(apptListRes.data);
      } else if (pathname.includes('/billing')) {
        const invRes = await apiRequest('/billing/invoices');
        if (invRes.success) setAllInvoices(invRes.data);
      }

      setLastRefresh(new Date());
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [pathname]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData, pathname]);

  const handleCreateDept = async (e) => {
    e.preventDefault();
    if (!deptForm.name) return;
    setSubmittingDept(true);
    try {
      const res = await apiRequest('/admin/departments', 'POST', deptForm);
      if (res.success) {
        setDeptForm({ name: '', description: '', location: '' });
        // reload data
        const deptRes = await apiRequest('/admin/departments');
        if (deptRes.success) setDepartments(deptRes.data);
      } else {
        alert(res.message || 'Failed to create department.');
      }
    } catch (err) {
      alert('Error creating department.');
    } finally {
      setSubmittingDept(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  // Build bar chart from real appointment-by-day data
  const barData = (apptStats?.byDay || []).slice(-8).map(row => ({
    day: row.appointment_date?.slice(5) || '',   // "MM-DD"
    count: parseInt(row.dataValues?.count || row.count || 0, 10),
  }));

  // Build pie from real department distribution
  const pieData = (revenueStats?.departmentDistribution || [])
    .filter(d => parseInt(d.dataValues?.appointment_count || d.appointment_count || 0) > 0)
    .map((d, i) => ({
      name: d.name,
      value: parseInt(d.dataValues?.appointment_count || d.appointment_count || 1, 10),
      color: PIE_COLORS[i % PIE_COLORS.length],
    }));

  const counts = stats?.counts || {};

  // Render Sub-Views based on current URL path
  const renderTabContent = () => {
    if (pathname.includes('/departments')) {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Departments list */}
          <div className="soft-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              Hospital Departments
            </h3>
            {departments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No departments configured.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {departments.map((dept) => (
                  <div key={dept.id} style={{ display: 'flex', gap: '1rem', padding: '1.25rem', background: '#F9FAFB', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Building size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{dept.name}</strong>
                        <span style={{ fontSize: '0.75rem', background: '#E5E7EB', color: '#4B5563', padding: '0.2rem 0.5rem', borderRadius: '8px', fontWeight: 600 }}>
                          {dept.location || 'Main Building'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>{dept.description || 'No description provided.'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Create form */}
          <div className="soft-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              Add Department
            </h3>
            <form onSubmit={handleCreateDept} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Department Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Cardiology"
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Block C, Floor 2"
                  value={deptForm.location}
                  onChange={(e) => setDeptForm({ ...deptForm, location: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: 80, resize: 'vertical' }}
                  placeholder="Enter role responsibilities..."
                  value={deptForm.description}
                  onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={submittingDept}>
                <Plus size={16} /> {submittingDept ? 'Creating...' : 'Create Department'}
              </button>
            </form>
          </div>
        </div>
      );
    }

    if (pathname.includes('/appointments')) {
      return (
        <div className="soft-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            All Scheduled Consultations
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  {['Patient Name', 'Assigned Doctor', 'Department', 'Date', 'Time Slot', 'Status'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No appointments recorded in the system.</td>
                  </tr>
                ) : (
                  allAppointments.map((appt) => (
                    <tr key={appt.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                        {appt.patient?.user?.first_name} {appt.patient?.user?.last_name}
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>
                        Dr. {appt.doctor?.user?.first_name} {appt.doctor?.user?.last_name}
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                        {appt.doctor?.department?.name || 'Hospital Wide'}
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{appt.appointment_date}</td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#F3F4F6', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                          <Clock size={12} /> {appt.start_time}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge badge-${appt.status}`}>
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (pathname.includes('/billing')) {
      return (
        <div className="soft-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            Hospital Revenue & Invoices Ledger
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  {['Invoice ID', 'Patient Name', 'Email', 'Amount', 'Settled Date', 'Status'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No invoices compiled.</td>
                  </tr>
                ) : (
                  allInvoices.map((inv) => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>#{inv.id}</td>
                      <td style={{ padding: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                        {inv.patient?.user?.first_name} {inv.patient?.user?.last_name}
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{inv.patient?.user?.email}</td>
                      <td style={{ padding: '1rem', color: 'var(--text-primary)', fontWeight: 800 }}>₦{Number(inv.total_amount).toLocaleString()}</td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                        {inv.status === 'paid' ? new Date(inv.updated_at).toLocaleDateString() : 'Pending'}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge badge-${inv.status}`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Default Overview
    return (
      <>
        {/* Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: barData.length > 0 ? '2fr 1fr' : '1fr', gap: '1.25rem' }}>
          {/* Appointments trend chart */}
          <div className="soft-card">
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={16} color="var(--color-primary)" />
              Appointment Trend (Last 8 Days)
            </h3>
            {barData.length > 0 ? (
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="2 2" stroke="#E5E7EB" />
                    <XAxis dataKey="day" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                    <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                    <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Appointments" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No appointment data yet. Data will appear here as appointments are booked.
              </div>
            )}
          </div>

          {/* Department distribution pie */}
          {pieData.length > 0 && (
            <div className="soft-card">
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                Dept. Activity
              </h3>
              <div style={{ width: '100%', height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75}>
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                    <Legend wrapperStyle={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Recent Appointments from live data */}
        {stats?.recentAppointments?.length > 0 && (
          <div className="soft-card" style={{ marginTop: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              Recent Appointments
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Patient', 'Doctor', 'Date', 'Status'].map(h => (
                      <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.recentAppointments.map((a, i) => (
                    <tr key={a.id || i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                        {a.patient?.user?.first_name} {a.patient?.user?.last_name}
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-primary)' }}>
                        Dr. {a.doctor?.user?.first_name} {a.doctor?.user?.last_name}
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-secondary)' }}>{a.appointment_date}</td>
                      <td style={{ padding: '0.6rem 0.75rem' }}>
                        <span className={`badge badge-${a.status}`}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {pathname.includes('/departments') ? 'Departments Management' :
             pathname.includes('/appointments') ? 'Appointments Log' :
             pathname.includes('/billing') ? 'Revenue & Billing Ledger' :
             'Executive Dashboard'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Live data from the database
            {lastRefresh && ` · Last refreshed ${lastRefresh.toLocaleTimeString()}`}
          </p>
        </div>
        <button
          onClick={fetchData}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            color: 'var(--text-primary)', borderRadius: '10px', padding: '0.5rem 1rem',
            cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit',
          }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{ background: 'var(--color-danger-light)', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', borderRadius: '12px', padding: '0.85rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Patients', value: counts.totalPatients ?? 0, icon: Users, color: '#2563EB' },
          { label: 'Active Doctors', value: counts.totalDoctors ?? 0, icon: Activity, color: '#059669' },
          { label: "Today's Appointments", value: counts.appointmentsToday ?? 0, icon: Calendar, color: '#D97706' },
          { label: 'Pending Prescriptions', value: counts.pendingPrescriptions ?? 0, icon: TrendingUp, color: '#7C3AED' },
          { label: 'Total Revenue Paid', value: `₦${Number(revenueStats?.totalPaidRevenue || 0).toLocaleString()}`, icon: CreditCard, color: '#059669' },
          { label: 'Unpaid Balance', value: `₦${Number(revenueStats?.totalUnpaidBalance || 0).toLocaleString()}`, icon: CreditCard, color: '#DC2626' },
        ].map((card) => (
          <div key={card.label} className="soft-card" style={{ borderLeft: `4px solid ${card.color}`, padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {card.label}
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.2rem', color: 'var(--text-primary)' }}>
                  {card.value}
                </h2>
              </div>
              <card.icon size={24} color={card.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Tab Content */}
      {renderTabContent()}
    </div>
  );
}
