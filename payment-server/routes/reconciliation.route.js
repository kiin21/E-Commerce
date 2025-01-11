const express = require('express');
const router = express.Router();
const { reconcileTransactions } = require('../controllers/reconciliation.controller');

router.get('/reconcile', reconcileTransactions);

module.exports = router;