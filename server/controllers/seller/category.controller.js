const Category = require('../../models/Category');
const Sequelize = require('sequelize');
const { Op } = Sequelize;

const getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const { count, rows } = await Category.findAndCountAll({
      attributes: ['id', 'name'],
      where: {
        name: {
          [Op.iLike]: `${search}%`,
        },
      },
      limit,
      offset,
    });

    res.status(200).json({
      data: rows,
      total: count,
      page,
      limit,
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi fetch categories' });
  }
};

module.exports = {
  getAllCategories,
};
