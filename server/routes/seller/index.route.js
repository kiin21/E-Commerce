const verifyJWT = require('../../middlewares/verifyJWT.middleware');
const verifyRoles = require('../../middlewares/verifyRoles.middleware');
const ROLES_LIST = require('../../config/roles_list');

const sellerRoutes = (app) => {

    // Routes for products
    app.use('/api/seller/products', verifyJWT, verifyRoles(ROLES_LIST.Seller), require('./product.route'));

    // Routes for categories
    app.use('/api/seller/categories', verifyJWT, verifyRoles(ROLES_LIST.Seller), require('./category.route'));

    // Routes for store
    app.use('/api/seller/store', verifyJWT, verifyRoles(ROLES_LIST.Seller), require('./store.route'));

    // Routes for seller info
    app.use('/api/seller/info', verifyJWT, verifyRoles(ROLES_LIST.Seller), require('./info.route'));

    // Routes for seller
    app.use('/api/seller', verifyJWT, verifyRoles(ROLES_LIST.Seller), require('./seller.route'));

    // Routes for vouchers
    app.use('/api/seller/voucher', verifyJWT, verifyRoles(ROLES_LIST.Seller), require('./voucher.route'));

    // Routes for orders
    app.use('/api/seller/orders', verifyJWT, verifyRoles(ROLES_LIST.Seller), require('./order.route'));
}

module.exports = sellerRoutes;