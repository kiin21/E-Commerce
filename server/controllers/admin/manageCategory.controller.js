const Category = require('../../models/Category');
const { Op } = require('sequelize');

// [GET] /api/admin/categories
const getAllCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const offset = (page - 1) * limit;

        const whereCondition = search ? {
            [Op.or]: [
                { name: { [Op.iLike]: `%${search}%` } },
                { url_path: { [Op.iLike]: `%${search}%` } }
            ]
        } : {};

        // Get total count for pagination
        const totalCount = await Category.count({
            where: whereCondition
        });

        // Get categories with pagination and search
        const categories = await Category.findAll({
            where: whereCondition,
            order: [['name', 'ASC']],
            limit: limit,
            offset: offset,
            attributes: ['id', 'name', 'thumbnail_url', 'parent_id', 'is_leaf', 'url_path']
        });

        res.status(200).json({
            data: categories,
            total: totalCount,
            page: page,
            limit: limit
        });

    } catch (error) {
        console.error('Error in getAllCategories:', error);
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
};

// [GET] /api/admin/categories/:id
const getOneCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByPk(id, {
            attributes: ['id', 'name', 'thumbnail_url', 'parent_id', 'is_leaf', 'url_path']
        });

        if (!category) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }

        res.status(200).json({
            data: category
        });

    } catch (error) {
        console.error('Error in getOneCategory:', error);
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
};

// [PUT] /api/admin/categories/:id/suspend
const suspendCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({
                message: 'Category not found',
            });
        }

        category.is_active = false;
        await category.save();

        return res.status(200).json({
            message: 'Category suspended successfully',
            data: category,
        });
    } catch (error) {
        console.error('Error in suspendCategory:', error);
        res.status(500).json({
            message: error.message,
            error: error,
        });
    }
};

// [PUT] /api/admin/categories/:id/restore
const restoreCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({
                message: 'Category not found',
            });
        }

        category.is_active = true;
        await category.save();

        return res.status(200).json({
            message: 'Category restored successfully',
            data: category,
        });
    } catch (error) {
        console.error('Error in restoreCategory:', error);
        res.status(500).json({
            message: error.message,
            error: error,
        });
    }
};

// [PUT] /api/admin/category/:id
const updateCategory = async (req, res) => {
    const { id } = req.params; // Get category ID from URL parameters
    const queryData = req.query; // Get category data from query parameters

    console.log('Updated Category Data:', queryData);

    try {
        // Update only the provided fields for the category
        const [updatedRowsCount] = await Category.update(queryData, {
            where: { id }, // Find the category by ID
        });

        if (updatedRowsCount > 0) {
            // If category updated successfully, return the updated category data
            const updatedCategory = await Category.findByPk(id); // Fetch the updated category from the DB
            res.status(200).json({
                message: 'Category updated successfully',
                updatedCategory, // Return the full updated category data
            });
        } else {
            // If no rows were affected, return a "Category not found" response
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Failed to update category', error: error.message });
    }
};



module.exports = {
    getAllCategories,
    getOneCategory,
    suspendCategory,
    restoreCategory,
    updateCategory,
};
