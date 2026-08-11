const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Prescription = sequelize.define('Prescription', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  medical_record_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'dispensed', 'cancelled'),
    defaultValue: 'pending',
  },
}, {
  tableName: 'prescriptions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Prescription;
