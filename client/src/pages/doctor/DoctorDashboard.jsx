import React, { useEffect, useState } from 'react';
import {
  Users, Calendar, Clock, MoreHorizontal, ChevronLeft, ChevronRight,
  Stethoscope, Activity, FileText, ArrowRight, CheckCircle,
  HeartPulse, TrendingUp, Pill, AlertCircle, PlayCircle
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, Cell } from 'recharts';
import { apiRequest } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

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
                fontSize: '0.78rem', position: 'relative'
              }}>
                {num}
                {hasAppt && !isToday && <span style={{ position: 'absolute', bottom: 1, width: 4, height: 4, borderRadius: '50%', background: '#1D4ED8' }} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/appointments')
      .then(res => { if (res.success) setAppointments(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.appointment_date === today);
  const completed = appointments.filter(a => a.status === 'completed').length;
  const upcoming  = appointments.filter(a => a.status === 'scheduled').slice(0, 5);
  const pending   = appointments.filter(a => a.status === 'scheduled').length;

  // Weekly patient volume chart
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const weekData = days.map((d, i) => ({
    day: d,
    patients: [8,12,6,15,10,4,2][i],
    isToday: i === (new Date().getDay() + 6) % 7
  }));

  const statusColor = { scheduled: '#1D4ED8', completed: '#10B981', cancelled: '#EF4444', 'no-show': '#F59E0B' };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: '#F7F8FA', minHeight: '100vh', padding: '2rem' }}>
      {/* ── TOP BAR ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>Consultation Hub</h1>
          <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
            You have <strong style={{ color: '#1D4ED8' }}>{todayAppts.length} patient{todayAppts.length !== 1 ? 's' : ''}</strong> today
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 9999, padding: '0.5rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: 600, color: '#374151' }}>
            <Calendar size={14} color="#6B7280" />
            {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
          <Link to="/doctor/consultation" style={{ background: '#1D4ED8', color: '#fff', border: 'none', borderRadius: 9999, padding: '0.55rem 1.25rem', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', cursor: 'pointer' }}>
            <FileText size={14} /> New EHR
          </Link>
        </div>
      </div>

      {/* ── GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 300px', gap: '1.5rem', alignItems: 'start' }}>

        {/* ── LEFT ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Doctor card */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#059669,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', boxShadow: '0 4px 14px rgba(5,150,105,0.3)' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.4rem' }}>{user?.first_name?.[0]}{user?.last_name?.[0]}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>Dr. {user?.first_name} {user?.last_name}</div>
            <div style={{ fontSize: '0.72rem', color: '#9CA3AF', marginBottom: '1rem' }}>General Practitioner</div>
            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '0.75rem 0', borderTop: '1px solid #F3F4F6' }}>
              {[{ v: todayAppts.length, l: 'Today' }, { v: pending, l: 'Pending' }, { v: completed, l: 'Done' }].map(s => (
                <div key={s.l} style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, color: '#111827' }}>{s.v}</div>
                  <div style={{ fontSize: '0.62rem', color: '#9CA3AF' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Status overview */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <h4 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</h4>
            {[
              { label: 'Scheduled', count: pending,   color: '#1D4ED8', bg: '#EFF6FF' },
              { label: 'Completed', count: completed,  color: '#059669', bg: '#D1FAE5' },
              { label: 'Cancelled', count: appointments.filter(a=>a.status==='cancelled').length, color: '#EF4444', bg: '#FEE2E2' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: s.bg, borderRadius: 10, marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>{s.label}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: s.color }}>{s.count}</span>
              </div>
            ))}
          </div>

          {/* Shortcuts */}
          <div style={{ background: '#111827', borderRadius: 20, padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Actions</h4>
            {[
              { to: '/doctor/consultation', icon: FileText,    label: 'New Consultation', color: '#60A5FA' },
              { to: '/doctor/patients',     icon: Users,       label: 'Patient Lookup',   color: '#34D399' },
              { to: '/doctor/appointments', icon: Calendar,    label: 'Full Schedule',    color: '#FBBF24' },
            ].map(a => (
              <Link key={a.to} to={a.to} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 0.5rem', borderRadius: 10, marginBottom: '0.4rem', background: 'rgba(255,255,255,0.05)', textDecoration: 'none' }}>
                <a.icon size={14} color={a.color} />
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff' }}>{a.label}</span>
                <ArrowRight size={12} color="#6B7280" style={{ marginLeft: 'auto' }} />
              </Link>
            ))}
          </div>
        </div>

        {/* ── CENTER ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Weekly volume chart */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>Patient Volume</div>
                <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>This week's consultation load</div>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 600 }}>Past 7 days</span>
            </div>
            <div style={{ height: 120 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekData} barSize={22}>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '0.78rem' }} formatter={v => [`${v} patients`]} />
                  <Bar dataKey="patients" radius={[6,6,0,0]}>
                    {weekData.map((d, i) => <Cell key={i} fill={d.isToday ? '#1D4ED8' : '#DBEAFE'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Today's patient queue */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={16} color="#111827" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>Today's Queue</span>
              </div>
              <span style={{ background: '#EFF6FF', color: '#1D4ED8', padding: '0.2rem 0.7rem', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 700 }}>
                {todayAppts.length} patients
              </span>
            </div>

            {todayAppts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF', fontSize: '0.85rem' }}>
                <CheckCircle size={32} color="#E5E7EB" style={{ margin: '0 auto 0.75rem' }} />
                No patients queued for today.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {todayAppts.map((appt, i) => (
                  <div key={appt.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#F9FAFB', borderRadius: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 800, color: '#1D4ED8', fontSize: '1rem' }}>
                      {appt.patient?.user?.first_name?.[0]}{appt.patient?.user?.last_name?.[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#111827' }}>
                        {appt.patient?.user?.first_name} {appt.patient?.user?.last_name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                        {appt.start_time} · {appt.reason?.substring(0,30)}…
                      </div>
                    </div>
                    <span style={{ background: statusColor[appt.status] + '18', color: statusColor[appt.status], padding: '0.25rem 0.6rem', borderRadius: 9999, fontSize: '0.7rem', fontWeight: 700 }}>
                      {appt.status}
                    </span>
                    <Link to={`/doctor/consultation?appointment_id=${appt.id}&patient_id=${appt.patient_id}`} style={{ width: 34, height: 34, background: '#1D4ED8', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <PlayCircle size={16} color="#fff" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent visits */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>Recent Consultations</span>
              <MoreHorizontal size={16} color="#9CA3AF" />
            </div>

            {/* Table header */}
            <div style={{ display: 'flex', padding: '0 0.75rem', marginBottom: '0.5rem' }}>
              {['Patient', 'Type', 'Date & Time', 'Status'].map(h => (
                <div key={h} style={{ flex: h === 'Patient' ? 1.5 : 1, fontSize: '0.68rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</div>
              ))}
            </div>

            {appointments.slice(0,5).map((appt, i) => (
              <div key={appt.id} style={{ display: 'flex', alignItems: 'center', padding: '0.65rem 0.75rem', borderRadius: 10, background: i % 2 === 0 ? '#F9FAFB' : '#fff', marginBottom: '0.25rem' }}>
                <div style={{ flex: 1.5, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `hsl(${i*73+180},60%,90%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 800, color: `hsl(${i*73+180},60%,35%)`, flexShrink: 0 }}>
                    {appt.patient?.user?.first_name?.[0]}{appt.patient?.user?.last_name?.[0]}
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#111827' }}>
                    {appt.patient?.user?.first_name} {appt.patient?.user?.last_name}
                  </div>
                </div>
                <div style={{ flex: 1, fontSize: '0.78rem', color: '#6B7280' }}>Consultation</div>
                <div style={{ flex: 1, fontSize: '0.72rem', color: '#9CA3AF' }}>
                  {appt.appointment_date}<br />{appt.start_time}
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ background: (statusColor[appt.status] || '#9CA3AF') + '18', color: statusColor[appt.status] || '#9CA3AF', padding: '0.2rem 0.55rem', borderRadius: 9999, fontSize: '0.68rem', fontWeight: 700 }}>
                    {appt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: SCHEDULE ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} color="#111827" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>Schedule</span>
              </div>
              <MoreHorizontal size={16} color="#9CA3AF" style={{ cursor: 'pointer' }} />
            </div>
            <WeekCalendar appointments={appointments} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {upcoming.length === 0 ? (
                <p style={{ color: '#9CA3AF', fontSize: '0.82rem', textAlign: 'center', padding: '1rem' }}>No upcoming appointments</p>
              ) : upcoming.map((appt, i) => (
                <div key={appt.id} style={{ display: 'flex', gap: '0.75rem', padding: '0.85rem', background: '#F9FAFB', borderRadius: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `hsl(${i*57+200},65%,92%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.78rem', fontWeight: 800, color: `hsl(${i*57+200},65%,35%)` }}>
                    {appt.patient?.user?.first_name?.[0]}{appt.patient?.user?.last_name?.[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#111827' }}>
                      {appt.patient?.user?.first_name} {appt.patient?.user?.last_name}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#6B7280' }}>Consultation</div>
                    <div style={{ fontSize: '0.66rem', color: '#9CA3AF', marginTop: '0.15rem' }}>
                      {appt.appointment_date} · {appt.start_time}
                    </div>
                  </div>
                  <HeartPulse size={14} color="#EF4444" style={{ flexShrink: 0 }} />
                </div>
              ))}
            </div>
          </div>

          {/* Alert card */}
          <div style={{ background: '#111827', borderRadius: 20, padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <AlertCircle size={16} color="#FBBF24" />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>Issue Found</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6B7280', lineHeight: 1.6, marginBottom: '1rem' }}>
              {pending} patient{pending !== 1 ? 's' : ''} awaiting consultation. Please review their cases.
            </p>
            <Link to="/doctor/consultation" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: '#1D4ED8', color: '#fff', borderRadius: 10, padding: '0.6rem', fontWeight: 700, fontSize: '0.78rem', textDecoration: 'none' }}>
              Review Patients <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
