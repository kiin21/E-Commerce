const express = require('express');
const router = express.Router();
const productController = require('../../controllers/seller/product.controller');

router.get('/', productController.getAllProductsByStoreId);

router.delete('/remove/:productId', productController.deleteProduct);

router.post('/remove-multiple', productController.deleteMultipleProducts);

router.post('/add', productController.addProductToStore);

router.get('/detail/:productId', productController.getProductById);

module.exports = router;