const authRoutes = (app) => {
    // Routes
    app.use('/api/auth/register', require('./register.route'));
    app.use('/api/auth/login', require('./login.route'));
    app.use('/api/auth/token/refresh', require('./refreshToken.route'));
    app.use('/api/auth/logout', require('./logout.route'));
    app.use('/api/auth/forget-password', require('./forgetPassword.route'));
    app.use('/api/auth/reset-password', require('./resetPassword.route'));
    // Google OAuth routes
    app.use('/api/auth/google', require('./google-auth.route'));
}

module.exports = authRoutes;