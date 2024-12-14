const router = require('express').Router()

const ordes_controller = require('../controller/orders_controller')
const input_pro = require('../controller/input_pro_controller')
router.get('/all',ordes_controller.getOrder)
router.get('/counterparty',input_pro.getCounterparty)
router.get('/time',ordes_controller.getOrdersTime)
router.get('/search',ordes_controller.getOrdersSearch)
router.post('/insert',ordes_controller.postOrders)
router.put('/update/:id',ordes_controller.putOrders)
router.delete('/delete/:id',ordes_controller.delOrders)
module.exports = router