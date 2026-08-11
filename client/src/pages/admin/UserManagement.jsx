import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../utils/api';
import { Users, UserCheck, UserX, Shield, Mail } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = async () => {
    try {
      const res = await apiRequest('/admin/users');
      if (res.success) setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId) => {
    try {
      const res = await apiRequest(`/admin/users/${userId}/status`, 'PUT');
      if (res.success) {
        await fetchUsers();
      }
    } catch (err) {
      alert(err.message || 'Status toggle failed.');
    }
  };

  const filteredUsers = roleFilter === 'all' ? users : users.filter((u) => u.role === roleFilter);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>User Accounts Management</h1>
          <p style={{ color: '#94A3B8' }}>Manage doctors, pharmacists, admins, and patient accounts across MediTrack.</p>
        </div>
        <div>
          <select className="form-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">All Roles ({users.length})</option>
            <option value="doctor">Doctors</option>
            <option value="pharmacist">Pharmacists</option>
            <option value="patient">Patients</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Account Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>
                  <strong style={{ color: '#F8FAFC' }}>{u.first_name} {u.last_name}</strong>
                </td>
                <td>{u.email}</td>
                <td>
                  <span className="badge" style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#0EA5E9', border: '1px solid rgba(14, 165, 233, 0.3)' }}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td>{u.phone || 'N/A'}</td>
                <td>{u.department?.name || 'Hospital Wide'}</td>
                <td>
                  {u.is_active ? (
                    <span className="badge badge-completed">ACTIVE</span>
                  ) : (
                    <span className="badge badge-cancelled">DEACTIVATED</span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleToggleStatus(u.id)}
                    className={`btn btn-sm ${u.is_active ? 'btn-danger' : 'btn-success'}`}
                  >
                    {u.is_active ? <UserX size={14} /> : <UserCheck size={14} />}
                    {u.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
