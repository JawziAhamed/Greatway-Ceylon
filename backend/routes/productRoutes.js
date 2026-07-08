const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const adminController = require('../controllers/adminController');

const verifyWhenIncludingUnavailable = (req, res, next) => {
    if (req.query.includeUnavailable === 'true') {
        return adminController.verifyToken(req, res, next);
    }

    return next();
};

router.get('/', verifyWhenIncludingUnavailable, productController.getProducts);
router.get('/:identifier', verifyWhenIncludingUnavailable, productController.getProduct);
router.post('/', adminController.verifyToken, productController.createProduct);
router.put('/:id', adminController.verifyToken, productController.updateProduct);
router.delete('/:id', adminController.verifyToken, productController.deleteProduct);

module.exports = router;
