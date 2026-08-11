import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function PatientBills() {
  const { user } = useAuth();
  const [billingData, setBillingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  const fetchInvoices = async () => {
    if (user && user.profile_id) {
      try {
        const res = await apiRequest(`/billing/patient/${user.profile_id}`);
        if (res.success) setBillingData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [user]);

  const handlePay = async (invoiceId) => {
    setPayingId(invoiceId);
    try {
      const res = await apiRequest(`/billing/invoices/${invoiceId}/pay`, 'PUT', {
        payment_method: 'Online Card / POS',
      });
      if (res.success) {
        await fetchInvoices();
      }
    } catch (err) {
      alert(err.message || 'Payment processing failed');
    } finally {
      setPayingId(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Accumulated Hospital Bills</h1>
        <p style={{ color: '#94A3B8' }}>Automated invoice accumulation combining consultation fees and pharmacy prescriptions.</p>
      </div>

      <div className="grid-stats" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="glass-card" style={{ borderLeft: '4px solid #EF4444' }}>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700 }}>TOTAL UNPAID BALANCE</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#EF4444', marginTop: '0.25rem' }}>
            ₦{billingData?.summary?.total_unpaid || '0.00'}
          </h2>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #10B981' }}>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700 }}>TOTAL PAID TO DATE</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981', marginTop: '0.25rem' }}>
            ₦{billingData?.summary?.total_paid || '0.00'}
          </h2>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Invoice Details</h3>

        {!billingData || billingData.invoices.length === 0 ? (
          <p style={{ color: '#94A3B8' }}>No hospital invoices on record.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {billingData.invoices.map((inv) => (
              <div key={inv.id} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: '1rem' }}>Invoice #{inv.id}</span>
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8', marginLeft: '0.75rem' }}>
                      Date: {new Date(inv.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`badge badge-${inv.status}`}>{inv.status}</span>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  {inv.items?.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#CBD5E1', padding: '0.25rem 0' }}>
                      <span>{item.description} ({item.item_type})</span>
                      <strong style={{ color: '#F8FAFC' }}>₦{parseFloat(item.amount).toFixed(2)}</strong>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Total Invoice Amount:</span>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0EA5E9' }}>₦{parseFloat(inv.total_amount).toFixed(2)}</h3>
                  </div>

                  {inv.status === 'unpaid' ? (
                    <button
                      onClick={() => handlePay(inv.id)}
                      className="btn btn-success"
                      disabled={payingId === inv.id}
                    >
                      <CreditCard size={18} />
                      {payingId === inv.id ? 'Processing...' : 'Pay Bill Now'}
                    </button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10B981', fontWeight: 700, fontSize: '0.9rem' }}>
                      <CheckCircle size={18} /> Paid via {inv.payment_method}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
