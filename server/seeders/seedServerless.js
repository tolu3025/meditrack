const bcrypt = require('bcryptjs');
const {
  sequelize,
  Department,
  User,
  Patient,
  Doctor,
  Pharmacist,
  Administrator,
  Appointment,
  MedicalRecord,
  Prescription,
  PrescriptionItem,
  Medication,
  Invoice,
  InvoiceItem,
} = require('../models');

async function seedServerless() {
  try {
    console.log('🔄 Syncing serverless database tables...');
    await sequelize.sync({ force: false });

    const existingUserCount = await User.count();
    if (existingUserCount > 0) {
      console.log('✅ Serverless database already contains data.');
      return;
    }

    console.log('🌱 Seeding serverless database with Nigerian hospital demo data...');
    const defaultPasswordHash = await bcrypt.hash('Password123!', 10); // 10 rounds for fast serverless boot

    // 1. Departments
    const departmentsData = [
      { name: 'General Medicine', description: 'Primary health consultation and outpatient care.', location: 'Block A, Floor 1' },
      { name: 'Cardiology', description: 'Cardiovascular diseases, ECG, and heart health.', location: 'Block B, Floor 2' },
      { name: 'Pediatrics', description: 'Infant, child, and adolescent healthcare.', location: 'Block C, Floor 1' },
      { name: 'Obstetrics & Gynecology', description: 'Maternal health, prenatal and postnatal care.', location: 'Block A, Floor 2' },
      { name: 'Surgery', description: 'General and specialized surgical procedures.', location: 'Block D, Floor 3' },
    ];
    const departments = await Department.bulkCreate(departmentsData);
    const deptMap = {};
    departments.forEach(d => { deptMap[d.name] = d.id; });

    // 2. Admins
    const adminUser = await User.create({
      email: 'admin@meditrack.ng',
      first_name: 'Babajide',
      last_name: 'Sanwo-Olu',
      role: 'admin',
      phone: '+2348031112233',
      password_hash: defaultPasswordHash,
    });
    await Administrator.create({ user_id: adminUser.id, admin_level: 'Super Admin' });

    // 3. Pharmacist
    const pharmUser = await User.create({
      email: 'pharm.chioma@meditrack.ng',
      first_name: 'Chioma',
      last_name: 'Umeh',
      role: 'pharmacist',
      phone: '+2348034445566',
      password_hash: defaultPasswordHash,
    });
    await Pharmacist.create({ user_id: pharmUser.id, license_number: 'PCN-2021-9871', shift: 'Morning' });

    // 4. Doctor
    const docUser = await User.create({
      email: 'dr.emeka@meditrack.ng',
      first_name: 'Emeka',
      last_name: 'Okonkwo',
      role: 'doctor',
      phone: '+2348039998877',
      department_id: deptMap['Cardiology'],
      password_hash: defaultPasswordHash,
    });
    const doctor = await Doctor.create({
      user_id: docUser.id,
      specialization: 'Cardiologist',
      license_number: 'MDCN-10492',
      department_id: deptMap['Cardiology'],
      consultation_fee: 15000.00,
    });

    // 5. Patient
    const patUser = await User.create({
      email: 'patient1@gmail.com',
      first_name: 'Tunde',
      last_name: 'Bakare',
      role: 'patient',
      phone: '+2348123456789',
      password_hash: defaultPasswordHash,
    });
    const patient = await Patient.create({
      user_id: patUser.id,
      date_of_birth: '1988-04-12',
      gender: 'Male',
      blood_group: 'O+',
      address: 'Victoria Island, Lagos',
      emergency_contact_name: 'Next of Kin Bakare',
      emergency_contact_phone: '+2348030001122',
      medical_history_summary: 'Hypertension',
    });

    // 6. Medications
    const medicationsData = [
      { name: 'Coartem (Artemether/Lumefantrine)', generic_name: 'Artemether + Lumefantrine', category: 'Antimalarial', stock_quantity: 150, unit_price: 2500.00, reorder_level: 20, supplier: 'Swiss Pharma' },
      { name: 'Paracetamol 500mg', generic_name: 'Acetaminophen', category: 'Analgesic', stock_quantity: 500, unit_price: 500.00, reorder_level: 50, supplier: 'Emzor' },
      { name: 'Amoxicillin 500mg', generic_name: 'Amoxicillin', category: 'Antibiotic', stock_quantity: 80, unit_price: 1800.00, reorder_level: 25, supplier: 'Fidson' },
      { name: 'Metformin 500mg', generic_name: 'Metformin', category: 'Antidiabetic', stock_quantity: 5, unit_price: 3000.00, reorder_level: 15, supplier: 'May & Baker' },
    ];
    await Medication.bulkCreate(medicationsData);

    // 7. Appointments
    const todayStr = new Date().toISOString().split('T')[0];
    await Appointment.create({
      patient_id: patient.id,
      doctor_id: doctor.id,
      appointment_date: todayStr,
      start_time: '10:00',
      end_time: '10:30',
      status: 'scheduled',
      reason: 'Routine Cardiology Follow-up',
    });

    console.log('🎉 Serverless Database Seeded Successfully!');
  } catch (error) {
    console.error('❌ Error during serverless database seeding:', error);
  }
}

module.exports = seedServerless;
