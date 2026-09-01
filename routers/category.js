const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category');

router.get('', categoryController.categories)
router.get('/:ids', categoryController.categoriesInfo)

module.exports = router;