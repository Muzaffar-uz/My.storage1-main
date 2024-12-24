const router = require('express').Router()

const Cashbox_controller = require('../controller/cashbox')

router.get('/all',Cashbox_controller.getCashbox)


module.exports = router