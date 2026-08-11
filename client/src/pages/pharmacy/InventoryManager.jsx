import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../utils/api';
import { Package, Plus, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function InventoryManager() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New drug form state
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [category, setCategory] = useState('Analgesic');
  const [stockQuantity, setStockQuantity] = useState(100);
  const [unitPrice, setUnitPrice] = useState(1500);
  const [reorderLevel, setReorderLevel] = useState(20);
  const [supplier, setSupplier] = useState('');

  const fetchInventory = async () => {
    try {
      const res = await apiRequest('/medications');
      if (res.success) setMedications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddMedication = async (e) => {
    e.preventDefault();
    try {
      const res = await apiRequest('/medications', 'POST', {
        name,
        generic_name: genericName,
        category,
        stock_quantity: parseInt(stockQuantity),
        unit_price: parseFloat(unitPrice),
        reorder_level: parseInt(reorderLevel),
        supplier,
      });

      if (res.success) {
        setShowAddModal(false);
        fetchInventory();
        setName('');
        setGenericName('');
      }
    } catch (err) {
      alert(err.message || 'Failed to add medication');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Pharmacy Inventory Manager</h1>
          <p style={{ color: '#94A3B8' }}>Track drug stock levels, unit prices, and automated reorder alerts.</p>
        </div>
        <button onClick={() => setShowAddModal(!showAddModal)} className="btn btn-primary">
          <Plus size={18} /> Add New Medication
        </button>
      </div>

      {showAddModal && (
        <div className="glass-card" style={{ marginBottom: '1.5rem', border: '1px solid rgba(14, 165, 233, 0.4)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Add New Drug to Inventory</h3>
          <form onSubmit={handleAddMedication} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Brand Name</label>
              <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Generic Name</label>
              <input type="text" className="form-input" value={genericName} onChange={(e) => setGenericName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input type="text" className="form-input" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Stock Quantity</label>
              <input type="number" className="form-input" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Unit Price (₦)</label>
              <input type="number" step="0.01" className="form-input" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Reorder Level Alert</label>
              <input type="number" className="form-input" value={reorderLevel} onChange={(e) => setReorderLevel(e.target.value)} required />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <button type="submit" className="btn btn-success" style={{ width: '100%' }}>Save to Inventory</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Drug Name</th>
              <th>Category</th>
              <th>Stock Quantity</th>
              <th>Unit Price</th>
              <th>Reorder Alert Level</th>
              <th>Supplier</th>
              <th>Stock Status</th>
            </tr>
          </thead>
          <tbody>
            {medications.map((m) => {
              const isLow = m.stock_quantity <= m.reorder_level;
              return (
                <tr key={m.id}>
                  <td>
                    <strong style={{ color: '#F8FAFC' }}>{m.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{m.generic_name}</div>
                  </td>
                  <td>{m.category || 'N/A'}</td>
                  <td>
                    <strong style={{ color: isLow ? '#EF4444' : '#10B981', fontSize: '1rem' }}>{m.stock_quantity}</strong>
                  </td>
                  <td>₦{parseFloat(m.unit_price).toFixed(2)}</td>
                  <td>{m.reorder_level}</td>
                  <td>{m.supplier || 'Standard Supplier'}</td>
                  <td>
                    {isLow ? (
                      <span className="badge badge-cancelled">
                        <AlertTriangle size={12} /> Low Stock
                      </span>
                    ) : (
                      <span className="badge badge-completed">Healthy</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
