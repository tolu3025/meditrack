const { sequelize, Appointment, Doctor, Patient, User, Department, Invoice, InvoiceItem } = require('../models');

/**
 * Get appointments filtered by user role
 */
const getAppointments = async (req, res, next) => {
  try {
    const { role, id } = req.user;
    let whereClause = {};

    if (role === 'patient') {
      const patient = await Patient.findOne({ where: { user_id: id } });
      if (!patient) return res.json({ success: true, data: [] });
      whereClause.patient_id = patient.id;
    } else if (role === 'doctor') {
      const doctor = await Doctor.findOne({ where: { user_id: id } });
      if (!doctor) return res.json({ success: true, data: [] });
      whereClause.doctor_id = doctor.id;
    }

    const { status, date } = req.query;
    if (status) whereClause.status = status;
    if (date) whereClause.appointment_date = date;

    const appointments = await Appointment.findAll({
      where: whereClause,
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name', 'phone', 'email'] }],
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [
            { model: User, as: 'user', attributes: ['first_name', 'last_name', 'phone', 'email'] },
            { model: Department, as: 'department', attributes: ['name'] },
          ],
        },
      ],
      order: [['appointment_date', 'DESC'], ['start_time', 'ASC']],
    });

    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Book an appointment with TRANSACTIONAL CONFLICT DETECTION
 * Ensures concurrency safety under peak loads.
 */
const bookAppointment = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { doctor_id, appointment_date, start_time, end_time, reason, notes } = req.body;
    let { patient_id } = req.body;

    const rollbackSafely = async () => {
      if (t && !t.finished) {
        try { await t.rollback(); } catch (e) { /* ignore finished rollback */ }
      }
    };

    if (!doctor_id || !appointment_date || !start_time) {
      await rollbackSafely();
      return res.status(400).json({
        success: false,
        message: 'Doctor, appointment date, and start time are required.',
      });
    }

    // Determine patient ID if patient is making request
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ where: { user_id: req.user.id } });
      if (!patient) {
        await rollbackSafely();
        return res.status(404).json({ success: false, message: 'Patient profile not found.' });
      }
      patient_id = patient.id;
    }

    if (!patient_id) {
      await rollbackSafely();
      return res.status(400).json({ success: false, message: 'Patient ID is required.' });
    }

    // Calculate default end time if not provided (+30 mins)
    const calculatedEndTime = end_time || (() => {
      const [h, m] = start_time.split(':').map(Number);
      const totalMins = h * 60 + m + 30;
      const endH = Math.floor(totalMins / 60);
      const endM = totalMins % 60;
      return `${endH < 10 ? '0' + endH : endH}:${endM < 10 ? '0' + endM : endM}`;
    })();

    // CRITICAL CONFLICT DETECTION QUERY inside transaction
    const existingAppointment = await Appointment.findOne({
      where: {
        doctor_id,
        appointment_date,
        start_time,
        status: ['scheduled', 'completed'],
      },
      transaction: t,
    });

    if (existingAppointment) {
      await rollbackSafely();
      return res.status(409).json({
        success: false,
        message: 'Time slot unavailable. Doctor already has an appointment at this time.',
      });
    }

    // Confirm doctor exists
    const doctor = await Doctor.findByPk(doctor_id);
    if (!doctor) {
      await rollbackSafely();
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    const appointment = await Appointment.create({
      patient_id,
      doctor_id,
      appointment_date,
      start_time,
      end_time: calculatedEndTime,
      status: 'scheduled',
      reason,
      notes,
    }, { transaction: t });

    await t.commit();

    // Fetch newly created appointment with associations
    const fullAppointment = await Appointment.findByPk(appointment.id, {
      include: [
        { model: Doctor, as: 'doctor', include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name'] }] },
        { model: Patient, as: 'patient', include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name'] }] },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully.',
      data: fullAppointment,
    });
  } catch (error) {
    if (t && !t.finished) {
      try { await t.rollback(); } catch (e) {}
    }

    if (error.name === 'SequelizeUniqueConstraintError' || error.message.includes('SQLITE_BUSY') || error.message.includes('locked')) {
      return res.status(409).json({
        success: false,
        message: 'Time slot unavailable. Doctor already has an appointment at this time.',
      });
    }

    next(error);
  }
};

/**
 * Update appointment status / reschedule / cancel
 */
const updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, appointment_date, start_time, end_time, reason, notes } = req.body;

    const appointment = await Appointment.findByPk(id, {
      include: [
        { model: Doctor, as: 'doctor' },
        { model: Patient, as: 'patient' },
      ],
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    // If rescheduling, check conflict
    if ((appointment_date && appointment_date !== appointment.appointment_date) ||
        (start_time && start_time !== appointment.start_time)) {
      const targetDate = appointment_date || appointment.appointment_date;
      const targetTime = start_time || appointment.start_time;

      const conflict = await Appointment.findOne({
        where: {
          doctor_id: appointment.doctor_id,
          appointment_date: targetDate,
          start_time: targetTime,
          status: ['scheduled', 'completed'],
        },
      });

      if (conflict && conflict.id !== appointment.id) {
        return res.status(409).json({
          success: false,
          message: 'Reschedule failed: Time slot unavailable. Doctor already has an appointment at this time.',
        });
      }
    }

    const previousStatus = appointment.status;

    if (status) appointment.status = status;
    if (appointment_date) appointment.appointment_date = appointment_date;
    if (start_time) appointment.start_time = start_time;
    if (end_time) appointment.end_time = end_time;
    if (reason) appointment.reason = reason;
    if (notes !== undefined) appointment.notes = notes;

    await appointment.save();

    // AUTOMATED BILLING ACCUMULATION: When an appointment is completed, add consultation fee
    if (status === 'completed' && previousStatus !== 'completed') {
      const consultationFee = parseFloat(appointment.doctor?.consultation_fee || 5000.00);

      // Check if invoice already exists for this appointment
      let invoice = await Invoice.findOne({ where: { appointment_id: appointment.id } });
      if (!invoice) {
        invoice = await Invoice.create({
          patient_id: appointment.patient_id,
          appointment_id: appointment.id,
          total_amount: consultationFee,
          status: 'unpaid',
        });

        await InvoiceItem.create({
          invoice_id: invoice.id,
          description: `Consultation Fee - Dr. ${appointment.doctor?.specialization || 'Doctor'}`,
          amount: consultationFee,
          item_type: 'consultation',
        });
      }
    }

    res.json({
      success: true,
      message: `Appointment ${status || 'updated'} successfully.`,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel appointment
 */
const cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment cancelled successfully.',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAppointments,
  bookAppointment,
  updateAppointment,
  cancelAppointment,
};
