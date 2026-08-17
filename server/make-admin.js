const bcrypt = require('bcryptjs');
const { sequelize, User, Administrator } = require('./models');

async function run() {
  try {
    console.log('🔄 Checking if user exists in database...');
    const email = 'toluwanimioyetade@gmail.com';
    let user = await User.findOne({ where: { email } });

    if (user) {
      console.log('User found! Updating role to admin...');
      user.role = 'admin';
      await user.save();
      
      // Check if admin profile already exists
      const adminProfile = await Administrator.findOne({ where: { user_id: user.id } });
      if (!adminProfile) {
        console.log('Creating Admin profile record...');
        await Administrator.create({ user_id: user.id, admin_level: 'Super Admin' });
      }
      console.log('✅ User updated to Admin successfully!');
    } else {
      console.log('User not found. Creating a new Admin user account...');
      const passwordHash = await bcrypt.hash('Password123!', 12);
      user = await User.create({
        email,
        first_name: 'Toluwanimi',
        last_name: 'Oyetade',
        role: 'admin',
        phone: '+2348035552211',
        password_hash: passwordHash,
      });
      await Administrator.create({ user_id: user.id, admin_level: 'Super Admin' });
      console.log('✅ New Admin user created successfully! Email: toluwanimioyetade@gmail.com, Password: Password123!');
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error executing update:', error.message);
    process.exit(1);
  }
}

run();
