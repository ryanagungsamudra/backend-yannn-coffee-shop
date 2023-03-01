const express = require('express');
const router = express();
// JWT, validation, formUpload
const verifyToken = require('../middlewares/verifyToken')
const validation = require('../middlewares/validation')
const formUpload = require('../middlewares/formUpload')

// import controller
const productController = require('../controllers/product.controller')

router.get('/', productController.read)
router.get('/:id', productController.readDetail)
router.post('/', verifyToken, formUpload.array('images'), validation.product, productController.create)
router.patch('/:id', verifyToken, formUpload.array('images'), productController.update)
router.delete('/:id', verifyToken, productController.remove)
// jangan pakai delete karna bisa bentrok dengan method delete built in

module.exports = router