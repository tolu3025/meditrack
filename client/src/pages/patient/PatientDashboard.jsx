import React, { useEffect, useState } from 'react';
import {
  HeartPulse, Activity, Stethoscope, Calendar, FileText,
  Clock, MoreHorizontal, ChevronLeft, ChevronRight,
  Pill, TrendingUp, Droplets, ArrowRight, CalendarCheck
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { apiRequest } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Link } from 'react-router-dom';

function ECGLine({ color = '#1D4ED8' }) {
  return (
    <svg width="100%" height="48" viewBox="0 0 300 48" preserveAspectRatio="none">
      <polyline
        points="0,28 18,28 24,6 30,44 36,28 54,28 60,14 66,38 72,28 96,28 102,10 108,40 114,28 150,28 156,18 162,34 168,28 210,28 216,20 222,34 228,28 300,28"
        fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function Sparkline({ data, color }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 32;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WeekCalendar({ appointments }) {
  const today = new Date();
  const day = today.getDay();
  const sunday = new Date(today); sunday.setDate(today.getDate() - day);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '0.25rem' }}>
        {days.map((d, i) => {
          const date = new Date(sunday); date.setDate(sunday.getDate() + i);
          const num = date.getDate();
          const isToday = i === day;
          const hasAppt = appointments.some(a => {
            const ad = new Date(a.appointment_date);
            return ad.getDate() === num && ad.getMonth() === today.getMonth();
          });
          return (
            <div key={d} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: '#9CA3AF', fontWeight: 600, marginBottom: '0.25rem' }}>{d}</div>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto',
                background: isToday ? '#1D4ED8' : 'transparent',
                color: isToday ? '#fff' : '#374151',
                fontWeight: isToday ? 700 : 500,
                fontSize: '0.78rem', position: 'relative',
              }}>
                {num}
                {hasAppt && !isToday && (
                  <span style={{ position: 'absolute', bottom: 1, width: 4, height: 4, borderRadius: '50%', background: '#1D4ED8' }} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PatientDashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prevAppts, setPrevAppts] = useState([]);

  const fetchData = async () => {
    try {
      const [apptRes, rxRes] = await Promise.all([
        apiRequest('/appointments'),
        apiRequest('/prescriptions'),
      ]);
      if (apptRes.success) {
        // Real-time status change notifications
        if (prevAppts.length > 0) {
          apptRes.data.forEach(newAppt => {
            const old = prevAppts.find(a => a.id === newAppt.id);
            if (old && old.status !== newAppt.status) {
              addToast(`Appointment status changed to "${newAppt.status}"`, newAppt.status === 'completed' ? 'success' : 'info');
            }
          });
        }
        setPrevAppts(apptRes.data);
        setAppointments(apptRes.data);
      }
      if (rxRes.success) setPrescriptions(rxRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll every 30 seconds for real-time updates
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.appointment_date === today);
  const upcoming = appointments.filter(a => a.status === 'scheduled').slice(0, 5);
  const completed = appointments.filter(a => a.status === 'completed').length;
  const activeRx = prescriptions.filter(p => p.status === 'pending').length;
  const hrData = [65, 72, 68, 80, 75, 72, 78, 74, 71, 69, 73, 77, 72, 74].map((v, i) => ({ name: `Day ${i}`, bpm: v }));

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem', color: '#9CA3AF', fontFamily: "'Outfit', sans-serif" }}>
      <Activity size={24} color="#1D4ED8" />
      Loading your health data…
    </div>
  );

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: '#F7F8FA', minHeight: '100%', padding: '2rem' }}>
      {/* TOP */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>Health Overview</h1>
          <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
            You have <strong style={{ color: '#1D4ED8' }}>{todayAppts.length}</strong> appointment{todayAppts.length !== 1 ? 's' : ''} today
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 9999, padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#374151', fontWeight: 600 }}>
            <Calendar size={14} color="#6B7280" />
            {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 9999, padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#374151', fontWeight: 600 }}>
            <Clock size={14} color="#6B7280" /> Live
          </div>
        </div>
      </div>

      {/* 3-COLUMN GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 280px', gap: '1.25rem', alignItems: 'start' }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Profile */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#1D4ED8,#60A5FA)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', boxShadow: '0 4px 14px rgba(29,78,216,0.25)' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.3rem' }}>{user?.first_name?.[0]}{user?.last_name?.[0]}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>{user?.first_name} {user?.last_name}</div>
            <div style={{ fontSize: '0.72rem', color: '#9CA3AF', marginBottom: '0.75rem' }}>Patient</div>
            <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: '0.75rem', borderTop: '1px solid #F3F4F6' }}>
              {[{ v: appointments.length, l: 'Visits' }, { v: activeRx, l: 'Rx' }, { v: completed, l: 'Done' }].map(s => (
                <div key={s.l} style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, color: '#111827', fontSize: '1rem' }}>{s.v}</div>
                  <div style={{ fontSize: '0.6rem', color: '#9CA3AF' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <h4 style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6B7280', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Quick Actions</h4>
            {[
              { to: '/patient/book',    icon: CalendarCheck, label: 'Book Appointment', color: '#1D4ED8', bg: '#EFF6FF' },
              { to: '/patient/history', icon: FileText,      label: 'My Records',       color: '#059669', bg: '#D1FAE5' },
              { to: '/patient/bills',   icon: TrendingUp,    label: 'My Invoices',      color: '#D97706', bg: '#FEF9C3' },
            ].map(a => (
              <Link key={a.to} to={a.to} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: 12, marginBottom: '0.5rem', background: a.bg, textDecoration: 'none', cursor: 'pointer' }}>
                <a.icon size={15} color={a.color} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111827' }}>{a.label}</span>
              </Link>
            ))}
          </div>

          {/* My Medicine */}
          <div style={{ background: '#111827', borderRadius: 20, padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Pill size={15} color="#60A5FA" />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>My Medicine</span>
            </div>
            {prescriptions.slice(0, 2).map((rx, i) => (
              <div key={rx.id || i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0', borderBottom: i < 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Pill size={14} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff' }}>
                    {rx.items?.[0]?.medication?.name || 'Prescription'}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#6B7280', textTransform: 'capitalize' }}>{rx.status}</div>
                </div>
              </div>
            ))}
            {prescriptions.length === 0 && <p style={{ color: '#6B7280', fontSize: '0.75rem' }}>No active prescriptions</p>}
          </div>
        </div>

        {/* CENTER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* ECG */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity size={16} color="#1D4ED8" />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>Heartbeat Monitor</span>
                </div>
                <div style={{ color: '#9CA3AF', fontSize: '0.75rem', marginTop: '0.2rem' }}>75 BPM — Normal range</div>
              </div>
              <span style={{ background: '#D1FAE5', color: '#059669', padding: '0.25rem 0.75rem', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 700 }}>Good</span>
            </div>
            <ECGLine color="#1D4ED8" />
            <div style={{ height: 80, marginTop: '0.5rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hrData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1D4ED8" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="bpm" stroke="#1D4ED8" strokeWidth={2} fill="url(#hrGrad)" dot={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '0.78rem', fontFamily: "'Outfit', sans-serif" }} formatter={(v) => [`${v} BPM`, 'Heart Rate']} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Consultations progress */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Stethoscope size={16} color="#374151" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>Consultations</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>{appointments.length.toLocaleString()}</span>
            </div>
            <div style={{ background: '#F3F4F6', borderRadius: 9999, height: 10, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.min((completed / Math.max(appointments.length, 1)) * 100, 100)}%`,
                background: 'linear-gradient(90deg,#1D4ED8,#60A5FA)',
                borderRadius: 9999, transition: 'width 1s ease',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.72rem', color: '#9CA3AF' }}>
              <span>{completed} completed</span>
              <span>{appointments.length - completed} upcoming</span>
            </div>
          </div>

          {/* Mini metric cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { label: 'R-R Interval', value: '0.7 sec', sub: 'Normal cardiac rhythm', data: [0.68,0.71,0.70,0.73,0.69,0.72,0.70], color: '#1D4ED8', icon: Activity },
              { label: 'Blood Status', value: '115/70',  sub: 'mmHg — Optimal',        data: [118,116,120,113,115,117,115],       color: '#EF4444', icon: Droplets },
            ].map(m => (
              <div key={m.label} style={{ background: '#fff', borderRadius: 20, padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <m.icon size={14} color={m.color} />
                  <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#111827' }}>{m.label}</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '0.25rem' }}>{m.value}</div>
                <div style={{ color: '#9CA3AF', fontSize: '0.7rem', marginBottom: '0.75rem' }}>{m.sub}</div>
                <Sparkline data={m.data} color={m.color} />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: SCHEDULE */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} color="#111827" />
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>Schedule</span>
            </div>
            <MoreHorizontal size={16} color="#9CA3AF" style={{ cursor: 'pointer' }} />
          </div>
          <WeekCalendar appointments={appointments} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 420, overflowY: 'auto' }}>
            {upcoming.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF', fontSize: '0.85rem' }}>
                <CalendarCheck size={32} color="#E5E7EB" style={{ display: 'block', margin: '0 auto 0.75rem' }} />
                No upcoming appointments
              </div>
            ) : upcoming.map((appt, i) => (
              <div key={appt.id} style={{ display: 'flex', gap: '0.75rem', padding: '0.85rem', background: '#F9FAFB', borderRadius: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `hsl(${(i*47+200)%360},60%,92%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Stethoscope size={18} color={`hsl(${(i*47+200)%360},60%,38%)`} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#111827', marginBottom: '0.15rem' }}>
                    Dr. {appt.doctor?.user?.first_name} {appt.doctor?.user?.last_name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>
                    {appt.doctor?.specialization || 'General Practice'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#9CA3AF', marginTop: '0.2rem' }}>
                    {appt.appointment_date} · {appt.start_time}
                  </div>
                </div>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
                  background: appt.status === 'completed' ? '#D1FAE5' : appt.status === 'cancelled' ? '#FEE2E2' : '#EFF6FF',
                  color: appt.status === 'completed' ? '#059669' : appt.status === 'cancelled' ? '#EF4444' : '#1D4ED8',
                  padding: '0.2rem 0.5rem', borderRadius: 9999,
                }}>
                  {appt.status}
                </span>
              </div>
            ))}
          </div>

          <Link to="/patient/book" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: '#1D4ED8', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none', cursor: 'pointer' }}>
            Book Appointment <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
