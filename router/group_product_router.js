const router = require('express').Router()
const Gourp_product_conroller = require('../controller/group_product_controller')
router.get('/all/:id',Gourp_product_conroller.getGroup)
router.post('/insert/:id',Gourp_product_conroller.postGroup);
router.post('/update/:id',Gourp_product_conroller.putGroup);
router.delete('/delete/:id', Gourp_product_conroller.delGroup)
router.get('/all1',Gourp_product_conroller.getGroup1)



module.exports = router
