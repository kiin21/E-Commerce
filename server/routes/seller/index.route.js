const verifyJWT = require('../../middlewares/verifyJWT.middleware');

const sellerRoutes = (app) => {

    app.use(verifyJWT);

    // Routes for products
    app.use('/api/seller/products', require('./product.route'));
}

module.exports = sellerRoutes;