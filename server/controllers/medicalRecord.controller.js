const {
  MedicalRecord,
  Patient,
  Doctor,
  Appointment,
  Prescription,
  PrescriptionItem,
  User,
  Invoice,
  InvoiceItem,
  Medication,
} = require('../models');

/**
 * Create medical record (doctor)
 */
const createMedicalRecord = async (req, res, next) => {
  try {
    const {
      patient_id,
      appointment_id,
      diagnosis,
      symptoms,
      notes,
      prescriptions: prescriptionData, // Optional inline prescriptions array [{ medication_id, medication_name, dosage, frequency, duration, quantity, instructions }]
    } = req.body;

    if (!patient_id || !diagnosis) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID and diagnosis are required.',
      });
    }

    // Find doctor profile for current user
    let doctor_id = req.body.doctor_id;
    if (!doctor_id) {
      const doctor = await Doctor.findOne({ where: { user_id: req.user.id } });
      if (!doctor) {
        return res.status(403).json({ success: false, message: 'Only registered doctors can create medical records.' });
      }
      doctor_id = doctor.id;
    }

    const medicalRecord = await MedicalRecord.create({
      patient_id,
      doctor_id,
      appointment_id: appointment_id || null,
      diagnosis,
      symptoms,
      notes,
    });

    // If appointment is provided, auto mark appointment as completed
    if (appointment_id) {
      const appointment = await Appointment.findByPk(appointment_id);
      if (appointment && appointment.status !== 'completed') {
        appointment.status = 'completed';
        await appointment.save();
      }
    }

    // CRITICAL: AUTOMATED PRESCRIPTION-TO-PHARMACY ROUTING
    let createdPrescription = null;
    if (prescriptionData && Array.isArray(prescriptionData) && prescriptionData.length > 0) {
      createdPrescription = await Prescription.create({
        medical_record_id: medicalRecord.id,
        doctor_id,
        patient_id,
        status: 'pending', // Auto routed to pharmacy queue
      });

      const itemsToCreate = prescriptionData.map((item) => ({
        prescription_id: createdPrescription.id,
        medication_id: item.medication_id || null,
        medication_name: item.medication_name || item.name,
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
        quantity: item.quantity || 1,
        instructions: item.instructions || '',
      }));

      await PrescriptionItem.bulkCreate(itemsToCreate);
    }

    // AUTOMATED BILLING ACCUMULATOR
    try {
      const doctorProfile = await Doctor.findByPk(doctor_id, {
        include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name'] }]
      });
      const consultationFee = doctorProfile ? parseFloat(doctorProfile.consultation_fee || 0) : 0;
      let invoiceItems = [];

      // 1. Add Consultation fee charge
      if (consultationFee > 0) {
        const docName = doctorProfile?.user ? `${doctorProfile.user.first_name} ${doctorProfile.user.last_name}` : 'Consulting Doctor';
        invoiceItems.push({
          description: `Consultation Fee (Dr. ${docName})`,
          amount: consultationFee,
          item_type: 'consultation'
        });
      }

      // 2. Add Prescription items estimate charges
      if (prescriptionData && Array.isArray(prescriptionData) && prescriptionData.length > 0) {
        for (const pItem of prescriptionData) {
          if (pItem.medication_id) {
            const med = await Medication.findByPk(pItem.medication_id);
            if (med) {
              const qty = pItem.quantity || 1;
              const price = parseFloat(med.unit_price || med.unitPrice || 0);
              if (price > 0) {
                invoiceItems.push({
                  description: `${med.name} (x${qty})`,
                  amount: price * qty,
                  item_type: 'medication'
                });
              }
            }
          }
        }
      }

      const totalAmount = invoiceItems.reduce((sum, item) => sum + parseFloat(item.amount), 0);

      if (totalAmount > 0) {
        const invoice = await Invoice.create({
          patient_id,
          appointment_id: appointment_id || null,
          prescription_id: createdPrescription ? createdPrescription.id : null,
          total_amount: totalAmount,
          status: 'unpaid'
        });

        const invoiceItemsWithId = invoiceItems.map(item => ({
          invoice_id: invoice.id,
          ...item
        }));

        await InvoiceItem.bulkCreate(invoiceItemsWithId);
        console.log(`✅ Automated Invoice created successfully for Patient ${patient_id}. Total: ₦${totalAmount}`);
      }
    } catch (billingErr) {
      console.error('⚠️ Failed to generate automated consultation invoice:', billingErr.message);
    }

    const result = await MedicalRecord.findByPk(medicalRecord.id, {
      include: [
        { model: Patient, as: 'patient', include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name'] }] },
        { model: Doctor, as: 'doctor', include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name'] }] },
        {
          model: Prescription,
          as: 'prescription',
          include: [{ model: PrescriptionItem, as: 'items' }],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Medical record created successfully. Prescriptions auto-routed to pharmacy queue.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all medical records
 */
const getMedicalRecords = async (req, res, next) => {
  try {
    const { role, id } = req.user;
    let whereClause = {};

    if (role === 'patient') {
      const patient = await Patient.findOne({ where: { user_id: id } });
      if (!patient) return res.json({ success: true, data: [] });
      whereClause.patient_id = patient.id;
    } else if (role === 'doctor') {
      const doctor = await Doctor.findOne({ where: { user_id: id } });
      if (doctor) {
        whereClause.doctor_id = doctor.id;
      }
    }

    const records = await MedicalRecord.findAll({
      where: whereClause,
      include: [
        { model: Patient, as: 'patient', include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name'] }] },
        { model: Doctor, as: 'doctor', include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name'] }] },
        { model: Prescription, as: 'prescription', include: [{ model: PrescriptionItem, as: 'items' }] },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single medical record by ID
 */
const getMedicalRecordById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const record = await MedicalRecord.findByPk(id, {
      include: [
        { model: Patient, as: 'patient', include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name', 'phone'] }] },
        { model: Doctor, as: 'doctor', include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name'] }] },
        { model: Prescription, as: 'prescription', include: [{ model: PrescriptionItem, as: 'items' }] },
      ],
    });

    if (!record) {
      return res.status(404).json({ success: false, message: 'Medical record not found.' });
    }

    res.json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all medical records for a specific patient
 */
const getRecordsByPatientId = async (req, res, next) => {
  try {
    const { patient_id } = req.params;
    const records = await MedicalRecord.findAll({
      where: { patient_id },
      include: [
        { model: Doctor, as: 'doctor', include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name'] }] },
        { model: Prescription, as: 'prescription', include: [{ model: PrescriptionItem, as: 'items' }] },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecordById,
  getRecordsByPatientId,
};
