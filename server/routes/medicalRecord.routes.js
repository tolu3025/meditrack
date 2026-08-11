const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecord.controller');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/rbac');

router.post('/', authenticateToken, authorizeRoles('doctor', 'admin'), medicalRecordController.createMedicalRecord);
router.get('/', authenticateToken, medicalRecordController.getMedicalRecords);
router.get('/:id', authenticateToken, medicalRecordController.getMedicalRecordById);
router.get('/patient/:patient_id', authenticateToken, medicalRecordController.getRecordsByPatientId);

module.exports = router;
