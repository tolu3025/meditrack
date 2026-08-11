const {
  sequelize,
  Prescription,
  PrescriptionItem,
  Medication,
  Patient,
  Doctor,
  User,
  Invoice,
  InvoiceItem,
} = require('../models');

/**
 * Create a new prescription (Doctor creates)
 */
const createPrescription = async (req, res, next) => {
  try {
    const { patient_id, medical_record_id, items } = req.body;

    if (!patient_id || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID and at least one prescription item are required.',
      });
    }

    let doctor_id = req.body.doctor_id;
    if (!doctor_id) {
      const doctor = await Doctor.findOne({ where: { user_id: req.user.id } });
      if (!doctor) {
        return res.status(403).json({ success: false, message: 'Only registered doctors can issue prescriptions.' });
      }
      doctor_id = doctor.id;
    }

    const prescription = await Prescription.create({
      medical_record_id: medical_record_id || null,
      doctor_id,
      patient_id,
      status: 'pending', // Auto-routes to pharmacy queue
    });

    const prescriptionItems = items.map((item) => ({
      prescription_id: prescription.id,
      medication_id: item.medication_id || null,
      medication_name: item.medication_name || item.name,
      dosage: item.dosage,
      frequency: item.frequency,
      duration: item.duration,
      quantity: item.quantity || 1,
      instructions: item.instructions || '',
    }));

    await PrescriptionItem.bulkCreate(prescriptionItems);

    const fullPrescription = await Prescription.findByPk(prescription.id, {
      include: [
        { model: PrescriptionItem, as: 'items' },
        { model: Patient, as: 'patient', include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name'] }] },
        { model: Doctor, as: 'doctor', include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name'] }] },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Prescription created and auto-routed to pharmacy pending queue.',
      data: fullPrescription,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get prescriptions list (role-filtered or status-filtered for queue)
 */
const getPrescriptions = async (req, res, next) => {
  try {
    const { role, id } = req.user;
    const { status, patient_id } = req.query;
    let whereClause = {};

    if (status) whereClause.status = status;
    if (patient_id) whereClause.patient_id = patient_id;

    if (role === 'patient') {
      const patient = await Patient.findOne({ where: { user_id: id } });
      if (!patient) return res.json({ success: true, data: [] });
      whereClause.patient_id = patient.id;
    } else if (role === 'doctor') {
      const doctor = await Doctor.findOne({ where: { user_id: id } });
      if (doctor) whereClause.doctor_id = doctor.id;
    }

    const prescriptions = await Prescription.findAll({
      where: whereClause,
      include: [
        { model: PrescriptionItem, as: 'items' },
        { model: Patient, as: 'patient', include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name', 'phone'] }] },
        { model: Doctor, as: 'doctor', include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name'] }] },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: prescriptions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single prescription details by ID
 */
const getPrescriptionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prescription = await Prescription.findByPk(id, {
      include: [
        { model: PrescriptionItem, as: 'items', include: [{ model: Medication, as: 'medication' }] },
        { model: Patient, as: 'patient', include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name', 'phone'] }] },
        { model: Doctor, as: 'doctor', include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name'] }] },
      ],
    });

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found.' });
    }

    res.json({
      success: true,
      data: prescription,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Dispense prescription (Pharmacist)
 * Auto-deducts medication stock and adds medication costs to patient's active invoice.
 */
const dispensePrescription = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const prescription = await Prescription.findByPk(id, {
      include: [{ model: PrescriptionItem, as: 'items' }],
      transaction: t,
    });

    if (!prescription) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Prescription not found.' });
    }

    if (prescription.status === 'dispensed') {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Prescription has already been dispensed.' });
    }

    let totalMedicationCost = 0;
    const lowStockAlerts = [];
    const invoiceItemDescriptions = [];

    // Deduct stock for each prescription item
    for (const item of prescription.items) {
      let medication = null;
      if (item.medication_id) {
        medication = await Medication.findByPk(item.medication_id, { transaction: t });
      } else {
        medication = await Medication.findOne({
          where: { name: item.medication_name },
          transaction: t,
        });
      }

      if (medication) {
        const qtyToDeduct = item.quantity || 1;
        const newStock = Math.max(0, medication.stock_quantity - qtyToDeduct);
        medication.stock_quantity = newStock;
        await medication.save({ transaction: t });

        const itemCost = parseFloat(medication.unit_price) * qtyToDeduct;
        totalMedicationCost += itemCost;
        invoiceItemDescriptions.push(`${medication.name} (x${qtyToDeduct})`);

        if (newStock <= medication.reorder_level) {
          console.warn(`⚠️ LOW STOCK WARNING: Medication '${medication.name}' stock is now ${newStock} (reorder level: ${medication.reorder_level})`);
          lowStockAlerts.push({
            id: medication.id,
            name: medication.name,
            current_stock: newStock,
            reorder_level: medication.reorder_level,
          });
        }
      } else {
        // Fallback default cost if medication not found in inventory table
        totalMedicationCost += 1500.00 * (item.quantity || 1);
        invoiceItemDescriptions.push(`${item.medication_name} (x${item.quantity || 1})`);
      }
    }

    prescription.status = 'dispensed';
    await prescription.save({ transaction: t });

    // AUTOMATED BILLING ACCUMULATION: Add medication costs to invoice
    let invoice = await Invoice.findOne({
      where: { patient_id: prescription.patient_id, status: 'unpaid' },
      transaction: t,
    });

    if (!invoice) {
      invoice = await Invoice.create({
        patient_id: prescription.patient_id,
        prescription_id: prescription.id,
        total_amount: totalMedicationCost,
        status: 'unpaid',
      }, { transaction: t });
    } else {
      invoice.total_amount = parseFloat(invoice.total_amount) + totalMedicationCost;
      if (!invoice.prescription_id) invoice.prescription_id = prescription.id;
      await invoice.save({ transaction: t });
    }

    await InvoiceItem.create({
      invoice_id: invoice.id,
      description: `Dispensed Medication: ${invoiceItemDescriptions.join(', ')}`,
      amount: totalMedicationCost,
      item_type: 'medication',
    }, { transaction: t });

    await t.commit();

    res.json({
      success: true,
      message: 'Prescription marked as dispensed. Medication stock auto-deducted and charges added to patient invoice.',
      data: {
        prescription_id: prescription.id,
        status: 'dispensed',
        total_medication_cost: totalMedicationCost,
        lowStockAlerts,
      },
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

module.exports = {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  dispensePrescription,
};
