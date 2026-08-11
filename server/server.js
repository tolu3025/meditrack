const app = require('./app');
const { sequelize } = require('./models');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Ensure models are synchronized
    await sequelize.sync();
    console.log('✅ Sequelize models synchronized.');

    app.listen(PORT, () => {
      console.log(`🚀 MediTrack HMS API Server running on port ${PORT}`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to database:', error);
    process.exit(1);
  }
}

startServer();
