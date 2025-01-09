const Product = require('../../models/Product');
const Seller = require('../../models/Seller');
const Sequelize = require('sequelize');
const { Op } = Sequelize;


// Get all products by store ID
// [GET] /api/seller/products/
const getAllProductsByStoreId = async (req, res) => {
    const seller_id = req.user.id;

    const seller = await Seller.findOne({
        where: { user_id: seller_id },
        attributes: ['store_id']
    });

    const storeId = seller?.store_id;

    if (!storeId) {
        return res.status(400).json({ message: 'storeId is required' });
    }

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const status = req.query.status || '';
        const sortField = req.query.sortField || 'id'; // Default sort field
        const sortOrder = req.query.sortOrder === 'DESC' ? 'DESC' : 'ASC'; // Default sort order

        const offset = (page - 1) * limit;

        const whereCondition = {
            'current_seller.store_id': storeId,
            ...(search && {
                name: {
                    [Op.iLike]: `${search}%`,
                },
            }),
            ...(status && { inventory_status: status })
        };

        // Adjust sortField for database query
        const dbSortField = sortField === 'category'
            ? 'category_name'
            : sortField === 'rating'
            ? 'rating_average'
            : sortField;

        const totalCount = await Product.count({ where: whereCondition });

        const products = await Product.findAll({
            where: whereCondition,
            order: [[dbSortField, sortOrder]], // Sort dynamically
            limit: limit,
            offset: offset,
            attributes: [
                'id',
                'name',
                'images',
                'category_name',
                'price',
                'rating_average',
                'qty',
                'inventory_status'
            ]
        });

        const formattedProducts = products.map(product => {
            const images = Array.isArray(product.images)
                ? product.images
                : JSON.parse(product.images || '[]');
            const thumbnails = images.map(image => image.thumbnail_url);
            return {
                id: product.id,
                name: product.name,
                category: product.category_name,
                price: product.price,
                rating: product.rating_average,
                qty: product.qty,
                thumbnails,
                inventory_status: product.inventory_status
            };
        });

        return res.status(200).json({
            data: formattedProducts,
            total: totalCount,
            page: page,
            limit: limit
        });
    } catch (error) {
        console.error('Error in getAllProductsByStoreId:', error);
        return res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    getAllProductsByStoreId
};