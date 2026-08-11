import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FileText, Plus, Trash2, CheckCircle, AlertCircle, Pill } from 'lucide-react';

export default function ConsultationForm() {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointment_id') || '';
  const initialPatientId = searchParams.get('patient_id') || '';

  const [patients, setPatients] = useState([]);
  const [medications, setMedications] = useState([]);
  const [patientId, setPatientId] = useState(initialPatientId);
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');

  // Prescription items array
  const [prescriptionItems, setPrescriptionItems] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const patRes = await apiRequest('/patients');
        if (patRes.success) setPatients(patRes.data);

        const medRes = await apiRequest('/medications');
        if (medRes.success) setMedications(medRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInitialData();
  }, []);

  const addPrescriptionRow = () => {
    setPrescriptionItems([
      ...prescriptionItems,
      { medication_id: '', medication_name: '', dosage: '1 tablet', frequency: 'Twice daily', duration: '5 days', quantity: 1, instructions: '' },
    ]);
  };

  const removePrescriptionRow = (index) => {
    setPrescriptionItems(prescriptionItems.filter((_, i) => i !== index));
  };

  const updatePrescriptionRow = (index, field, value) => {
    const updated = [...prescriptionItems];
    updated[index][field] = value;
    if (field === 'medication_id') {
      const selectedMed = medications.find((m) => m.id === parseInt(value));
      if (selectedMed) {
        updated[index].medication_name = selectedMed.name;
      }
    }
    setPrescriptionItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const payload = {
        patient_id: parseInt(patientId),
        appointment_id: appointmentId ? parseInt(appointmentId) : null,
        diagnosis,
        symptoms,
        notes,
        prescriptions: prescriptionItems,
      };

      const res = await apiRequest('/medical-records', 'POST', payload);
      if (res.success) {
        setMessage('EHR Medical Record & Prescription saved successfully! Auto-routed to Pharmacy Queue.');
        setTimeout(() => navigate('/doctor/dashboard'), 2000);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit consultation record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Clinical Consultation & EHR Form</h1>
        <p style={{ color: '#94A3B8' }}>Record clinical findings, diagnosis, and issue prescriptions directly to pharmacy.</p>
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

      <form onSubmit={handleSubmit}>
        <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Patient & Clinical Details</h3>

          <div className="form-group">
            <label className="form-label">Select Patient</label>
            <select
              className="form-select"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
            >
              <option value="">-- Choose Patient --</option>
              {patients.map((pat) => (
                <option key={pat.id} value={pat.id}>
                  {pat.user?.first_name} {pat.user?.last_name} ({pat.gender || 'N/A'}, DOB: {pat.date_of_birth || 'N/A'})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Clinical Diagnosis</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Acute Malaria, Stage 1 Hypertension"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Patient Symptoms</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="Reported symptoms..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Doctor's Clinical Notes</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Treatment plan, advice..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Prescription Section */}
        <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Pill color="#F59E0B" /> Issue Prescription (Auto-Routes to Pharmacy Queue)
            </h3>
            <button type="button" onClick={addPrescriptionRow} className="btn btn-secondary btn-sm">
              <Plus size={16} /> Add Drug
            </button>
          </div>

          {prescriptionItems.length === 0 ? (
            <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>No medications added. Click "Add Drug" to add items to prescription.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {prescriptionItems.map((item, index) => (
                <div key={index} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'center' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Medication</label>
                      <select
                        className="form-select"
                        value={item.medication_id}
                        onChange={(e) => updatePrescriptionRow(index, 'medication_id', e.target.value)}
                        required
                      >
                        <option value="">-- Select Drug --</option>
                        {medications.map((m) => (
                          <option key={m.id} value={m.id}>{m.name} (Stock: {m.stock_quantity}) - ₦{m.unit_price}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Dosage</label>
                      <input
                        type="text"
                        className="form-input"
                        value={item.dosage}
                        onChange={(e) => updatePrescriptionRow(index, 'dosage', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Frequency</label>
                      <input
                        type="text"
                        className="form-input"
                        value={item.frequency}
                        onChange={(e) => updatePrescriptionRow(index, 'frequency', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Qty</label>
                      <input
                        type="number"
                        className="form-input"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updatePrescriptionRow(index, 'quantity', parseInt(e.target.value))}
                        required
                      />
                    </div>

                    <button type="button" onClick={() => removePrescriptionRow(index)} className="btn btn-danger btn-sm" style={{ marginTop: '1.2rem' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={loading}>
          {loading ? 'Saving Record & Routing...' : 'Save EHR Record & Dispatch Prescription'}
        </button>
      </form>
    </div>
  );
}
