const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/medication.controller');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/rbac');

router.get('/alerts', authenticateToken, authorizeRoles('pharmacist', 'admin'), medicationController.getLowStockAlerts);
router.get('/', authenticateToken, medicationController.getMedications);
router.post('/', authenticateToken, authorizeRoles('pharmacist', 'admin'), medicationController.createMedication);
router.put('/:id', authenticateToken, authorizeRoles('pharmacist', 'admin'), medicationController.updateMedication);
router.delete('/:id', authenticateToken, authorizeRoles('pharmacist', 'admin'), medicationController.deleteMedication);

module.exports = router;
