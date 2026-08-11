const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/rbac');

router.get('/', authenticateToken, authorizeRoles('admin', 'doctor'), patientController.getAllPatients);
router.get('/:id', authenticateToken, patientController.getPatientById);
router.post('/', authenticateToken, authorizeRoles('admin'), patientController.createPatient);
router.put('/:id', authenticateToken, patientController.updatePatient);
router.get('/:id/history', authenticateToken, patientController.getPatientHistory);

module.exports = router;
