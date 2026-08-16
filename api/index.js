const app = require('../server/app');
const { sequelize } = require('../server/models');
const seedServerless = require('../server/seeders/seedServerless');

let initPromise = null;

async function initServerlessDB() {
  if (!initPromise) {
    initPromise = (async () => {
      try {
        await sequelize.authenticate();
        await sequelize.sync({ force: false });
        await seedServerless();
        console.log('✅ Vercel DB Ready');
      } catch (err) {
        console.warn('⚠️ Serverless DB init error:', err.message);
        initPromise = null; // reset to allow retry on next request
        throw err;
      }
    })();
  }
  return initPromise;
}

module.exports = async (req, res) => {
  try {
    await initServerlessDB();
  } catch (err) {
    // We log but still try to process to let express handle connection errors gracefully
    console.error('Database initialization failed:', err);
  }
  return app(req, res);
};
