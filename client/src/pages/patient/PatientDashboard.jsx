import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Pill, CreditCard, Clock, ArrowRight } from 'lucide-react';
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
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #374151', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>Patient Workstation</h1>
        <p style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>View appointments, medical history, prescriptions, and billing invoices.</p>
      </div>

      <div className="grid-stats">
        <div className="solid-card" style={{ borderLeft: '4px solid #2563EB' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase' }}>Upcoming Appointments</span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem', color: '#FFFFFF' }}>{upcomingAppts.length}</h2>
            </div>
            <Calendar size={24} color="#2563EB" />
          </div>
        </div>

        <div className="solid-card" style={{ borderLeft: '4px solid #D97706' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase' }}>Pending Prescriptions</span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem', color: '#FFFFFF' }}>{activePrescriptions.length}</h2>
            </div>
            <Pill size={24} color="#D97706" />
          </div>
        </div>

        <div className="solid-card" style={{ borderLeft: '4px solid #DC2626' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase' }}>Unpaid Invoice Balance</span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem', color: '#FFFFFF' }}>
                ₦{billing?.summary?.total_unpaid || '0.00'}
              </h2>
            </div>
            <CreditCard size={24} color="#DC2626" />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
        <div className="solid-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #374151', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>Scheduled Appointments</h3>
            <Link to="/patient/book" className="btn btn-primary btn-sm">
              <Calendar size={14} /> Book Appointment
            </Link>
          </div>

          {upcomingAppts.length === 0 ? (
            <p style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>No upcoming appointments scheduled.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {upcomingAppts.slice(0, 4).map((appt) => (
                <div key={appt.id} style={{ backgroundColor: '#111827', padding: '0.85rem', borderRadius: '4px', border: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontWeight: 700, color: '#F9FAFB', fontSize: '0.9rem' }}>
                      Dr. {appt.doctor?.user?.first_name} {appt.doctor?.user?.last_name} ({appt.doctor?.specialization})
                    </h4>
                    <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={12} /> {appt.appointment_date} | {appt.start_time} - {appt.end_time}
                    </div>
                  </div>
                  <span className="badge badge-scheduled">Scheduled</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="solid-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem', borderBottom: '1px solid #374151', paddingBottom: '0.75rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <Link to="/patient/book" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
              <span>Book Appointment</span>
              <ArrowRight size={14} />
            </Link>
            <Link to="/patient/history" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
              <span>View EHR Records</span>
              <ArrowRight size={14} />
            </Link>
            <Link to="/patient/bills" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
              <span>Pay Invoices</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
