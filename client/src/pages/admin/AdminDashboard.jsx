import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../utils/api';
import { Users, Calendar, CreditCard, TrendingUp, Activity } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [revenueStats, setRevenueStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const statsRes = await apiRequest('/admin/dashboard');
        if (statsRes.success) setStats(statsRes.data);

        const revRes = await apiRequest('/admin/revenue');
        if (revRes.success) setRevenueStats(revRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) return <LoadingSpinner />;

  const monthlyRevenueData = [
    { month: 'Jan', revenue: 420000 },
    { month: 'Feb', revenue: 580000 },
    { month: 'Mar', revenue: 640000 },
    { month: 'Apr', revenue: 710000 },
    { month: 'May', revenue: 890000 },
    { month: 'Jun', revenue: 950000 },
    { month: 'Jul', revenue: 1100000 },
    { month: 'Aug', revenue: parseFloat(revenueStats?.totalPaidRevenue || 1250000) },
  ];

  const departmentPieData = [
    { name: 'General Medicine', value: 35, color: '#2563EB' },
    { name: 'Cardiology', value: 25, color: '#059669' },
    { name: 'Pediatrics', value: 20, color: '#D97706' },
    { name: 'OB/GYN', value: 12, color: '#DC2626' },
    { name: 'Surgery', value: 8, color: '#7C3AED' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #374151', paddingBottom: '0.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>Executive Analytics & Operations</h1>
        <p style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>System performance metrics, patient traffic, and revenue breakdown.</p>
      </div>

      <div className="grid-stats">
        <div className="solid-card" style={{ borderLeft: '4px solid #2563EB' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase' }}>Total Patients</span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem', color: '#FFFFFF' }}>{stats?.counts?.totalPatients || 0}</h2>
            </div>
            <Users size={24} color="#2563EB" />
          </div>
        </div>

        <div className="solid-card" style={{ borderLeft: '4px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase' }}>Active Doctors</span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem', color: '#FFFFFF' }}>{stats?.counts?.totalDoctors || 0}</h2>
            </div>
            <Activity size={24} color="#059669" />
          </div>
        </div>

        <div className="solid-card" style={{ borderLeft: '4px solid #D97706' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase' }}>Appointments Today</span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem', color: '#FFFFFF' }}>{stats?.counts?.appointmentsToday || 0}</h2>
            </div>
            <Calendar size={24} color="#D97706" />
          </div>
        </div>

        <div className="solid-card" style={{ borderLeft: '4px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase' }}>Total Revenue Paid</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.25rem', color: '#6EE7B7' }}>
                ₦{revenueStats?.totalPaidRevenue || '0.00'}
              </h2>
            </div>
            <CreditCard size={24} color="#059669" />
          </div>
        </div>
      </div>

      {/* Visual Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
        <div className="solid-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #374151', paddingBottom: '0.5rem' }}>
            <TrendingUp size={16} color="#059669" /> Monthly Hospital Revenue Trend (₦)
          </h3>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="2 2" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '4px', color: '#FFF' }} />
                <Bar dataKey="revenue" fill="#2563EB" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="solid-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.25rem', borderBottom: '1px solid #374151', paddingBottom: '0.5rem' }}>
            Department Distribution
          </h3>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={departmentPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75}>
                  {departmentPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '4px', color: '#FFF' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
