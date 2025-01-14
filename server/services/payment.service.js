const axios = require('axios');
const jwt = require('jsonwebtoken');
const https = require('https');

const createPaymentAccount = async (userId) => {
    try {
        // Generate JWT token for payment server
        const token = jwt.sign(
            { system: 'main-server' },
            process.env.PAYMENT_JWT_SECRET,
            { expiresIn: '5m' }
        );

        // Create an HTTPS agent that accepts self-signed certificates
        const httpsAgent = new https.Agent({ rejectUnauthorized: false });

        // Create account in payment server
        await axios.post(
            `${process.env.PAYMENT_SERVER_URL}/api/accounts/add`,
            { userId },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                httpsAgent
            }
        );
        
        console.log('Payment account created successfully for user:', userId);
    } catch (error) {
        console.error('Failed to create payment account:', error);
        // Don't throw error - payment system will create account on first payment if needed
    }
};

module.exports = { createPaymentAccount };