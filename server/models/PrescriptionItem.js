const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PrescriptionItem = sequelize.define('PrescriptionItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  prescription_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  medication_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  medication_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dosage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  frequency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'prescription_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = PrescriptionItem;
