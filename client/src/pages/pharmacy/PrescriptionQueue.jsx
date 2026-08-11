import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../utils/api';
import { Pill, CheckCircle, AlertCircle, PackageCheck } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function PrescriptionQueue() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dispensingId, setDispensingId] = useState(null);
  const [alertInfo, setAlertInfo] = useState(null);

  const fetchQueue = async () => {
    try {
      const res = await apiRequest('/prescriptions?status=pending');
      if (res.success) setPrescriptions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleDispense = async (prescriptionId) => {
    setDispensingId(prescriptionId);
    setAlertInfo(null);
    try {
      const res = await apiRequest(`/prescriptions/${prescriptionId}/dispense`, 'PUT');
      if (res.success) {
        setAlertInfo({
          type: 'success',
          message: res.message,
          lowStockAlerts: res.data.lowStockAlerts,
        });
        await fetchQueue();
      }
    } catch (err) {
      setAlertInfo({ type: 'danger', message: err.message || 'Dispensing failed.' });
    } finally {
      setDispensingId(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Automated Pharmacy Dispensing Queue</h1>
        <p style={{ color: '#94A3B8' }}>Prescriptions issued by doctors arrive here automatically. Dispensing deducts stock and bills patient.</p>
      </div>

      {alertInfo && (
        <div style={{
          background: alertInfo.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${alertInfo.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          borderRadius: '12px',
          padding: '1rem',
          color: alertInfo.type === 'success' ? '#10B981' : '#EF4444',
          marginBottom: '1.5rem',
        }}>
          <div style={{ fontWeight: 700 }}>{alertInfo.message}</div>
          {alertInfo.lowStockAlerts?.length > 0 && (
            <div style={{ marginTop: '0.5rem', color: '#F59E0B', fontSize: '0.85rem' }}>
              ⚠️ Low Stock Triggered: {alertInfo.lowStockAlerts.map(a => `${a.name} (Stock: ${a.current_stock})`).join(', ')}
            </div>
          )}
        </div>
      )}

      {prescriptions.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <PackageCheck size={48} color="#10B981" style={{ marginBottom: '1rem' }} />
          <h3>Pharmacy Queue Clear</h3>
          <p style={{ color: '#94A3B8' }}>All doctor prescriptions have been dispensed.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {prescriptions.map((p) => (
            <div key={p.id} className="glass-card" style={{ borderLeft: '4px solid #F59E0B' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                    Patient: {p.patient?.user?.first_name} {p.patient?.user?.last_name} ({p.patient?.user?.phone || 'No phone'})
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                    Prescribed by: Dr. {p.doctor?.user?.first_name} {p.doctor?.user?.last_name}
                  </span>
                </div>
                <span className="badge badge-pending">PENDING DISPENSE</span>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Prescribed Drugs</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.4rem' }}>
                  {p.items?.map((item) => (
                    <div key={item.id} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.6rem 0.85rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                      <span>
                        <strong style={{ color: '#0EA5E9' }}>{item.medication_name}</strong> ({item.dosage}, {item.frequency})
                      </span>
                      <span style={{ color: '#F8FAFC', fontWeight: 700 }}>Qty: {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleDispense(p.id)}
                className="btn btn-success"
                style={{ width: '100%', padding: '0.75rem' }}
                disabled={dispensingId === p.id}
              >
                <Pill size={18} />
                {dispensingId === p.id ? 'Deducting Stock & Generating Bill...' : 'Confirm & Dispense Medication'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
