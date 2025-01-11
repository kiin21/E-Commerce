require('dotenv').config();
const express = require('express');
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
    app.listen(PORT, () => {
      console.log(`Payment server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to start server:', err);
    process.exit(1);
  });