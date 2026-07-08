const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const adminController = require('../controllers/adminController');

router.post('/', inquiryController.createInquiry);
router.get('/', adminController.verifyToken, inquiryController.getInquiries);
router.put('/:id', adminController.verifyToken, inquiryController.updateInquiryStatus);
router.delete('/:id', adminController.verifyToken, inquiryController.deleteInquiry);

module.exports = router;
