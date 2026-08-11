const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Medication = sequelize.define('Medication', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  generic_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  reorder_level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
  },
  supplier: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'medications',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Medication;
