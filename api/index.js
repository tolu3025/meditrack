const app = require('../server/app');
const { sequelize, User } = require('../server/models');
const seed = require('../server/seeders/seed');

let isInitialized = false;

async function ensureDatabaseInitialized() {
  if (isInitialized) return;
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    
    // Check if user table has data, if not run seeder
    const userCount = await User.count().catch(() => 0);
    if (userCount === 0) {
      console.log('🌱 Serverless DB empty: Auto-seeding default Nigerian hospital data...');
      await seed();
    }
    isInitialized = true;
  } catch (err) {
    console.error('❌ Serverless DB Init Error:', err);
  }
}

module.exports = async (req, res) => {
  await ensureDatabaseInitialized();
  return app(req, res);
};
