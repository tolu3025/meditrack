const { Doctor, User, Department, Appointment, Patient } = require('../models');

/**
 * Get public list of doctors with department and availability
 */
const getDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['first_name', 'last_name', 'email', 'phone', 'is_active'],
        },
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'location'],
        },
      ],
    });

    res.json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get doctor profile by ID
 */
const getDoctorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password_hash'] },
        },
        {
          model: Department,
          as: 'department',
        },
      ],
    });

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    res.json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get appointments for doctor
 */
const getDoctorAppointments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, status } = req.query;

    const whereClause = { doctor_id: id };
    if (date) whereClause.appointment_date = date;
    if (status) whereClause.status = status;

    const appointments = await Appointment.findAll({
      where: whereClause,
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name', 'phone', 'email'] }],
        },
      ],
      order: [['appointment_date', 'ASC'], ['start_time', 'ASC']],
    });

    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  getDoctorAppointments,
};
