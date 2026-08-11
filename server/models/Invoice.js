const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  appointment_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  prescription_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  status: {
    type: DataTypes.ENUM('unpaid', 'paid', 'cancelled'),
    defaultValue: 'unpaid',
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paid_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'invoices',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Invoice;
