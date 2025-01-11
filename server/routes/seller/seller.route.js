const express = require('express');
const router = express.Router();
const sellerController = require('../../controllers/seller/seller.controller');

router.get('/revenue/total', sellerController.getTotalRevenue);

router.get('/products/total', sellerController.getTotalProducts);

router.get('/followers/total', sellerController.getTotalFollowers);

router.get('/reviews/total', sellerController.getTotalReviews);

module.exports = router;