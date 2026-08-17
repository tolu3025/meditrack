const { Doctor, User, Department } = require('./models');

async function test() {
  try {
    const count = await Doctor.count();
    console.log('Total Doctors in Database:', count);
    const docs = await Doctor.findAll({
      include: [
        { model: User, as: 'user', attributes: ['first_name', 'last_name', 'email'] },
        { model: Department, as: 'department', attributes: ['name'] }
      ]
    });
    for (const d of docs) {
      console.log(`- Dr. ${d.user?.first_name} ${d.user?.last_name} (${d.specialization})`);
    }
    process.exit(0);
  } catch (error) {
    console.error('Error fetching doctors:', error.message);
    process.exit(1);
  }
}

test();
