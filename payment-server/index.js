require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const sequelize = require('./config/db');
const authenticateJWT = require('./middlewares/authenticateJWT');

const app = express();
app.use(express.json());

// Use JWT middleware for all routes
app.use(authenticateJWT);

// Define routes
app.use('/api/accounts', require('./routes/account.route'));
app.use('/api/payments', require('./routes/payment.route'));
app.use('/api/reconciliation', require('./routes/reconciliation.route'));

const PORT = process.env.PORT;

sequelize.authenticate()
  .then(() => {
    // Read SSL certificate and key
    const sslOptions = {
      key: fs.readFileSync(process.env.SSL_KEY_PATH),
      cert: fs.readFileSync(process.env.SSL_CERT_PATH)
    };

    // Create HTTPS server
    https.createServer(sslOptions, app).listen(PORT, () => {
      console.log(`Payment server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to start server:', err);
    process.exit(1);
  });