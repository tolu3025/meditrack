import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Users, Activity, Plus, ArrowUpRight, ArrowDownRight, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppts = async () => {
      try {
        const res = await apiRequest('/appointments');
        if (res.success) setAppointments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppts();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter((a) => a.appointment_date === todayStr);

  return (
    <div style={{ padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Dashboard</h1>
        <button className="btn btn-primary" style={{ gap: '0.5rem', padding: '0.6rem 1.5rem' }}>
          <Plus size={16} /> Space
        </button>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '-1.5rem', marginBottom: '2rem' }}>
        An overview of recent patient data, vital signs, trends, and analysis.
      </p>

      {/* Top Grid (Charts & Actions) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* Placeholder Chart Card */}
        <div className="soft-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Patients Processed</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Past 7 days ▾</span>
          </div>
          <div style={{ flex: 1, backgroundColor: 'var(--color-primary-light)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
            [ Area Chart Visualization Placeholder ]
          </div>
        </div>

        {/* Small Action Cards */}
        <div className="soft-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Sick leave</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.5rem' }}>
            Shows the number of sick leave days prescribed by the doctor.
          </p>
          <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '50%', background: 'conic-gradient(var(--color-accent) 40%, var(--border-light) 40%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>3</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Sick days left</span>
            </div>
          </div>
        </div>

        <div className="soft-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Quick Actions</h3>
             <MoreVertical size={16} color="var(--text-muted)" />
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              <Link to="/doctor/consultation" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Make appointment
              </Link>
              <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                Customize dashboard
              </button>
           </div>
        </div>
      </div>

      {/* Bottom Grid (History & Profiles) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Visit History Table */}
        <div className="soft-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Visit history</h3>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              <span>Sort ↑↓</span>
              <span>Month ▾</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', padding: '0 1rem' }}>
            <div style={{ flex: 1.5 }}>Patient</div>
            <div style={{ flex: 1 }}>Visit type</div>
            <div style={{ flex: 1 }}>Last visit</div>
            <div style={{ flex: 0.5 }}>Status</div>
            <div style={{ flex: 1, textAlign: 'right' }}>Report</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {appointments.slice(0, 4).map((appt, i) => (
              <div key={appt.id} className="visit-history-row">
                <div style={{ flex: 1.5, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                    {appt.patient?.user?.first_name[0]}{appt.patient?.user?.last_name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{appt.patient?.user?.first_name} {appt.patient?.user?.last_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{appt.reason.substring(0, 15)}...</div>
                  </div>
                </div>
                <div style={{ flex: 1, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Consultation</div>
                <div style={{ flex: 1, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <div>{appt.appointment_date}</div>
                  <div>{appt.start_time} - {appt.end_time}</div>
                </div>
                <div style={{ flex: 0.5 }}>
                  <span className={`badge ${appt.status === 'completed' ? 'badge-completed' : appt.status === 'scheduled' ? 'badge-scheduled' : 'badge-cancelled'}`}>
                    {appt.status}
                  </span>
                </div>
                <div style={{ flex: 1, textAlign: 'right', fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-primary)' }}>
                  <FileText size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.25rem' }}/>
                  Report.pdf
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Profile Snapshot */}
        <div className="soft-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Patient profiles</h3>
            <MoreVertical size={16} color="var(--text-muted)" />
          </div>

          {appointments.length > 0 && (
            <>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <Users size={32} color="var(--color-primary)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>27 years old</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{appointments[0].patient?.user?.first_name} {appointments[0].patient?.user?.last_name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Diagnosis: {appointments[0].reason.substring(0, 15)}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, padding: '1rem', backgroundColor: 'var(--bg-app)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div>
                     <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Heart Rate</div>
                     <div style={{ fontWeight: 700 }}>112 bpm</div>
                   </div>
                   <ArrowUpRight size={16} color="var(--color-warning)" />
                </div>
                <div style={{ flex: 1, padding: '1rem', backgroundColor: 'var(--bg-app)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div>
                     <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Glucose Level</div>
                     <div style={{ fontWeight: 700 }}>92 mg/dL</div>
                   </div>
                   <ArrowDownRight size={16} color="var(--color-success)" />
                </div>
              </div>
            </>
          )}

          {/* Marketing Card */}
          <div style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', borderRadius: '16px', padding: '1.5rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
             <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Stay on top of your health!</h4>
             <p style={{ fontSize: '0.8rem', opacity: 0.9, maxWidth: '80%' }}>Receive automatic reminders for every appointment.</p>
             <ArrowUpRight size={24} color="rgba(255,255,255,0.5)" style={{ position: 'absolute', top: '1rem', right: '1rem' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
