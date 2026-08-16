import React, { useEffect, useState } from 'react';
import {
  HeartPulse, Activity, Stethoscope, Calendar, FileText,
  Clock, MoreHorizontal, ChevronLeft, ChevronRight,
  Pill, TrendingUp, Droplets, ArrowRight, Bell
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { apiRequest } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

// ── Mini ECG line SVG (always live-looking) ──────────────────────────────────
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

// ── Mini sparkline ────────────────────────────────────────────────────────────
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

// ── Week Calendar helper ───────────────────────────────────────────────────────
function WeekCalendar({ appointments }) {
  const today = new Date();
  const day = today.getDay();
  const sunday = new Date(today); sunday.setDate(today.getDate() - day);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}><ChevronLeft size={16} /></button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}><ChevronRight size={16} /></button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '0.25rem', marginBottom: '1rem' }}>
        {days.map((d, i) => {
          const date = new Date(sunday); date.setDate(sunday.getDate() + i);
          const num = date.getDate();
          const isToday = i === day;
          const hasAppt = appointments.some(a => new Date(a.appointment_date).getDate() === num && new Date(a.appointment_date).getMonth() === today.getMonth());
          return (
            <div key={d} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.62rem', color: '#9CA3AF', fontWeight: 600, marginBottom: '0.25rem' }}>{d}</div>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto',
                background: isToday ? '#1D4ED8' : 'transparent',
                color: isToday ? '#fff' : '#374151',
                fontWeight: isToday ? 700 : 500,
                fontSize: '0.82rem',
                position: 'relative'
              }}>
                {num}
                {hasAppt && !isToday && <span style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#1D4ED8' }} />}
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
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiRequest('/appointments'), apiRequest('/prescriptions')])
      .then(([apptRes, rxRes]) => {
        if (apptRes.success) setAppointments(apptRes.data);
        if (rxRes.success) setPrescriptions(rxRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const upcoming = appointments.filter(a => a.status === 'scheduled').slice(0, 5);
  const todayAppts = appointments.filter(a => a.appointment_date === today);
  const completed = appointments.filter(a => a.status === 'completed').length;
  const activeRx = prescriptions.filter(p => p.status === 'pending').length;

  // Fake weekly heartrate data for chart
  const hrData = [65, 72, 68, 80, 75, 72, 78, 74, 71, 69, 73, 77, 72, 74].map((v, i) => ({ name: `Day ${i}`, bpm: v }));

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: '#F7F8FA', minHeight: '100vh', padding: '2rem' }}>
      {/* ── TOP BAR ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>Health Overview</h1>
          <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
            You have <strong style={{ color: '#1D4ED8' }}>{todayAppts.length} appointment{todayAppts.length !== 1 ? 's' : ''}</strong> today
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 9999, padding: '0.5rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#374151', fontWeight: 600 }}>
            <Calendar size={14} color="#6B7280" /> {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 9999, padding: '0.5rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#374151', fontWeight: 600 }}>
            <Clock size={14} color="#6B7280" /> 24 Hrs
          </div>
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 9999, padding: '0.5rem 1.1rem', fontSize: '0.82rem', color: '#374151', fontWeight: 600 }}>
            Weekly
          </div>
        </div>
      </div>

      {/* ── MAIN GRID: [Left panel] [Center cards] [Right schedule] ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 300px', gap: '1.5rem', alignItems: 'start' }}>

        {/* ── LEFT PANEL ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Patient card */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#1D4ED8,#3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 4px 14px rgba(29,78,216,0.3)' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.4rem' }}>{user?.first_name?.[0]}{user?.last_name?.[0]}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#111827' }}>{user?.first_name} {user?.last_name}</div>
            <div style={{ fontSize: '0.78rem', color: '#9CA3AF', marginBottom: '1rem' }}>Patient</div>
            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '0.75rem 0', borderTop: '1px solid #F3F4F6' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 800, color: '#111827' }}>{appointments.length}</div>
                <div style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>Visits</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 800, color: '#111827' }}>{activeRx}</div>
                <div style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>Rx Active</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 800, color: '#111827' }}>{completed}</div>
                <div style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>Done</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Actions</h4>
            {[
              { to: '/patient/book',    icon: CalendarCheck2, label: 'Book Appointment', color: '#1D4ED8', bg: '#EFF6FF' },
              { to: '/patient/history', icon: FileText,       label: 'My Records',        color: '#059669', bg: '#D1FAE5' },
              { to: '/patient/bills',   icon: TrendingUp,     label: 'My Invoices',       color: '#D97706', bg: '#FEF9C3' },
            ].map(a => (
              <Link key={a.to} to={a.to} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.75rem', borderRadius: 12, marginBottom: '0.5rem', background: a.bg, textDecoration: 'none' }}>
                <a.icon size={16} color={a.color} />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#111827' }}>{a.label}</span>
              </Link>
            ))}
          </div>

          {/* Active Prescriptions */}
          <div style={{ background: '#111827', borderRadius: 20, padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Pill size={16} color="#60A5FA" />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>My Medicine</span>
            </div>
            {prescriptions.slice(0, 2).map((rx, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0', borderBottom: i < 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Pill size={14} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff' }}>{rx.items?.[0]?.medication?.name || 'Medication'}</div>
                  <div style={{ fontSize: '0.68rem', color: '#6B7280' }}>{rx.status}</div>
                </div>
              </div>
            ))}
            {prescriptions.length === 0 && <p style={{ color: '#6B7280', fontSize: '0.78rem' }}>No active prescriptions</p>}
          </div>
        </div>

        {/* ── CENTER CARDS ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Heartbeat chart */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity size={16} color="#1D4ED8" />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>Heartbeat Monitor</span>
                </div>
                <div style={{ color: '#9CA3AF', fontSize: '0.78rem', marginTop: '0.2rem' }}>75 BPM — Normal range</div>
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
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '0.78rem' }} formatter={(v) => [`${v} BPM`, 'Heart Rate']} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Consultations progress */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Stethoscope size={16} color="#374151" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>Consultations</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>{appointments.length.toLocaleString()}</span>
            </div>
            <div style={{ background: '#F3F4F6', borderRadius: 9999, height: 10, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min((completed / Math.max(appointments.length, 1)) * 100, 100)}%`, background: 'linear-gradient(90deg,#1D4ED8,#60A5FA)', borderRadius: 9999, transition: 'width 1s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.72rem', color: '#9CA3AF' }}>
              <span>{completed} completed</span>
              <span>{appointments.length - completed} upcoming</span>
            </div>
          </div>

          {/* Metric mini-cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#fff', borderRadius: 20, padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Activity size={14} color="#1D4ED8" />
                <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#111827' }}>R-R Interval</span>
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', marginBottom: '0.25rem' }}>0.7 sec</div>
              <div style={{ color: '#9CA3AF', fontSize: '0.72rem', marginBottom: '0.75rem' }}>Normal cardiac rhythm</div>
              <Sparkline data={[0.68, 0.71, 0.70, 0.73, 0.69, 0.72, 0.70]} color="#1D4ED8" />
            </div>

            <div style={{ background: '#fff', borderRadius: 20, padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Droplets size={14} color="#EF4444" />
                <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#111827' }}>Blood Status</span>
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', marginBottom: '0.25rem' }}>115/70</div>
              <div style={{ color: '#9CA3AF', fontSize: '0.72rem', marginBottom: '0.75rem' }}>mmHg — Optimal</div>
              <Sparkline data={[118, 116, 120, 113, 115, 117, 115]} color="#EF4444" />
            </div>
          </div>
        </div>

        {/* ── RIGHT: SCHEDULE ── */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} color="#111827" />
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>Schedule</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Calendar size={16} color="#9CA3AF" style={{ cursor: 'pointer' }} />
              <MoreHorizontal size={16} color="#9CA3AF" style={{ cursor: 'pointer' }} />
            </div>
          </div>

          <WeekCalendar appointments={appointments} />

          {/* Appointment list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {upcoming.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF', fontSize: '0.85rem' }}>
                <CalendarCheck2 size={32} color="#E5E7EB" style={{ margin: '0 auto 0.75rem' }} />
                No upcoming appointments
              </div>
            ) : upcoming.map((appt, i) => (
              <div key={appt.id} style={{ display: 'flex', gap: '0.9rem', padding: '0.9rem', background: '#F9FAFB', borderRadius: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `hsl(${(i * 47 + 200) % 360},70%,92%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Stethoscope size={20} color={`hsl(${(i * 47 + 200) % 360},60%,40%)`} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#111827', marginBottom: '0.15rem' }}>
                    Dr. {appt.doctor?.user?.first_name} {appt.doctor?.user?.last_name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#6B7280', marginBottom: '0.2rem' }}>
                    {appt.doctor?.specialization || 'General Practice'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>
                    {appt.appointment_date} · {appt.start_time}
                  </div>
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1D4ED8', flexShrink: 0 }}>$70</span>
              </div>
            ))}
          </div>

          <Link to="/patient/book" style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: '#1D4ED8', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>
            Book New Appointment <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Alias for lucide icon not imported at top
function CalendarCheck2({ size, color, style }) {
  return <CalendarCheck size={size} color={color} style={style} />;
}
