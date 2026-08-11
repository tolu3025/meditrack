const app = require('../server/app');
const { sequelize } = require('../server/models');
const seedServerless = require('../server/seeders/seedServerless');

let isInitialized = false;

function initServerlessDB() {
  if (isInitialized) return;
  isInitialized = true;

  // Non-blocking background database initialization
  Promise.resolve().then(async () => {
    try {
      await sequelize.authenticate();
      await sequelize.sync({ force: false });
      await seedServerless();
      console.log('✅ Vercel DB Ready');
    } catch (err) {
      console.warn('⚠️ Serverless DB init warning:', err.message);
    }
  });
}

module.exports = (req, res) => {
  initServerlessDB();
  return app(req, res);
};
