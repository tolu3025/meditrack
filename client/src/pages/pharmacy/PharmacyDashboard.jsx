import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Pill, AlertTriangle, Package, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PharmacyDashboard() {
  const { user } = useAuth();
  const [pendingQueue, setPendingQueue] = useState([]);
  const [lowStockMeds, setLowStockMeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queueRes = await apiRequest('/prescriptions?status=pending');
        if (queueRes.success) setPendingQueue(queueRes.data);

        const alertRes = await apiRequest('/medications/alerts');
        if (alertRes.success) setLowStockMeds(alertRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Pharmacist Workstation</h1>
        <p style={{ color: '#94A3B8' }}>Automated prescription routing queue, dispensing, and inventory stock tracking.</p>
      </div>

      <div className="grid-stats">
        <div className="glass-card" style={{ borderLeft: '4px solid #F59E0B' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>PENDING PRESCRIPTION QUEUE</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem', color: '#F59E0B' }}>{pendingQueue.length}</h2>
            </div>
            <Pill size={28} color="#F59E0B" />
          </div>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #EF4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>LOW STOCK ALERTS</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem', color: '#EF4444' }}>{lowStockMeds.length}</h2>
            </div>
            <AlertTriangle size={28} color="#EF4444" />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Real-Time Pending Prescriptions Queue</h3>
            <Link to="/pharmacy/queue" className="btn btn-primary btn-sm">View Full Queue</Link>
          </div>

          {pendingQueue.length === 0 ? (
            <p style={{ color: '#94A3B8' }}>No pending prescriptions in queue.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {pendingQueue.slice(0, 5).map((p) => (
                <div key={p.id} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontWeight: 700 }}>Patient: {p.patient?.user?.first_name} {p.patient?.user?.last_name}</h4>
                    <span style={{ fontSize: '0.8rem', color: '#0EA5E9' }}>Issued by: Dr. {p.doctor?.user?.first_name} {p.doctor?.user?.last_name}</span>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.25rem' }}>
                      Items: {p.items?.map(i => i.medication_name).join(', ')}
                    </div>
                  </div>
                  <Link to="/pharmacy/queue" className="btn btn-success btn-sm">Dispense</Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Stock Warnings</h3>
          {lowStockMeds.length === 0 ? (
            <p style={{ color: '#10B981', fontSize: '0.9rem' }}>All medication stock levels healthy!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {lowStockMeds.map((med) => (
                <div key={med.id} style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.85rem' }}>
                  <strong style={{ color: '#F8FAFC' }}>{med.name}</strong>
                  <div style={{ color: '#EF4444', fontWeight: 700, marginTop: '0.2rem' }}>
                    Stock: {med.stock_quantity} (Reorder level: {med.reorder_level})
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
