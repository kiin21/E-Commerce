const express = require('express');
const router = express.Router();
const productController = require('../../controllers/seller/product.controller');

router.get('/', productController.getAllProductsByStoreId);

router.delete('/remove/:productId', productController.deleteProduct);

router.post('/remove-multiple', productController.deleteMultipleProducts);

router.post('/add', productController.addProductToStore);

router.get('/detail/:productId', productController.getProductById);

router.patch('/update/:productId', productController.updateProduct);

router.get('/:storeId/top-selling', productController.getTopSellingProducts_v1);

router.get('/top-selling', productController.getTopSellingProducts_v2);

module.exports = router;