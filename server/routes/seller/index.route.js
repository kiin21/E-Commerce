const verifyJWT = require('../../middlewares/verifyJWT.middleware');

const sellerRoutes = (app) => {

    app.use(verifyJWT);

    // Routes for products
    app.use('/api/seller/products', require('./product.route'));

    // Routes for categories
    app.use('/api/seller/categories', require('./category.route'));
}

module.exports = sellerRoutes;