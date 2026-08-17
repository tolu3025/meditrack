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

async function seed() {
  try {
    console.log('🔄 Syncing database tables...');
    await sequelize.sync({ force: true });
    console.log('✅ Database tables created successfully.');

    const defaultPasswordHash = await bcrypt.hash('Password123!', 12);

    // 1. Seed Departments
    console.log('🌱 Seeding Departments...');
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

    // 2. Seed Administrators
    console.log('🌱 Seeding Admins...');
    const adminUsers = [
      { email: 'admin@meditrack.ng', first_name: 'Babajide', last_name: 'Sanwo-Olu', role: 'admin', phone: '+2348031112233', password_hash: defaultPasswordHash },
      { email: 'sysadmin@meditrack.ng', first_name: 'Hadiza', last_name: 'Bala', role: 'admin', phone: '+2348022223344', password_hash: defaultPasswordHash },
      { email: 'toluwanimioyetade@gmail.com', first_name: 'Toluwanimi', last_name: 'Oyetade', role: 'admin', phone: '+2348035552211', password_hash: defaultPasswordHash },
    ];
    for (const adminData of adminUsers) {
      const u = await User.create(adminData);
      await Administrator.create({ user_id: u.id, admin_level: 'Super Admin' });
    }

    // 3. Seed Pharmacists (5)
    console.log('🌱 Seeding Pharmacists...');
    const pharmacistUsers = [
      { email: 'pharm.chioma@meditrack.ng', first_name: 'Chioma', last_name: 'Umeh', role: 'pharmacist', phone: '+2348034445566', license_number: 'PCN-2021-9871', shift: 'Morning' },
      { email: 'pharm.ibrahim@meditrack.ng', first_name: 'Ibrahim', last_name: 'Garba', role: 'pharmacist', phone: '+2348035556677', license_number: 'PCN-2020-4321', shift: 'Afternoon' },
      { email: 'pharm.kemi@meditrack.ng', first_name: 'Kemi', last_name: 'Lawson', role: 'pharmacist', phone: '+2348036667788', license_number: 'PCN-2019-1122', shift: 'Night' },
      { email: 'pharm.jude@meditrack.ng', first_name: 'Jude', last_name: 'Anya', role: 'pharmacist', phone: '+2348037778899', license_number: 'PCN-2022-7744', shift: 'Morning' },
      { email: 'pharm.maryam@meditrack.ng', first_name: 'Maryam', last_name: 'Suleiman', role: 'pharmacist', phone: '+2348038889900', license_number: 'PCN-2023-3399', shift: 'Afternoon' },
    ];
    const createdPharmacists = [];
    for (const pData of pharmacistUsers) {
      const { license_number, shift, ...userData } = pData;
      userData.password_hash = defaultPasswordHash;
      const u = await User.create(userData);
      const pharm = await Pharmacist.create({ user_id: u.id, license_number, shift });
      createdPharmacists.push(pharm);
    }

    // 4. Seed Doctors (10)
    console.log('🌱 Seeding Doctors...');
    const doctorUsers = [
      { email: 'dr.emeka@meditrack.ng', first_name: 'Emeka', last_name: 'Okonkwo', specialization: 'Cardiologist', dept: 'Cardiology', fee: 15000.00, license: 'MDCN-10492' },
      { email: 'dr.amina@meditrack.ng', first_name: 'Amina', last_name: 'Bello', specialization: 'Pediatrician', dept: 'Pediatrics', fee: 10000.00, license: 'MDCN-20391' },
      { email: 'dr.babatunde@meditrack.ng', first_name: 'Babatunde', last_name: 'Adeleke', specialization: 'General Physician', dept: 'General Medicine', fee: 8000.00, license: 'MDCN-39102' },
      { email: 'dr.chidimma@meditrack.ng', first_name: 'Chidimma', last_name: 'Nnamdi', specialization: 'Gynecologist', dept: 'Obstetrics & Gynecology', fee: 12000.00, license: 'MDCN-48192' },
      { email: 'dr.olumide@meditrack.ng', first_name: 'Olumide', last_name: 'Fayemi', specialization: 'General Surgeon', dept: 'Surgery', fee: 20000.00, license: 'MDCN-50912' },
      { email: 'dr.grace@meditrack.ng', first_name: 'Grace', last_name: 'Danjuma', specialization: 'General Physician', dept: 'General Medicine', fee: 8000.00, license: 'MDCN-61923' },
      { email: 'dr.ifeanyi@meditrack.ng', first_name: 'Ifeanyi', last_name: 'Eze', specialization: 'Cardiologist', dept: 'Cardiology', fee: 15000.00, license: 'MDCN-72934' },
      { email: 'dr.zainab@meditrack.ng', first_name: 'Zainab', last_name: 'Usman', specialization: 'Pediatrician', dept: 'Pediatrics', fee: 10000.00, license: 'MDCN-83945' },
      { email: 'dr.femi@meditrack.ng', first_name: 'Femi', last_name: 'Balogun', specialization: 'Orthopedic Surgeon', dept: 'Surgery', fee: 22000.00, license: 'MDCN-94056' },
      { email: 'dr.ngozi@meditrack.ng', first_name: 'Ngozi', last_name: 'Chukwu', specialization: 'Obstetrician', dept: 'Obstetrics & Gynecology', fee: 12000.00, license: 'MDCN-05167' },
    ];

    const createdDoctors = [];
    for (const dData of doctorUsers) {
      const u = await User.create({
        email: dData.email,
        first_name: dData.first_name,
        last_name: dData.last_name,
        role: 'doctor',
        phone: `+23480${Math.floor(10000000 + Math.random() * 90000000)}`,
        department_id: deptMap[dData.dept],
        password_hash: defaultPasswordHash,
      });
      const doc = await Doctor.create({
        user_id: u.id,
        specialization: dData.specialization,
        license_number: dData.license,
        department_id: deptMap[dData.dept],
        consultation_fee: dData.fee,
        availability_schedule: JSON.stringify({
          Monday: ['09:00', '10:00', '11:00', '14:00', '15:00'],
          Tuesday: ['09:00', '10:00', '11:00', '14:00'],
          Wednesday: ['09:00', '10:00', '11:00', '14:00', '15:00'],
          Thursday: ['09:00', '10:00', '11:00'],
          Friday: ['09:00', '10:00', '14:00'],
        }),
      });
      createdDoctors.push(doc);
    }

    // 5. Seed Patients (20)
    console.log('🌱 Seeding Patients...');
    const patientNames = [
      { first: 'Tunde', last: 'Bakare', gender: 'Male', dob: '1988-04-12', blood: 'O+' },
      { first: 'Aisha', last: 'Yerima', gender: 'Female', dob: '1995-09-23', blood: 'AA' },
      { first: 'Chinwe', last: 'Obi', gender: 'Female', dob: '1992-01-15', blood: 'A+' },
      { first: 'Nkechi', last: 'Egwu', gender: 'Female', dob: '1990-11-05', blood: 'B+' },
      { first: 'Dayo', last: 'Alabi', gender: 'Male', dob: '1985-07-19', blood: 'O-' },
      { first: 'Musa', last: 'Shehu', gender: 'Male', dob: '1979-03-30', blood: 'AB+' },
      { first: 'Funke', last: 'Akindele', gender: 'Female', dob: '1993-08-14', blood: 'O+' },
      { first: 'Emeka', last: 'Ike', gender: 'Male', dob: '1982-12-01', blood: 'A+' },
      { first: 'Khadijah', last: 'Ahmed', gender: 'Female', dob: '1998-02-28', blood: 'B+' },
      { first: 'Sola', last: 'Sobowale', gender: 'Female', dob: '1970-06-11', blood: 'O+' },
      { first: 'Gideon', last: 'Okeke', gender: 'Male', dob: '2001-05-10', blood: 'A-' },
      { first: 'Blessing', last: 'Nwagwu', gender: 'Female', dob: '1997-10-18', blood: 'O+' },
      { first: 'Yusuf', last: 'Lawal', gender: 'Male', dob: '1986-09-09', blood: 'B+' },
      { first: 'Mercy', last: 'Johnson', gender: 'Female', dob: '1989-04-03', blood: 'AB-' },
      { first: 'Oluwaseun', last: 'Adeyemi', gender: 'Male', dob: '1991-01-25', blood: 'O+' },
      { first: 'Fatima', last: 'Buhari', gender: 'Female', dob: '1994-07-07', blood: 'A+' },
      { first: 'Chinedu', last: 'Ikedieze', gender: 'Male', dob: '1983-11-22', blood: 'O+' },
      { first: 'Titi', last: 'Kuti', gender: 'Female', dob: '1996-03-17', blood: 'B+' },
      { first: 'Osagie', last: 'Ize-Iyamu', gender: 'Male', dob: '1975-08-31', blood: 'A+' },
      { first: 'Zainab', last: 'Shinkafi', gender: 'Female', dob: '1999-12-14', blood: 'O+' },
    ];

    const createdPatients = [];
    for (let i = 0; i < patientNames.length; i++) {
      const p = patientNames[i];
      const u = await User.create({
        email: `patient${i + 1}@gmail.com`,
        first_name: p.first,
        last_name: p.last,
        role: 'patient',
        phone: `+23481${Math.floor(10000000 + Math.random() * 90000000)}`,
        password_hash: defaultPasswordHash,
      });
      const pat = await Patient.create({
        user_id: u.id,
        date_of_birth: p.dob,
        gender: p.gender,
        blood_group: p.blood,
        address: `${10 + i} Victoria Island / Ikeja, Lagos, Nigeria`,
        emergency_contact_name: `Next of Kin ${p.last}`,
        emergency_contact_phone: `+23480${Math.floor(10000000 + Math.random() * 90000000)}`,
        medical_history_summary: i % 3 === 0 ? 'Hypertension, Mild Asthma' : 'No prior chronic conditions recorded.',
      });
      createdPatients.push(pat);
    }

    // 6. Seed Medications (10)
    console.log('🌱 Seeding Medications...');
    const medicationsData = [
      { name: 'Coartem (Artemether/Lumefantrine)', generic_name: 'Artemether + Lumefantrine', category: 'Antimalarial', stock_quantity: 150, unit_price: 2500.00, reorder_level: 20, supplier: 'Swiss Pharma Nigeria' },
      { name: 'Paracetamol 500mg', generic_name: 'Acetaminophen', category: 'Analgesic', stock_quantity: 500, unit_price: 500.00, reorder_level: 50, supplier: 'Emzor Pharmaceutical' },
      { name: 'Amoxicillin 500mg', generic_name: 'Amoxicillin Trihydrate', category: 'Antibiotic', stock_quantity: 80, unit_price: 1800.00, reorder_level: 25, supplier: 'Fidson Healthcare' },
      { name: 'Metformin 500mg', generic_name: 'Metformin Hydrochloride', category: 'Antidiabetic', stock_quantity: 5, unit_price: 3000.00, reorder_level: 15, supplier: 'May & Baker Nigeria' }, // Trigger low stock alert!
      { name: 'Lisinopril 10mg', generic_name: 'Lisinopril', category: 'Antihypertensive', stock_quantity: 8, unit_price: 3500.00, reorder_level: 15, supplier: 'Neimeth International' }, // Low stock alert!
      { name: 'Ibuprofen 400mg', generic_name: 'Ibuprofen', category: 'NSAID', stock_quantity: 200, unit_price: 800.00, reorder_level: 30, supplier: 'Emzor Pharmaceutical' },
      { name: 'Omeprazole 20mg', generic_name: 'Omeprazole', category: 'Antacid / PPI', stock_quantity: 120, unit_price: 2200.00, reorder_level: 20, supplier: 'Fidson Healthcare' },
      { name: 'Ciprofloxacin 500mg', generic_name: 'Ciprofloxacin', category: 'Antibiotic', stock_quantity: 90, unit_price: 2800.00, reorder_level: 20, supplier: 'GlaxoSmithKline Nigeria' },
      { name: 'Amlodipine 5mg', generic_name: 'Amlodipine Besylate', category: 'Antihypertensive', stock_quantity: 110, unit_price: 2000.00, reorder_level: 25, supplier: 'Swiss Pharma Nigeria' },
      { name: 'Multivitamin Syrup 100ml', generic_name: 'Essential Vitamins', category: 'Supplement', stock_quantity: 60, unit_price: 1500.00, reorder_level: 10, supplier: 'May & Baker Nigeria' },
    ];
    const createdMedications = await Medication.bulkCreate(medicationsData);

    // 7. Seed Appointments (30)
    console.log('🌱 Seeding Appointments...');
    const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00'];
    const statuses = ['completed', 'scheduled', 'completed', 'scheduled', 'cancelled'];
    const reasons = [
      'Routine Checkup & Fever',
      'Severe Headache & Joint Pain',
      'Prenatal Routine Ultrasound',
      'Pediatric Immunization & Cough',
      'Cardiology Heart Palpitations Follow-up',
    ];

    const todayStr = new Date().toISOString().split('T')[0];

    const createdAppointments = [];
    for (let i = 0; i < 30; i++) {
      const patient = createdPatients[i % createdPatients.length];
      const doctor = createdDoctors[i % createdDoctors.length];
      const slot = timeSlots[i % timeSlots.length];
      const endHour = parseInt(slot.split(':')[0]) + 1;
      const endTime = `${endHour < 10 ? '0' + endHour : endHour}:00`;
      
      // Calculate date relative to today (-10 days to +10 days)
      const dayOffset = (i % 21) - 10;
      const apptDateObj = new Date();
      apptDateObj.setDate(apptDateObj.getDate() + dayOffset);
      const apptDate = apptDateObj.toISOString().split('T')[0];

      const status = dayOffset < 0 ? 'completed' : (dayOffset === 0 ? 'scheduled' : statuses[i % statuses.length]);

      const appt = await Appointment.create({
        patient_id: patient.id,
        doctor_id: doctor.id,
        appointment_date: apptDate,
        start_time: slot,
        end_time: endTime,
        status: status,
        reason: reasons[i % reasons.length],
        notes: `Patient reports symptoms lasting ${i + 1} days.`,
      });
      createdAppointments.push(appt);
    }

    // 8. Seed Medical Records, Prescriptions, and Invoices for Completed Appointments
    console.log('🌱 Seeding EHR, Prescriptions & Invoices...');
    const completedAppts = createdAppointments.filter(a => a.status === 'completed');

    for (let i = 0; i < completedAppts.length; i++) {
      const appt = completedAppts[i];
      const doc = createdDoctors.find(d => d.id === appt.doctor_id);

      // Create Medical Record
      const medRecord = await MedicalRecord.create({
        patient_id: appt.patient_id,
        doctor_id: appt.doctor_id,
        appointment_id: appt.id,
        diagnosis: i % 2 === 0 ? 'Acute Uncomplicated Malaria & Dehydration' : 'Essential Primary Hypertension Stage 1',
        symptoms: i % 2 === 0 ? 'High grade fever, chills, body pain, loss of appetite' : 'Frequent headaches, dizziness, elevated BP 145/95',
        notes: 'Advised bed rest, increased fluid intake, and prescribed appropriate medication regimen.',
      });

      // Create Prescription
      const prescStatus = i % 2 === 0 ? 'dispensed' : 'pending';
      const prescription = await Prescription.create({
        medical_record_id: medRecord.id,
        doctor_id: appt.doctor_id,
        patient_id: appt.patient_id,
        status: prescStatus,
      });

      // Prescription Items
      const med1 = createdMedications[i % createdMedications.length];
      const med2 = createdMedications[(i + 1) % createdMedications.length];

      await PrescriptionItem.create({
        prescription_id: prescription.id,
        medication_id: med1.id,
        medication_name: med1.name,
        dosage: '1 tablet',
        frequency: 'Twice Daily (12 hourly)',
        duration: '3 days',
        quantity: 6,
        instructions: 'Take after meals with warm water.',
      });

      await PrescriptionItem.create({
        prescription_id: prescription.id,
        medication_id: med2.id,
        medication_name: med2.name,
        dosage: '2 tablets',
        frequency: 'Three times daily',
        duration: '5 days',
        quantity: 10,
        instructions: 'Complete full dose even if symptoms subside.',
      });

      // Auto Billing Invoice
      const docFee = parseFloat(doc.consultation_fee);
      const medFee = parseFloat(med1.unit_price) * 6 + parseFloat(med2.unit_price) * 10;
      const totalAmount = docFee + medFee;

      const invoice = await Invoice.create({
        patient_id: appt.patient_id,
        appointment_id: appt.id,
        prescription_id: prescription.id,
        total_amount: totalAmount,
        status: i % 2 === 0 ? 'paid' : 'unpaid',
        payment_method: i % 2 === 0 ? 'Debit Card / POS' : null,
        paid_at: i % 2 === 0 ? new Date() : null,
      });

      await InvoiceItem.create({
        invoice_id: invoice.id,
        description: `Consultation Fee (${doc.specialization})`,
        amount: docFee,
        item_type: 'consultation',
      });

      await InvoiceItem.create({
        invoice_id: invoice.id,
        description: `Medications (${med1.name}, ${med2.name})`,
        amount: medFee,
        item_type: 'medication',
      });
    }

    console.log('🎉 Seeding Completed Successfully!');
    console.log('--------------------------------------------------');
    console.log('Test Credentials (Password for all: Password123!):');
    console.log('Admin:       admin@meditrack.ng');
    console.log('Doctor:      dr.emeka@meditrack.ng');
    console.log('Pharmacist:  pharm.chioma@meditrack.ng');
    console.log('Patient:     patient1@gmail.com');
    console.log('--------------------------------------------------');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seed().then(() => process.exit(0));
}

module.exports = seed;
