const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./routes/auth.routes');
const patientRoutes = require('./routes/patient.routes');
const doctorRoutes = require('./routes/doctor.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const medicalRecordRoutes = require('./routes/medicalRecord.routes');
const prescriptionRoutes = require('./routes/prescription.routes');
const medicationRoutes = require('./routes/medication.routes');
const billingRoutes = require('./routes/billing.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Allow requests from: local dev, Vercel deployment, and Capacitor mobile app
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5000',
  'http://localhost',
  'https://meditrack-tawny.vercel.app',
  'capacitor://localhost',
  'ionic://localhost',
  'null',              // file:// protocol
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // permissive – tighten in production if needed
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors()); // pre-flight for all routes

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health Check Endpoints
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    system: 'MediTrack HMS API Server',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    system: 'MediTrack HMS API Server',
    timestamp: new Date().toISOString(),
  });
});

// API Routes (Mounted both with /api and direct prefix for Vercel rewrite compatibility)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/patients', patientRoutes);
app.use('/patients', patientRoutes);

app.use('/api/doctors', doctorRoutes);
app.use('/doctors', doctorRoutes);

app.use('/api/appointments', appointmentRoutes);
app.use('/appointments', appointmentRoutes);

app.use('/api/medical-records', medicalRecordRoutes);
app.use('/medical-records', medicalRecordRoutes);

app.use('/api/prescriptions', prescriptionRoutes);
app.use('/prescriptions', prescriptionRoutes);

app.use('/api/medications', medicationRoutes);
app.use('/medications', medicationRoutes);

app.use('/api/billing', billingRoutes);
app.use('/billing', billingRoutes);

app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);

// JSON 404 handler — must be BEFORE errorHandler
// Prevents Vercel from returning HTML for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
