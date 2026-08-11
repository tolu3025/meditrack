import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Pill, CreditCard, Clock, ArrowRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apptRes = await apiRequest('/appointments');
        if (apptRes.success) setAppointments(apptRes.data);

        const prescRes = await apiRequest('/prescriptions');
        if (prescRes.success) setPrescriptions(prescRes.data);

        if (user && user.profile_id) {
          const billRes = await apiRequest(`/billing/patient/${user.profile_id}`);
          if (billRes.success) setBilling(billRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const upcomingAppts = appointments.filter((a) => a.status === 'scheduled');
  const activePrescriptions = prescriptions.filter((p) => p.status === 'pending');

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome, {user?.first_name}!</h1>
        <p style={{ color: '#94A3B8' }}>Manage your appointments, health records, prescriptions, and bills.</p>
      </div>

      <div className="grid-stats">
        <div className="glass-card" style={{ borderLeft: '4px solid #0EA5E9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>UPCOMING APPOINTMENTS</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem' }}>{upcomingAppts.length}</h2>
            </div>
            <Calendar size={28} color="#0EA5E9" />
          </div>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #F59E0B' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>PENDING PRESCRIPTIONS</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem' }}>{activePrescriptions.length}</h2>
            </div>
            <Pill size={28} color="#F59E0B" />
          </div>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #EF4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>UNPAID BALANCE</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem' }}>
                ₦{billing?.summary?.total_unpaid || '0.00'}
              </h2>
            </div>
            <CreditCard size={28} color="#EF4444" />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Upcoming Scheduled Appointments</h3>
            <Link to="/patient/book" className="btn btn-primary btn-sm">
              <Calendar size={16} /> Book New
            </Link>
          </div>

          {upcomingAppts.length === 0 ? (
            <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>No upcoming appointments scheduled.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {upcomingAppts.slice(0, 3).map((appt) => (
                <div key={appt.id} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontWeight: 700 }}>Dr. {appt.doctor?.user?.first_name} {appt.doctor?.user?.last_name}</h4>
                    <span style={{ fontSize: '0.8rem', color: '#0EA5E9' }}>{appt.doctor?.department?.name}</span>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={14} /> {appt.appointment_date} at {appt.start_time} - {appt.end_time}
                    </div>
                  </div>
                  <span className="badge badge-scheduled">Scheduled</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/patient/book" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
              <span>Book Doctor Appointment</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/patient/history" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
              <span>View Full EHR History</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/patient/bills" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
              <span>Pay Hospital Bills</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
