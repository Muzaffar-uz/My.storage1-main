const router = require('express').Router()

const input_controller = require('../controller/input_controller')

router.get('/all/:id',input_controller.getInput)
router.post('/insert/:id',input_controller.postInput)

router.delete('/delete/:id',input_controller.delInput);
router.get('/product',input_controller.getProduct)
router.get('/excel/:id',input_controller.exportInputToExcel)

module.exports = router