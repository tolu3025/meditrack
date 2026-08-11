const {
  Patient,
  User,
  MedicalRecord,
  Prescription,
  PrescriptionItem,
  Doctor,
  Invoice,
  InvoiceItem,
  Appointment,
} = require('../models');

/**
 * Get all patients (doctor/admin only)
 */
const getAllPatients = async (req, res, next) => {
  try {
    const patients = await Patient.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password_hash'] },
        },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: patients,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get patient by ID
 */
const getPatientById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password_hash'] },
        },
      ],
    });

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    // Role check: patient can only access their own record
    if (req.user.role === 'patient') {
      const ownPatient = await Patient.findOne({ where: { user_id: req.user.id } });
      if (!ownPatient || ownPatient.id !== patient.id) {
        return res.status(403).json({ success: false, message: 'Forbidden: You cannot view other patient records.' });
      }
    }

    res.json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new patient (admin)
 */
const createPatient = async (req, res, next) => {
  try {
    const {
      email,
      password = 'Password123!',
      first_name,
      last_name,
      phone,
      date_of_birth,
      gender,
      blood_group,
      address,
      emergency_contact_name,
      emergency_contact_phone,
      medical_history_summary,
    } = req.body;

    const bcrypt = require('bcryptjs');
    const password_hash = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      password_hash,
      role: 'patient',
      first_name,
      last_name,
      phone,
    });

    const patient = await Patient.create({
      user_id: user.id,
      date_of_birth,
      gender,
      blood_group,
      address,
      emergency_contact_name,
      emergency_contact_phone,
      medical_history_summary,
    });

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully.',
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update patient details
 */
const updatePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByPk(id, { include: [{ model: User, as: 'user' }] });

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    // Check ownership if patient role
    if (req.user.role === 'patient') {
      const ownPatient = await Patient.findOne({ where: { user_id: req.user.id } });
      if (!ownPatient || ownPatient.id !== patient.id) {
        return res.status(403).json({ success: false, message: 'Forbidden: You cannot edit other patient records.' });
      }
    }

    const {
      first_name,
      last_name,
      phone,
      date_of_birth,
      gender,
      blood_group,
      address,
      emergency_contact_name,
      emergency_contact_phone,
      medical_history_summary,
    } = req.body;

    if (patient.user) {
      if (first_name) patient.user.first_name = first_name;
      if (last_name) patient.user.last_name = last_name;
      if (phone) patient.user.phone = phone;
      await patient.user.save();
    }

    if (date_of_birth) patient.date_of_birth = date_of_birth;
    if (gender) patient.gender = gender;
    if (blood_group) patient.blood_group = blood_group;
    if (address) patient.address = address;
    if (emergency_contact_name) patient.emergency_contact_name = emergency_contact_name;
    if (emergency_contact_phone) patient.emergency_contact_phone = emergency_contact_phone;
    if (medical_history_summary !== undefined) patient.medical_history_summary = medical_history_summary;

    await patient.save();

    res.json({
      success: true,
      message: 'Patient profile updated successfully.',
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get full patient EHR history (medical records, prescriptions, appointments, invoices)
 */
const getPatientHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: { exclude: ['password_hash'] } },
      ],
    });

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    // Role check for patients
    if (req.user.role === 'patient') {
      const ownPatient = await Patient.findOne({ where: { user_id: req.user.id } });
      if (!ownPatient || ownPatient.id !== patient.id) {
        return res.status(403).json({ success: false, message: 'Forbidden: You cannot view this history.' });
      }
    }

    const medicalRecords = await MedicalRecord.findAll({
      where: { patient_id: id },
      include: [
        {
          model: Doctor,
          as: 'doctor',
          include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name'] }],
        },
        {
          model: Prescription,
          as: 'prescription',
          include: [{ model: PrescriptionItem, as: 'items' }],
        },
        {
          model: Appointment,
          as: 'appointment',
        },
      ],
      order: [['created_at', 'DESC']],
    });

    const prescriptions = await Prescription.findAll({
      where: { patient_id: id },
      include: [
        { model: PrescriptionItem, as: 'items' },
        { model: Doctor, as: 'doctor', include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name'] }] },
      ],
      order: [['created_at', 'DESC']],
    });

    const appointments = await Appointment.findAll({
      where: { patient_id: id },
      include: [
        { model: Doctor, as: 'doctor', include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name', 'phone'] }] },
      ],
      order: [['appointment_date', 'DESC'], ['start_time', 'DESC']],
    });

    const invoices = await Invoice.findAll({
      where: { patient_id: id },
      include: [{ model: InvoiceItem, as: 'items' }],
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        patient,
        medicalRecords,
        prescriptions,
        appointments,
        invoices,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  getPatientHistory,
};
