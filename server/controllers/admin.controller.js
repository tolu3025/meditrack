const {
  User,
  Patient,
  Doctor,
  Pharmacist,
  Administrator,
  Appointment,
  Prescription,
  Medication,
  Invoice,
  Department,
  sequelize,
} = require('../models');
const { Op } = require('sequelize');

/**
 * Admin Dashboard Stats Summary
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    const totalPatients = await Patient.count();
    const totalDoctors = await Doctor.count();
    const appointmentsToday = await Appointment.count({
      where: { appointment_date: todayStr },
    });
    const pendingPrescriptions = await Prescription.count({
      where: { status: 'pending' },
    });
    const lowStockAlerts = await Medication.count({
      where: {
        stock_quantity: { [Op.lte]: sequelize.col('reorder_level') },
      },
    });

    const recentAppointments = await Appointment.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      include: [
        { model: Patient, as: 'patient', include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name'] }] },
        { model: Doctor, as: 'doctor', include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name'] }] },
      ],
    });

    res.json({
      success: true,
      data: {
        counts: {
          totalPatients,
          totalDoctors,
          appointmentsToday,
          pendingPrescriptions,
          lowStockAlerts,
        },
        recentAppointments,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Appointment analytics per day and per doctor
 */
const getAppointmentStats = async (req, res, next) => {
  try {
    const appointmentsByDay = await Appointment.findAll({
      attributes: [
        'appointment_date',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['appointment_date'],
      order: [['appointment_date', 'ASC']],
      limit: 30,
    });

    const appointmentsByDoctor = await Appointment.findAll({
      attributes: [
        'doctor_id',
        [sequelize.fn('COUNT', sequelize.col('Appointment.id')), 'count'],
      ],
      include: [
        {
          model: Doctor,
          as: 'doctor',
          include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name'] }],
        },
      ],
      group: ['doctor_id', 'doctor.id', 'doctor->user.id'],
    });

    const statusBreakdown = await Appointment.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['status'],
    });

    res.json({
      success: true,
      data: {
        byDay: appointmentsByDay,
        byDoctor: appointmentsByDoctor,
        statusBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Revenue analytics from paid invoices
 */
const getRevenueStats = async (req, res, next) => {
  try {
    const totalPaidRevenue = await Invoice.sum('total_amount', {
      where: { status: 'paid' },
    });

    const totalUnpaidBalance = await Invoice.sum('total_amount', {
      where: { status: 'unpaid' },
    });

    // Department revenue breakdown from consultation fees
    const departmentDistribution = await Department.findAll({
      attributes: [
        'id',
        'name',
        [sequelize.fn('COUNT', sequelize.col('doctors->appointments.id')), 'appointment_count'],
      ],
      include: [
        {
          model: Doctor,
          as: 'doctors',
          attributes: [],
          include: [{ model: Appointment, as: 'appointments', attributes: [] }],
        },
      ],
      group: ['Department.id'],
    });

    res.json({
      success: true,
      data: {
        totalPaidRevenue: (totalPaidRevenue || 0).toFixed(2),
        totalUnpaidBalance: (totalUnpaidBalance || 0).toFixed(2),
        departmentDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * User Management: list all users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password_hash'] },
      include: [{ model: Department, as: 'department' }],
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * User Management: activate/deactivate account
 */
const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.is_active = !user.is_active;
    await user.save();

    res.json({
      success: true,
      message: `User account has been ${user.is_active ? 'activated' : 'deactivated'}.`,
      data: { id: user.id, is_active: user.is_active },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * User Management: update user role
 */
const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (!['patient', 'doctor', 'pharmacist', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role.' });
    }

    user.role = role;
    await user.save();

    // Create associated profile if it doesn't exist
    if (role === 'patient') {
      const exists = await Patient.findOne({ where: { user_id: user.id } });
      if (!exists) {
        await Patient.create({ user_id: user.id });
      }
    } else if (role === 'doctor') {
      const exists = await Doctor.findOne({ where: { user_id: user.id } });
      if (!exists) {
        await Doctor.create({
          user_id: user.id,
          specialization: 'General Practitioner',
          license_number: `MDCN-${Date.now()}`,
          consultation_fee: 5000.00,
        });
      }
    } else if (role === 'pharmacist') {
      const exists = await Pharmacist.findOne({ where: { user_id: user.id } });
      if (!exists) {
        await Pharmacist.create({
          user_id: user.id,
          license_number: `PCN-${Date.now()}`,
          shift: 'Morning',
        });
      }
    } else if (role === 'admin') {
      const exists = await Administrator.findOne({ where: { user_id: user.id } });
      if (!exists) {
        await Administrator.create({
          user_id: user.id,
          admin_level: 'Admin',
        });
      }
    }

    res.json({
      success: true,
      message: `User role has been updated to ${role}.`,
      data: { id: user.id, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Department Management CRUD
 */
const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.findAll({ order: [['name', 'ASC']] });
    res.json({ success: true, data: departments });
  } catch (error) {
    next(error);
  }
};

const createDepartment = async (req, res, next) => {
  try {
    const { name, description, location } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Department name is required.' });

    const department = await Department.create({ name, description, location });
    res.status(201).json({ success: true, message: 'Department created.', data: department });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAppointmentStats,
  getRevenueStats,
  getAllUsers,
  toggleUserStatus,
  updateUserRole,
  getDepartments,
  createDepartment,
};
