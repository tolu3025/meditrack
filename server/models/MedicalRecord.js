const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MedicalRecord = sequelize.define('MedicalRecord', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  appointment_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  diagnosis: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  symptoms: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'medical_records',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = MedicalRecord;
