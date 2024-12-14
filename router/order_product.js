const router  = require('express').Router()

const Order_product = require('../controller/order_product_contoller')

router.get('/all/:id',Order_product.getOrderproduct)
router.get('/product',Order_product.getProduct)
router.post('/insert/:id',Order_product.postOrder_product)


module.exports = router