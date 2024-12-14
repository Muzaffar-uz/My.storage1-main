const router = require("express").Router()

const product_controller = require('../controller/product_controller')


router.get('/all/:id', product_controller.getProduct);
router.post('/insert/:id',product_controller.postProduct);
router.put('/update/:id',product_controller.putProduct);
router.delete('/delete/:id',product_controller.delProduct);
router.post('/status/:id',product_controller.postStatus)
module.exports = router