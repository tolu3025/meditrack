import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';

// Patient Portal Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import BookAppointment from './pages/patient/BookAppointment';
import MedicalHistory from './pages/patient/MedicalHistory';
import PatientBills from './pages/patient/PatientBills';

// Doctor Portal Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import ConsultationForm from './pages/doctor/ConsultationForm';

// Pharmacy Portal Pages
import PharmacyDashboard from './pages/pharmacy/PharmacyDashboard';
import PrescriptionQueue from './pages/pharmacy/PrescriptionQueue';
import InventoryManager from './pages/pharmacy/InventoryManager';

// Admin Portal Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';

function MainLayout({ children }) {
  const { user } = useAuth();
  if (!user) return <>{children}</>;

  const path = window.location.pathname;
  if (path === '/' || path === '/login') return <>{children}</>;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F7F8FA' }}>
      {/* Slim sidebar on the left */}
      <Sidebar />
      {/* Everything else: top navbar + scrollable content */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <Navbar />
        <main style={{ flex: 1, overflowY: 'auto' }}>{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />

            {/* Patient Routes */}
            <Route element={<PrivateRoute allowedRoles={['patient']} />}>
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route path="/patient/book" element={<BookAppointment />} />
              <Route path="/patient/history" element={<MedicalHistory />} />
              <Route path="/patient/bills" element={<PatientBills />} />
            </Route>

            {/* Doctor Routes */}
            <Route element={<PrivateRoute allowedRoles={['doctor']} />}>
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/consultation" element={<ConsultationForm />} />
              <Route path="/doctor/appointments" element={<DoctorDashboard />} />
              <Route path="/doctor/patients" element={<DoctorDashboard />} />
              <Route path="/doctor/prescriptions" element={<DoctorDashboard />} />
            </Route>

            {/* Pharmacist Routes */}
            <Route element={<PrivateRoute allowedRoles={['pharmacist']} />}>
              <Route path="/pharmacy/dashboard" element={<PharmacyDashboard />} />
              <Route path="/pharmacy/queue" element={<PrescriptionQueue />} />
              <Route path="/pharmacy/inventory" element={<InventoryManager />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/departments" element={<AdminDashboard />} />
              <Route path="/admin/appointments" element={<AdminDashboard />} />
              <Route path="/admin/billing" element={<AdminDashboard />} />
            </Route>

            {/* Default Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}
