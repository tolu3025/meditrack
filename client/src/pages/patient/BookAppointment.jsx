import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, AlertCircle, CheckCircle, User, Building } from 'lucide-react';

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await apiRequest('/doctors');
        if (res.success) setDoctors(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctors();
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await apiRequest('/appointments', 'POST', {
        doctor_id: parseInt(selectedDoctor),
        appointment_date: appointmentDate,
        start_time: startTime,
        reason,
      });

      if (res.success) {
        setMessage('Appointment booked successfully! Doctor slot locked.');
        setTimeout(() => navigate('/patient/dashboard'), 2000);
      }
    } catch (err) {
      setError(err.message || 'Failed to book appointment.');
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30'];

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Book Doctor Appointment</h1>
        <p style={{ color: '#94A3B8' }}>Select your preferred doctor, date, and time slot. Real-time conflict detection active.</p>
      </div>

      {message && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '1rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <CheckCircle size={20} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', padding: '1rem', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="glass-card">
        <form onSubmit={handleBook}>
          <div className="form-group">
            <label className="form-label">Select Specialist Doctor</label>
            <select
              className="form-select"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              required
            >
              <option value="">-- Choose Doctor --</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  Dr. {doc.user?.first_name} {doc.user?.last_name} ({doc.specialization} - {doc.department?.name}) - ₦{doc.consultation_fee}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Appointment Date</label>
            <input
              type="date"
              className="form-input"
              min={new Date().toISOString().split('T')[0]}
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Available Time Slot</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.5rem' }}>
              {timeSlots.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setStartTime(slot)}
                  className={`btn btn-sm ${startTime === slot ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%' }}
                >
                  <Clock size={14} /> {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Reason for Visit / Symptoms</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Describe your health symptoms or reason for visit..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={loading}>
            {loading ? 'Confirming Availability...' : 'Confirm Appointment Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}
