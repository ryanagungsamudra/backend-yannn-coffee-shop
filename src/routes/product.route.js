const express = require('express');
const router = express();
// JWT, validation, formUpload
const verifyToken = require('../middlewares/verifyToken')
const validation = require('../middlewares/validation')
// const formUpload = require('../middlewares/formUpload')
const formUploadOnline = require('../middlewares/formUploadOnline');

// import controller
const productController = require('../controllers/product.controller');

router.get('/', productController.read)
router.get('/:id', productController.readDetail)
router.post('/', verifyToken, formUploadOnline.array('images'), validation.product, productController.create)
router.patch('/:id', verifyToken, formUploadOnline.array('images'), productController.update)
router.delete('/:id', verifyToken, productController.remove)
// jangan pakai delete karna bisa bentrok dengan method delete built in

module.exports = router