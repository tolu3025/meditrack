const app = require('../server/app');
const { sequelize } = require('../server/models');
const seedServerless = require('../server/seeders/seedServerless');

let isInitialized = false;

async function initServerlessDB() {
  if (isInitialized) return;
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    await seedServerless();
    isInitialized = true;
    console.log('✅ Vercel Serverless Database Ready');
  } catch (err) {
    console.error('⚠️ DB Init Warning (non-fatal):', err.message);
    // Mark initialized so we don't block subsequent API requests
    isInitialized = true;
  }
}

module.exports = async (req, res) => {
  try {
    await initServerlessDB();
    return app(req, res);
  } catch (err) {
    console.error('🔥 Serverless Function Catch Error:', err);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Serverless execution error',
        error: err.message,
      });
    }
  }
};
