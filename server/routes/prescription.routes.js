const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescription.controller');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/rbac');

router.post('/', authenticateToken, authorizeRoles('doctor', 'admin'), prescriptionController.createPrescription);
router.get('/', authenticateToken, prescriptionController.getPrescriptions);
router.get('/:id', authenticateToken, prescriptionController.getPrescriptionById);
router.put('/:id/dispense', authenticateToken, authorizeRoles('pharmacist', 'admin'), prescriptionController.dispensePrescription);

module.exports = router;
