import React, { useEffect, useState, useCallback } from 'react';
import { apiRequest } from '../../utils/api';
import { Users, Calendar, CreditCard, TrendingUp, Activity, RefreshCw, AlertCircle } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, CartesianGrid, Legend,
} from 'recharts';
import LoadingSpinner from '../../components/LoadingSpinner';

const PIE_COLORS = ['#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED', '#0891B2'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [revenueStats, setRevenueStats] = useState(null);
  const [apptStats, setApptStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchData = useCallback(async () => {
    setError('');
    try {
      const [statsRes, revRes, apptRes] = await Promise.all([
        apiRequest('/admin/dashboard'),
        apiRequest('/admin/revenue'),
        apiRequest('/admin/appointments'),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      else setError(statsRes.message || 'Failed to load dashboard stats.');

      if (revRes.success) setRevenueStats(revRes.data);
      if (apptRes.success) setApptStats(apptRes.data);

      setLastRefresh(new Date());
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

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

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>Executive Dashboard</h1>
          <p style={{ color: '#9CA3AF', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Live data from the database
            {lastRefresh && ` · Last refreshed ${lastRefresh.toLocaleTimeString()}`}
          </p>
        </div>
        <button
          onClick={fetchData}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            background: '#1F2937', border: '1px solid #374151',
            color: '#D1D5DB', borderRadius: '10px', padding: '0.5rem 1rem',
            cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit',
          }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{ background: '#450a0a', border: '1px solid #7f1d1d', color: '#fca5a5', borderRadius: '12px', padding: '0.85rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Stats cards — 100% live */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Patients', value: counts.totalPatients ?? 0, icon: Users, color: '#2563EB' },
          { label: 'Active Doctors', value: counts.totalDoctors ?? 0, icon: Activity, color: '#059669' },
          { label: "Today's Appointments", value: counts.appointmentsToday ?? 0, icon: Calendar, color: '#D97706' },
          { label: 'Pending Prescriptions', value: counts.pendingPrescriptions ?? 0, icon: TrendingUp, color: '#7C3AED' },
          { label: 'Total Revenue Paid', value: `₦${Number(revenueStats?.totalPaidRevenue || 0).toLocaleString()}`, icon: CreditCard, color: '#059669', wide: true },
          { label: 'Unpaid Balance', value: `₦${Number(revenueStats?.totalUnpaidBalance || 0).toLocaleString()}`, icon: CreditCard, color: '#DC2626', wide: true },
        ].map((card) => (
          <div key={card.label} className="solid-card" style={{ borderLeft: `4px solid ${card.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {card.label}
                </span>
                <h2 style={{ fontSize: '1.7rem', fontWeight: 800, marginTop: '0.2rem', color: '#FFFFFF' }}>
                  {card.value}
                </h2>
              </div>
              <card.icon size={24} color={card.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts — only shown when real data exists */}
      <div style={{ display: 'grid', gridTemplateColumns: barData.length > 0 ? '2fr 1fr' : '1fr', gap: '1.25rem' }}>
        {/* Appointments trend chart */}
        <div className="solid-card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.25rem', borderBottom: '1px solid #374151', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={16} color="#2563EB" />
            Appointment Trend (Last 8 Days)
          </h3>
          {barData.length > 0 ? (
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#FFF' }} />
                  <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} name="Appointments" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280', fontSize: '0.875rem' }}>
              No appointment data yet. Data will appear here as appointments are booked.
            </div>
          )}
        </div>

        {/* Department distribution pie */}
        {pieData.length > 0 && (
          <div className="solid-card">
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.25rem', borderBottom: '1px solid #374151', paddingBottom: '0.5rem' }}>
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
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#FFF' }} />
                  <Legend wrapperStyle={{ fontSize: '0.72rem', color: '#9CA3AF' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Recent Appointments from live data */}
      {stats?.recentAppointments?.length > 0 && (
        <div className="solid-card" style={{ marginTop: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem', borderBottom: '1px solid #374151', paddingBottom: '0.5rem' }}>
            Recent Appointments
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #374151' }}>
                  {['Patient', 'Doctor', 'Date', 'Status'].map(h => (
                    <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#9CA3AF', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentAppointments.map((a, i) => (
                  <tr key={a.id || i} style={{ borderBottom: '1px solid #1F2937' }}>
                    <td style={{ padding: '0.6rem 0.75rem', color: '#E5E7EB' }}>
                      {a.patient?.user?.first_name} {a.patient?.user?.last_name}
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem', color: '#E5E7EB' }}>
                      Dr. {a.doctor?.user?.first_name} {a.doctor?.user?.last_name}
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem', color: '#9CA3AF' }}>{a.appointment_date}</td>
                    <td style={{ padding: '0.6rem 0.75rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        background: a.status === 'completed' ? '#064e3b' : a.status === 'cancelled' ? '#450a0a' : '#1e3a5f',
                        color: a.status === 'completed' ? '#6EE7B7' : a.status === 'cancelled' ? '#fca5a5' : '#93C5FD',
                      }}>
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
    </div>
  );
}
