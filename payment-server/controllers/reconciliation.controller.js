const Transaction = require('../models/Transaction');

const reconcileTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll();
        res.status(200).json({ success: true, transactions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { reconcileTransactions };