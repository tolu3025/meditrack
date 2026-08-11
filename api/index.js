const app = require('../server/app');
const { sequelize } = require('../server/models');
const seedServerless = require('../server/seeders/seedServerless');

let isInitialized = false;

async function ensureDatabaseInitialized() {
  if (isInitialized) return;
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    await seedServerless();
    isInitialized = true;
  } catch (err) {
    console.error('❌ Serverless DB Init Error:', err);
    // Do not rethrow error so Vercel function invocation does not fail
  }
}

module.exports = async (req, res) => {
  try {
    await ensureDatabaseInitialized();
    return app(req, res);
  } catch (err) {
    console.error('❌ Serverless Function Handler Error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal serverless invocation error',
      error: err.message,
    });
  }
};
