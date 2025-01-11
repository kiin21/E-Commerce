const express = require('express');
const router = express.Router();
const { addAccount } = require('../controllers/account.controller');

router.post('/add', addAccount);

module.exports = router;