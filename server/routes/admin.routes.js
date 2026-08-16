const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/rbac');

router.use(authenticateToken, authorizeRoles('admin'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/appointments/stats', adminController.getAppointmentStats);
router.get('/revenue', adminController.getRevenueStats);
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/status', adminController.toggleUserStatus);
router.put('/users/:id/role', adminController.updateUserRole);
router.get('/departments', adminController.getDepartments);
router.post('/departments', adminController.createDepartment);

module.exports = router;
