const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const sequelize = require('../config/db');

const performPayment = async (req, res) => {
    const { fromAccountId, toAccountId, amount, buyer, order_id } = req.body;

    try {
        const fromAccount = await Account.findByPk(fromAccountId);
        const toAccount = await Account.findByPk(toAccountId);

        if (!fromAccount || !toAccount) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        await sequelize.transaction(async (t) => {
            // Convert amounts to numbers for calculations
            const fromBalance = parseFloat(fromAccount.balance);
            const toBalance = parseFloat(toAccount.balance);
            const paymentAmount = parseFloat(amount);

            // Actually deduct from user account
            fromAccount.balance = fromBalance - paymentAmount;
            toAccount.balance = toBalance + paymentAmount;

            // Save both account changes
            await fromAccount.save({ transaction: t });
            await toAccount.save({ transaction: t });

            // Record transaction
            await Transaction.create({
                from_account_id: fromAccountId,
                to_account_id: toAccountId,
                amount: paymentAmount,
                buyer: buyer,
                order_id: order_id
            }, { transaction: t });
        });

        res.status(200).json({ success: true, message: 'Payment successful' });
    } catch (error) {
        console.error('Error in performPayment:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { performPayment };