const bcrypt = require('bcryptjs');
const { sequelize, User, Doctor } = require('./models');

async function run() {
  try {
    const email = 'williamsbenjaminacc@gmail.com';
    console.log(`Checking if user ${email} exists...`);
    let user = await User.findOne({ where: { email } });

    if (user) {
      console.log('User found! Promoting to doctor...');
      user.role = 'doctor';
      await user.save();

      // Check if Doctor profile exists
      let docProfile = await Doctor.findOne({ where: { user_id: user.id } });
      if (!docProfile) {
        console.log('Doctor profile not found. Creating one...');
        docProfile = await Doctor.create({
          user_id: user.id,
          specialization: 'General Physician',
          license_number: `MDCN-${Date.now()}`,
          consultation_fee: 6500.00
        });
      }
      console.log('✅ Existing user successfully promoted to Doctor!');
    } else {
      console.log('User not found. Creating new Doctor account...');
      const passwordHash = await bcrypt.hash('Password123!', 12);
      user = await User.create({
        email,
        first_name: 'Benjamin',
        last_name: 'Williams',
        role: 'doctor',
        phone: '+2348056781234',
        password_hash: passwordHash
      });

      await Doctor.create({
        user_id: user.id,
        specialization: 'General Physician',
        license_number: `MDCN-${Date.now()}`,
        consultation_fee: 6500.00
      });
      console.log('✅ New Doctor account created successfully! Email: williamsbenjaminacc@gmail.com, Password: Password123!');
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating database:', error.message);
    process.exit(1);
  }
}

run();
