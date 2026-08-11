const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const { authenticateToken } = require('../middleware/auth');

router.get('/', doctorController.getDoctors);
router.get('/:id', doctorController.getDoctorById);
router.get('/:id/appointments', authenticateToken, doctorController.getDoctorAppointments);

module.exports = router;
