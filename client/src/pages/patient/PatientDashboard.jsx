import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Calendar, FileText, CreditCard, Activity, ArrowUpRight, ArrowDownRight, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptRes, rxRes] = await Promise.all([
          apiRequest('/appointments'),
          apiRequest('/prescriptions')
        ]);
        if (apptRes.success) setAppointments(apptRes.data);
        if (rxRes.success) setPrescriptions(rxRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const upcomingAppts = appointments.filter(a => new Date(a.appointment_date) >= new Date() && a.status === 'scheduled');

  return (
    <div style={{ padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Dashboard</h1>
        <Link to="/patient/book" className="btn btn-primary" style={{ gap: '0.5rem', padding: '0.6rem 1.5rem' }}>
          Make appointment
        </Link>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '-1.5rem', marginBottom: '2rem' }}>
        An overview of your health data, vital signs, trends, and appointments.
      </p>

      {/* Top Grid (Charts & Actions) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* Placeholder Chart Card */}
        <div className="soft-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Blood sugar</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Past 7 days ▾</span>
          </div>
          <div style={{ flex: 1, backgroundColor: 'var(--color-primary-light)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
            [ Blood Sugar Chart Visualization Placeholder ]
          </div>
        </div>

        {/* Small Action Cards */}
        <div className="soft-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Activity</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.5rem' }}>
            Daily steps and active minutes tracking.
          </p>
          <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '50%', background: 'conic-gradient(var(--color-success) 70%, var(--border-light) 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>7k</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Steps today</span>
            </div>
          </div>
        </div>

        <div className="soft-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Quick Actions</h3>
             <MoreVertical size={16} color="var(--text-muted)" />
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              <Link to="/patient/history" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                View health records
              </Link>
              <Link to="/patient/bills" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                Pay invoices
              </Link>
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
            <div style={{ flex: 1.5 }}>Doctor</div>
            <div style={{ flex: 1 }}>Visit type</div>
            <div style={{ flex: 1 }}>Last visit</div>
            <div style={{ flex: 0.5 }}>Status</div>
            <div style={{ flex: 1, textAlign: 'right' }}>Report</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {appointments.slice(0, 4).map((appt, i) => (
              <div key={appt.id} className="visit-history-row">
                <div style={{ flex: 1.5, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-warning)' }}>
                    {appt.doctor?.user?.first_name[0] || 'D'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Dr. {appt.doctor?.user?.first_name} {appt.doctor?.user?.last_name}</div>
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

        {/* Marketing Card */}
        <div className="soft-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: 'white', flex: 1 }}>
             <h4 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.5rem', lineHeight: 1.2 }}>Stay on top of your health!</h4>
             <p style={{ fontSize: '0.9rem', opacity: 0.9, maxWidth: '80%', marginBottom: '2rem' }}>Receive automatic reminders for every appointment and prescription refill.</p>
             <button className="btn btn-secondary" style={{ color: 'var(--color-primary)', backgroundColor: 'white', border: 'none' }}>Enable Reminders</button>
          </div>
        </div>
      </div>
    </div>
  );
}
