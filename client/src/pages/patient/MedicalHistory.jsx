import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { FileText, Pill, Calendar, User, Clock, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function MedicalHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (user && user.profile_id) {
        try {
          const res = await apiRequest(`/patients/${user.profile_id}/history`);
          if (res.success) setHistory(res.data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchHistory();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Digital EHR Health History</h1>
        <p style={{ color: '#94A3B8' }}>Unified digital health record including diagnoses, doctor clinical notes, and prescriptions.</p>
      </div>

      {!history || history.medicalRecords.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <FileText size={48} color="#64748B" style={{ marginBottom: '1rem' }} />
          <h3>No EHR Medical Records Found</h3>
          <p style={{ color: '#94A3B8' }}>Your clinical history will appear here after your first consultation.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {history.medicalRecords.map((record) => (
            <div key={record.id} className="glass-card" style={{ borderLeft: '4px solid #0EA5E9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC' }}>{record.diagnosis}</h3>
                  <div style={{ fontSize: '0.85rem', color: '#0EA5E9', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={15} /> Attending Doctor: Dr. {record.doctor?.user?.first_name} {record.doctor?.user?.last_name} ({record.doctor?.specialization})
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={14} /> {new Date(record.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Symptoms</span>
                  <p style={{ fontSize: '0.9rem', color: '#CBD5E1', marginTop: '0.25rem' }}>{record.symptoms || 'N/A'}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Clinical Notes</span>
                  <p style={{ fontSize: '0.9rem', color: '#CBD5E1', marginTop: '0.25rem' }}>{record.notes || 'N/A'}</p>
                </div>
              </div>

              {record.prescription && (
                <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '12px', padding: '1rem', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Pill size={16} /> Associated Prescription (Status: {record.prescription.status.toUpperCase()})
                    </span>
                    <span className={`badge badge-${record.prescription.status}`}>{record.prescription.status}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {record.prescription.items?.map((item) => (
                      <div key={item.id} style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.05)', paddingBottom: '0.35rem' }}>
                        <div>
                          <strong style={{ color: '#F8FAFC' }}>{item.medication_name}</strong> - {item.dosage} ({item.frequency} for {item.duration})
                        </div>
                        <span style={{ color: '#94A3B8' }}>Qty: {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
