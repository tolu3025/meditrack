import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';

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
        setMessage('Appointment booked successfully.');
        setTimeout(() => navigate('/patient/dashboard'), 1500);
      }
    } catch (err) {
      setError(err.message || 'Failed to book appointment.');
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30'];

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #374151', paddingBottom: '0.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>Book Doctor Appointment</h1>
        <p style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>Transactional conflict check ensures no double bookings.</p>
      </div>

      {message && (
        <div style={{ backgroundColor: '#064E3B', border: '1px solid #059669', borderRadius: '4px', padding: '0.85rem 1rem', color: '#6EE7B7', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
          <CheckCircle size={18} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: '#7F1D1D', border: '1px solid #DC2626', borderRadius: '4px', padding: '0.85rem 1rem', color: '#FCA5A5', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="solid-card">
        <form onSubmit={handleBook}>
          <div className="form-group">
            <label className="form-label">Attending Specialist Doctor</label>
            <select
              className="form-select"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              required
            >
              <option value="">-- Select Specialist Doctor --</option>
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
            <label className="form-label">Select Start Time Slot</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
              {timeSlots.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setStartTime(slot)}
                  className={`btn btn-sm ${startTime === slot ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%', borderRadius: '2px' }}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Reason for Visit / Symptoms</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Primary health complaint..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }} disabled={loading}>
            {loading ? 'Validating Slot Lock...' : 'Confirm Appointment Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}
