const router = require('express').Router()

const Report = require('../controller/report')

router.get('/praductall',Report.productall)


module.exports = router