const Account = require('../models/Account');
const INITIAL_BALANCE = 100000000000.00;  // 100 billion

const addAccount = async (req, res) => {
    const { userId } = req.body;

    try {
        let account = await Account.findByPk(userId);
        
        if (!account) {
            account = await Account.create({ 
                id: userId,
                balance: INITIAL_BALANCE
            });
        }
        
        res.status(201).json({ success: true, account });
    } catch (error) {
        console.error('Account creation error:', error);
        res.status(400).json({ 
            success: false, 
            message: "Cannot create account with invalid ID",
            error: error.message
        });
    }
};

module.exports = { addAccount };