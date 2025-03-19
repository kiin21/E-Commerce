require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();
const sequelize = require('./config/db');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middlewares/logEvents.middleware');
const errorHandler = require('./middlewares/errorHandler.middleware');
const cookieParser = require('cookie-parser');
const credentials = require('./middlewares/credentials.middleware');
const passport = require('passport');
require('./services/passport-setup.service');
const session = require('express-session'); // Middleware for session handling
const PORT = process.env.PORT || 5000;
require('./models/associations'); // Import associations


// custom middleware logger
app.use(logger);

// Custom middleware to set Access-Control-Allow-Credentials header  
app.use(credentials);

// Enable Cross-Origin Resource Sharing with specified options
app.use(cors(corsOptions));

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded data with querystring library
app.use(express.urlencoded({ extended: false }));

// Parse Cookie header and populate req.cookies
app.use(cookieParser());

// Express session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',  // Only use secure cookies in production
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize Passport after session middleware
app.use(passport.initialize());
app.use(passport.session());

// Sync all models with the database before starting the server and initializing Passport
sequelize.sync({ force: false })
    .then(() => {
        console.log('All models were synchronized successfully.');

        // Auth routes
        require('./routes/auth/index.router')(app);

        // User routes
        require('./routes/user/index.route')(app);

        // Admin routes
        require('./routes/admin/index.route')(app);

        // Seller routes
        require('./routes/seller/index.route')(app);
        
        app.all('*', (req, res) => {
            res.status(404).json({ message: 'Resource not found' });
        });

        // Error handler middleware
        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.log('Failed to sync models:', err);
    }
);