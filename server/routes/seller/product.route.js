const express = require('express');
const router = express.Router();
const productController = require('../../controllers/seller/product.controller');

router.get('/', productController.getAllProductsByStoreId);

module.exports = router;