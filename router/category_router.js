const router = require('express').Router()
const Category_counroller = require('../controller/category_controller')

router.get('/all',Category_counroller.getCategory)
router.post('/insert',Category_counroller.postCategory);
router.post('/update/:id',Category_counroller.putCategory);
router.delete('/delete/:id',Category_counroller.delCategory);



module.exports = router