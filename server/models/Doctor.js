const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Doctor = sequelize.define('Doctor', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  license_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  consultation_fee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 5000.00,
  },
  availability_schedule: {
    type: DataTypes.TEXT, // Stored as JSON string or text e.g. {"Monday": ["09:00-17:00"]}
    allowNull: true,
  },
}, {
  tableName: 'doctors',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Doctor;
