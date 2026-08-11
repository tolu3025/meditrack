const sequelize = require('../config/database');
const Department = require('./Department');
const User = require('./User');
const Patient = require('./Patient');
const Doctor = require('./Doctor');
const Pharmacist = require('./Pharmacist');
const Administrator = require('./Administrator');
const Appointment = require('./Appointment');
const MedicalRecord = require('./MedicalRecord');
const Prescription = require('./Prescription');
const PrescriptionItem = require('./PrescriptionItem');
const Medication = require('./Medication');
const Invoice = require('./Invoice');
const InvoiceItem = require('./InvoiceItem');

// Associations

// User & Department
User.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });
Department.hasMany(User, { foreignKey: 'department_id', as: 'users' });

// Roles & User
Patient.belongsTo(User, { foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE' });
User.hasOne(Patient, { foreignKey: 'user_id', as: 'patient_profile', onDelete: 'CASCADE' });

Doctor.belongsTo(User, { foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE' });
User.hasOne(Doctor, { foreignKey: 'user_id', as: 'doctor_profile', onDelete: 'CASCADE' });

Doctor.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });
Department.hasMany(Doctor, { foreignKey: 'department_id', as: 'doctors' });

Pharmacist.belongsTo(User, { foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE' });
User.hasOne(Pharmacist, { foreignKey: 'user_id', as: 'pharmacist_profile', onDelete: 'CASCADE' });

Administrator.belongsTo(User, { foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE' });
User.hasOne(Administrator, { foreignKey: 'user_id', as: 'admin_profile', onDelete: 'CASCADE' });

// Appointments
Appointment.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient', onDelete: 'CASCADE' });
Patient.hasMany(Appointment, { foreignKey: 'patient_id', as: 'appointments' });

Appointment.belongsTo(Doctor, { foreignKey: 'doctor_id', as: 'doctor', onDelete: 'CASCADE' });
Doctor.hasMany(Appointment, { foreignKey: 'doctor_id', as: 'appointments' });

// Medical Records
MedicalRecord.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient', onDelete: 'CASCADE' });
Patient.hasMany(MedicalRecord, { foreignKey: 'patient_id', as: 'medical_records' });

MedicalRecord.belongsTo(Doctor, { foreignKey: 'doctor_id', as: 'doctor' });
Doctor.hasMany(MedicalRecord, { foreignKey: 'doctor_id', as: 'medical_records' });

MedicalRecord.belongsTo(Appointment, { foreignKey: 'appointment_id', as: 'appointment', onDelete: 'SET NULL' });
Appointment.hasOne(MedicalRecord, { foreignKey: 'appointment_id', as: 'medical_record' });

// Prescriptions
Prescription.belongsTo(MedicalRecord, { foreignKey: 'medical_record_id', as: 'medical_record', onDelete: 'SET NULL' });
MedicalRecord.hasOne(Prescription, { foreignKey: 'medical_record_id', as: 'prescription' });

Prescription.belongsTo(Doctor, { foreignKey: 'doctor_id', as: 'doctor' });
Doctor.hasMany(Prescription, { foreignKey: 'doctor_id', as: 'prescriptions' });

Prescription.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient', onDelete: 'CASCADE' });
Patient.hasMany(Prescription, { foreignKey: 'patient_id', as: 'prescriptions' });

PrescriptionItem.belongsTo(Prescription, { foreignKey: 'prescription_id', as: 'prescription', onDelete: 'CASCADE' });
Prescription.hasMany(PrescriptionItem, { foreignKey: 'prescription_id', as: 'items', onDelete: 'CASCADE' });

PrescriptionItem.belongsTo(Medication, { foreignKey: 'medication_id', as: 'medication', onDelete: 'SET NULL' });
Medication.hasMany(PrescriptionItem, { foreignKey: 'medication_id', as: 'prescription_items' });

// Invoices (Billing)
Invoice.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient', onDelete: 'CASCADE' });
Patient.hasMany(Invoice, { foreignKey: 'patient_id', as: 'invoices' });

Invoice.belongsTo(Appointment, { foreignKey: 'appointment_id', as: 'appointment', onDelete: 'SET NULL' });
Invoice.belongsTo(Prescription, { foreignKey: 'prescription_id', as: 'prescription', onDelete: 'SET NULL' });

InvoiceItem.belongsTo(Invoice, { foreignKey: 'invoice_id', as: 'invoice', onDelete: 'CASCADE' });
Invoice.hasMany(InvoiceItem, { foreignKey: 'invoice_id', as: 'items', onDelete: 'CASCADE' });

module.exports = {
  sequelize,
  Department,
  User,
  Patient,
  Doctor,
  Pharmacist,
  Administrator,
  Appointment,
  MedicalRecord,
  Prescription,
  PrescriptionItem,
  Medication,
  Invoice,
  InvoiceItem,
};
