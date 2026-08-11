const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, appointmentController.getAppointments);
router.post('/', authenticateToken, appointmentController.bookAppointment);
router.put('/:id', authenticateToken, appointmentController.updateAppointment);
router.delete('/:id', authenticateToken, appointmentController.cancelAppointment);

module.exports = router;
