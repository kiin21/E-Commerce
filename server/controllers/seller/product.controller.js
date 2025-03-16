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

// Remove a product from a store
// [DELETE] /api/seller/products/remove/:productId
const deleteProduct = async (req, res) => {
    const productId = req.params.productId;

    try {
        const result = await Product.destroy({
            where: {
                id: productId,
            },
        });

        if (result === 0) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        res.status(200).json({ message: "Sản phẩm đã xóa thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa sản phẩm" });
    }
};

// Remove multiple products from a store
// [POST] /api/seller/products/remove-multiple
const deleteMultipleProducts = async (req, res) => {
    const { ids } = req.body;

    try {
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Không tìm thấy id hợp lệ" });
        }

        const result = await Product.destroy({
            where: {
                id: ids,
            },
        });

        if (result === 0) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm để xóa" });
        }

        res.status(200).json({ message: `${result} sản phẩm đã được xóa thành công` });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa nhiều sản phẩm" });
    }
};

// Add a product to the store of seller
// POST /api/seller/products/add
const addProductToStore = async (req, res) => {
    try {
        const productData = req.body;

        const seller = await Seller.findOne({
            where: {
                user_id: req.user.id
            }
        });

        if (!seller) {
            return res.status(400).json({ message: 'Không tìm thấy seller' });
        }

        if (!productData.current_seller) {
            productData.current_seller = {};
        }

        productData.current_seller.id = seller.id;
        productData.current_seller.store_id = seller.store_id;

        const newProduct = await Product.create(productData);

        // await addNotification(productData.current_seller.id, productData.name);

        res.status(201).json({
            message: 'Thêm sản phẩm thành công, chờ admin duyệt',
            product: newProduct
        });
    } catch (error) {
        res.status(500).json({
            message: 'Lỗi server khi thêm sản phẩm',
            error: error.message
        });
    }
};

const getProductById = async (req, res) => {
    const id = req.params.productId;

    if (!id) {
        return res.status(400).json({ message: 'Cần Product ID' });
    }

    try {
        const product = await Product.findByPk(id, {
            attributes: [
                'name',
                'category_id',
                'category_name',
                'images',
                'discount_rate',
                'original_price',
                'short_description',
                'description',
                'quantity_sold',
                'specifications',
                'rating_average',
                'price',
                'inventory_status',
                'qty',
            ]
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Xử lý dữ liệu hình ảnh
        const images = Array.isArray(product.images)
            ? product.images
            : JSON.parse(product.images || '[]');
        const thumbnails = images.map(image => image.thumbnail_url);

        const productDetail = {
            name: product.name,
            category_id: product.category_id,
            category_name: product.category_name,
            thumbnails,
            discount_rate: product.discount_rate,
            original_price: product.original_price,
            short_description: product.short_description,
            description: product.description,
            quantity_sold: product.quantity_sold,
            specifications: product.specifications,
            rating_average: product.rating_average,
            price: product.price,
            inventory_status: product.inventory_status,
            qty: product.qty,
        };

        res.status(200).json({ data: productDetail });
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const updateProduct = async (req, res) => {
    const productId = req.params.productId;
    const updateData = req.body;

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const updatedProduct = await product.update(updateData);

        res.status(200).json({
            message: 'Cập nhật sản phẩm thành công',
            product: updatedProduct,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Lỗi khi cập nhật sản phẩm',
            error: error.message,
        });
    }
};

// Get top 10 selling products
// GET /api/seller/products/:storeId/top-selling/
const getTopSellingProducts_v1 = async (req, res) => {
    try {
        const storeId = req.params.storeId;

        const products = await Product.findAll({
            where: { 'current_seller.store_id': storeId },
            order: [['quantity_sold', 'DESC']],
            limit: 10,
            attributes: [
                'id',
                'name',
                'images',
                'category_name',
                'price',
                'rating_average',
                'quantity_sold',
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
                quantity_sold: product.quantity_sold,
                thumbnails
            };
        });

        res.status(200).json({ data: formattedProducts });
    } catch (error) {
        console.error('Error fetching top 10 best-selling products:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get top selling products of a store
// GET /api/seller/product/top-selling/limit=55&page=1
let getTopSellingProducts_v2 = async (req, res) => {
    try {
        const id = req.user.id;

        const seller = await Seller.findOne({
            where: {
                user_id: id
            }
        });

        const storeId = seller.store_id;

        if (!storeId) {
            return res.status(400).json({ message: "Missing storeId parameter" });
        }

        const limit = parseInt(req.query.limit) || 20;  // Number of products per page 
        const page = parseInt(req.query.page) || 1;    // Default to page 1
        const offset = (page - 1) * limit;            // Calculate offset for pagination

        // Correct way to cast the JSON store_id to integer and compare
        const topSellingProducts = await Product.findAll({
            attributes: [
                'id',
                'name',
                'price',
                'rating_average',
                'quantity_sold',
                'images',
                [Sequelize.literal('price * quantity_sold'), 'earnings']
            ],
            where: Sequelize.where(
                Sequelize.cast(Sequelize.json('current_seller.store_id'), 'INTEGER'),
                storeId
            ),
            order: [['quantity_sold', 'DESC']],
            limit,
            offset
        });

        const totalItems = await Product.count({
            where: {
                'current_seller.store_id': storeId
            }
        });

        const formattedProducts = topSellingProducts.map(product => {
            const images = Array.isArray(product.images)
                ? product.images
                : JSON.parse(product.images || '[]');
            const thumbnails = images.map(image => image.thumbnail_url);
            return {
                id: product.id,
                name: product.name,
                price: product.price,
                rating: product.rating_average,
                quantity_sold: product.quantity_sold,
                thumbnails,
                earnings: product.dataValues.earnings
            };
        });

        res.status(200).json({
            message: "Top selling products fetched successfully",
            currentPage: page,
            pageSize: limit,
            totalItems: totalItems,
            products: formattedProducts
        });
    } catch (error) {
        console.error('Error fetching top selling products:', error);
        res.status(500).json({ message: "Error fetching top selling products" });
    }
};

module.exports = {
    getAllProductsByStoreId,
    deleteProduct,
    deleteMultipleProducts,
    addProductToStore,
    getProductById,
    updateProduct,
    getTopSellingProducts_v1,
    getTopSellingProducts_v2,
};