const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pharmacist = sequelize.define('Pharmacist', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  license_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shift: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Morning',
  },
}, {
  tableName: 'pharmacists',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Pharmacist;
