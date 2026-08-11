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
        setMessage('EHR Medical Record & Prescription saved. Auto-routed to Pharmacy.');
        setTimeout(() => navigate('/doctor/dashboard'), 1500);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit consultation record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #374151', paddingBottom: '0.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>Clinical Consultation Entry</h1>
        <p style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>Record EHR clinical notes, diagnosis, and issue auto-routed prescriptions.</p>
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

      <form onSubmit={handleSubmit}>
        <div className="solid-card" style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem', borderBottom: '1px solid #374151', paddingBottom: '0.5rem' }}>Clinical Diagnosis & Symptoms</h3>

          <div className="form-group">
            <label className="form-label">Patient File</label>
            <select
              className="form-select"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
            >
              <option value="">-- Select Patient --</option>
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
              placeholder="Primary Diagnosis (e.g. Acute Malaria, Stage 1 Hypertension)"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Symptoms & Presentation</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="Reported patient symptoms..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Doctor Clinical Notes</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Treatment plan, clinical advice..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Prescription Section */}
        <div className="solid-card" style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #374151', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Pill size={16} color="#D97706" /> Prescription Items (Auto-Routed to Pharmacy Queue)
            </h3>
            <button type="button" onClick={addPrescriptionRow} className="btn btn-secondary btn-sm">
              <Plus size={14} /> Add Medication
            </button>
          </div>

          {prescriptionItems.length === 0 ? (
            <p style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>No medications added. Click "Add Medication" to attach prescription items.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {prescriptionItems.map((item, index) => (
                <div key={index} style={{ backgroundColor: '#111827', padding: '0.85rem', borderRadius: '4px', border: '1px solid #374151' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'center' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.7rem' }}>Medication</label>
                      <select
                        className="form-select"
                        value={item.medication_id}
                        onChange={(e) => updatePrescriptionRow(index, 'medication_id', e.target.value)}
                        required
                      >
                        <option value="">-- Drug --</option>
                        {medications.map((m) => (
                          <option key={m.id} value={m.id}>{m.name} (Stock: {m.stock_quantity}) - ₦{m.unit_price}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.7rem' }}>Dosage</label>
                      <input
                        type="text"
                        className="form-input"
                        value={item.dosage}
                        onChange={(e) => updatePrescriptionRow(index, 'dosage', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.7rem' }}>Frequency</label>
                      <input
                        type="text"
                        className="form-input"
                        value={item.frequency}
                        onChange={(e) => updatePrescriptionRow(index, 'frequency', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.7rem' }}>Qty</label>
                      <input
                        type="number"
                        className="form-input"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updatePrescriptionRow(index, 'quantity', parseInt(e.target.value))}
                        required
                      />
                    </div>

                    <button type="button" onClick={() => removePrescriptionRow(index)} className="btn btn-danger btn-sm" style={{ marginTop: '1rem' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }} disabled={loading}>
          {loading ? 'Saving & Routing...' : 'Save Clinical EHR Record & Issue Prescription'}
        </button>
      </form>
    </div>
  );
}
