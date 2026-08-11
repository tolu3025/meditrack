import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Users, FileText, Pill, Clock, ArrowRight } from 'lucide-react';
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
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome, Dr. {user?.first_name} {user?.last_name}</h1>
        <p style={{ color: '#94A3B8' }}>Consultation portal, patient queue, and EHR medical record creator.</p>
      </div>

      <div className="grid-stats">
        <div className="glass-card" style={{ borderLeft: '4px solid #10B981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>APPOINTMENTS TODAY</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem' }}>{todayAppts.length}</h2>
            </div>
            <Calendar size={28} color="#10B981" />
          </div>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #0EA5E9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>TOTAL SCHEDULED</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem' }}>{appointments.length}</h2>
            </div>
            <Users size={28} color="#0EA5E9" />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Today's Patient Queue</h3>
            <Link to="/doctor/consultation" className="btn btn-primary btn-sm">
              <FileText size={16} /> New Consultation
            </Link>
          </div>

          {todayAppts.length === 0 ? (
            <p style={{ color: '#94A3B8' }}>No appointments scheduled for today.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {todayAppts.map((appt) => (
                <div key={appt.id} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontWeight: 700 }}>Patient: {appt.patient?.user?.first_name} {appt.patient?.user?.last_name}</h4>
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Reason: {appt.reason}</span>
                    <div style={{ fontSize: '0.8rem', color: '#0EA5E9', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={14} /> Time: {appt.start_time} - {appt.end_time}
                    </div>
                  </div>

                  <Link to={`/doctor/consultation?appointment_id=${appt.id}&patient_id=${appt.patient_id}`} className="btn btn-success btn-sm">
                    Start Consultation
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Doctor Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/doctor/consultation" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
              <span>Write EHR Record & Prescription</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/doctor/patients" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
              <span>Search Patient Medical History</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/doctor/appointments" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
              <span>View Full Schedule</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
