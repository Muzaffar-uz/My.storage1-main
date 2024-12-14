const router = require('express').Router()

const currency_controller = require('../controller/currency_controller')

router.get('/all',currency_controller.getCurrency)
router.post('/insert',currency_controller.postCurrency)
router.put('/updated/:id',currency_controller.putCurrency)
router.delete('/deleted/:id',currency_controller.delCurrency)

module.exports = router