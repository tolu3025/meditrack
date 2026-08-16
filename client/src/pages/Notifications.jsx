import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Calendar, FileText, AlertCircle, Activity, Trash2 } from 'lucide-react';
import { apiRequest } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const typeConfig = {
  appointment: { icon: Calendar,    color: '#1D4ED8', bg: '#EFF6FF' },
  prescription: { icon: FileText,  color: '#059669', bg: '#D1FAE5' },
  alert:       { icon: AlertCircle, color: '#EF4444', bg: '#FEE2E2' },
  general:     { icon: Bell,        color: '#D97706', bg: '#FEF9C3' },
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [read, setRead] = useState(() => {
    try { return JSON.parse(localStorage.getItem('read_notifs') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    apiRequest('/appointments').then(res => {
      if (res.success) setAppointments(res.data);
    });
  }, []);

  // Build notifications from real appointment data
  const notifications = [
    ...appointments.slice(0, 8).map(a => ({
      id: `appt-${a.id}`,
      type: 'appointment',
      title: a.status === 'completed'
        ? `Appointment with Dr. ${a.doctor?.user?.first_name} ${a.doctor?.user?.last_name} completed`
        : `Upcoming appointment on ${a.appointment_date}`,
      body: `${a.reason?.substring(0, 60)}… · ${a.start_time}`,
      time: a.appointment_date,
      status: a.status,
    })),
    {
      id: 'sys-1', type: 'general',
      title: 'Welcome to MediTrack!',
      body: 'Your account is set up. Explore your dashboard to get started.',
      time: 'Today',
    },
  ];

  const markAllRead = () => {
    const ids = notifications.map(n => n.id);
    setRead(ids);
    localStorage.setItem('read_notifs', JSON.stringify(ids));
  };

  const markRead = (id) => {
    const updated = [...read, id];
    setRead(updated);
    localStorage.setItem('read_notifs', JSON.stringify(updated));
  };

  const unreadCount = notifications.filter(n => !read.includes(n.id)).length;

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: '#F7F8FA', minHeight: '100%', padding: '2rem' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>Notifications</h1>
            <p style={{ color: '#9CA3AF', fontSize: '0.88rem', marginTop: '0.25rem' }}>
              {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', background: '#EFF6FF', color: '#1D4ED8', border: '1.5px solid #BFDBFE', borderRadius: 9999, fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <CheckCheck size={15} /> Mark all read
            </button>
          )}
        </div>

        {/* Notification cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map(n => {
            const isRead = read.includes(n.id);
            const cfg = typeConfig[n.type] || typeConfig.general;
            return (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                style={{
                  background: isRead ? '#fff' : '#FAFBFF',
                  border: `1.5px solid ${isRead ? '#F3F4F6' : '#DBEAFE'}`,
                  borderRadius: 16, padding: '1.1rem 1.25rem',
                  display: 'flex', gap: '1rem', alignItems: 'flex-start',
                  cursor: 'pointer', transition: 'all 0.15s',
                  boxShadow: isRead ? 'none' : '0 2px 8px rgba(29,78,216,0.06)',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = isRead ? 'none' : '0 2px 8px rgba(29,78,216,0.06)'}
              >
                <div style={{ width: 42, height: 42, borderRadius: 12, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <cfg.icon size={20} color={cfg.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: isRead ? 500 : 700, fontSize: '0.9rem', color: '#111827', marginBottom: '0.25rem' }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#6B7280', lineHeight: 1.5 }}>{n.body}</div>
                  <div style={{ fontSize: '0.68rem', color: '#9CA3AF', marginTop: '0.4rem' }}>{n.time}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', flexShrink: 0 }}>
                  {!isRead && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1D4ED8', display: 'block' }} />}
                  {n.status && (
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 9999,
                      background: n.status === 'completed' ? '#D1FAE5' : n.status === 'cancelled' ? '#FEE2E2' : '#EFF6FF',
                      color: n.status === 'completed' ? '#059669' : n.status === 'cancelled' ? '#EF4444' : '#1D4ED8',
                    }}>
                      {n.status}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {notifications.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#9CA3AF' }}>
            <Bell size={48} color="#E5E7EB" style={{ margin: '0 auto 1rem', display: 'block' }} />
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>No notifications yet</div>
            <div style={{ fontSize: '0.875rem' }}>When you have updates, they'll appear here.</div>
          </div>
        )}
      </div>
    </div>
  );
}
