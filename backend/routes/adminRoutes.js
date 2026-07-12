const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/login', adminController.login);
router.get('/profile', adminController.verifyToken, adminController.getProfile);
router.put('/profile', adminController.verifyToken, adminController.updateProfile);

module.exports = router;
