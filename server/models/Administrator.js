const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Administrator = sequelize.define('Administrator', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  admin_level: {
    type: DataTypes.STRING,
    defaultValue: 'Super Admin',
  },
}, {
  tableName: 'administrators',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Administrator;
