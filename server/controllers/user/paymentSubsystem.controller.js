const jwt = require('jsonwebtoken');
const axios = require('axios');
const https = require('https');

const processPayment = async (req, res) => {
    try {
        const { fromAccountId, toAccountId, amount, buyer, order_id } = req.body;
        
        console.log('Payment Request Data:', { fromAccountId, toAccountId, amount, buyer, order_id });
        
        // Generate JWT token for payment server
        const token = jwt.sign(
            { system: 'main-server' }, 
            process.env.PAYMENT_JWT_SECRET,
            { expiresIn: '5m' }
        );

        // Create an HTTPS agent that accepts self-signed certificates
        const httpsAgent = new https.Agent({ rejectUnauthorized: false });

        // First, create account if not exists
        try {
            console.log('Creating account with userId:', fromAccountId);
            const createAccountResponse = await axios.post(
                `${process.env.PAYMENT_SERVER_URL}/api/accounts/add`,
                { userId: fromAccountId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    httpsAgent
                }
            );
            console.log('Account creation response:', createAccountResponse.data);
        } catch (error) {
            console.log('Account creation error:', error.message);
        }

        // Then perform payment
        console.log('Performing payment with data:', { fromAccountId, toAccountId, amount, buyer, order_id });
        const response = await axios.post(
            `${process.env.PAYMENT_SERVER_URL}/api/payments/perform`,
            { 
                fromAccountId,
                toAccountId, 
                amount,
                buyer,
                order_id
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                httpsAgent
            }
        );

        console.log('Payment response:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Payment error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { processPayment };