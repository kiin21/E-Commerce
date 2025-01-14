const express = require('express');
const router = express.Router();
const catController = require('../../controllers/admin/manageCategory.controller');

// [GET] /api/admin/category
router.get('/', catController.getAllCategories);

// [GET] /api/admin/category/:id
router.get('/:id', catController.getOneCategory);

// [PUT] /api/admin/category/:id
router.put('/:id', (req, res, next) => { console.log('OKKKKKKKKKKKKKKK'); next(); }, catController.updateCategory);

// [PUT] /api/admin/category/:id/suspend
router.put('/:id/suspend', catController.suspendCategory);

// [PUT] /api/admin/category/:id/restore
router.put('/:id/restore', catController.restoreCategory);

// [POST] /api/admin/category/add
router.post('/add', catController.addCategory);

module.exports = router;