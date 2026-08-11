const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Appointment = sequelize.define('Appointment', {
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
  appointment_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  start_time: {
    type: DataTypes.STRING, // e.g. "09:00"
    allowNull: false,
  },
  end_time: {
    type: DataTypes.STRING, // e.g. "09:30"
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'no_show'),
    defaultValue: 'scheduled',
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'appointments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Appointment;
