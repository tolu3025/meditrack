const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.VERCEL_ENV);
const dialect = process.env.DB_DIALECT || 'sqlite';

let sequelize;

if (dialect === 'sqlite') {
  // Use :memory: or /tmp/meditrack.sqlite on Vercel serverless environment
  const storagePath = isVercel 
    ? ':memory:' 
    : path.resolve(__dirname, '..', process.env.DB_STORAGE || 'meditrack.sqlite');

  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false,
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'meditrack_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

module.exports = sequelize;
