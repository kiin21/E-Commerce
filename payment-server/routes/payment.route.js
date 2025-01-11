const express = require('express');
const router = express.Router();
const { performPayment } = require('../controllers/payment.controller');

router.post('/perform', performPayment);

module.exports = router;