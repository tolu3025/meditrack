const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billing.controller');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/rbac');

router.get('/patient/:patient_id', authenticateToken, billingController.getPatientInvoices);
router.post('/invoice', authenticateToken, authorizeRoles('admin', 'doctor'), billingController.createInvoice);
router.get('/invoices', authenticateToken, authorizeRoles('admin', 'doctor', 'pharmacist'), billingController.getAllInvoices);
router.put('/invoices/:id/pay', authenticateToken, billingController.payInvoice);

module.exports = router;
