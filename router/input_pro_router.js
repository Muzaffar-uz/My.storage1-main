const router = require('express').Router()

const Input_pro_controller = require('../controller/input_pro_controller')


router.get('/all1',Input_pro_controller.getstatus1)
router.get('/all2',Input_pro_controller.getstatus2)
router.get('/all3',Input_pro_controller.getstatus3)

router.get('/getcustomer',Input_pro_controller.getCounterparty)


router.post('/insert',Input_pro_controller.postInput_pro)

// router.put('/update/:id',Input_pro_controller.putInput_pro)
router.delete('/delete/:id',Input_pro_controller.delInput_pro)

router.get('/time1',Input_pro_controller.getInput_proTime1)
router.get('/time2',Input_pro_controller.getInput_proTime2)
router.get('/time3',Input_pro_controller.getInput_proTime3)


router.get('/search1',Input_pro_controller.getInput_proSearch1)
router.get('/search2',Input_pro_controller.getInput_proSearch2)
router.get('/search3',Input_pro_controller.getInput_proSearch3)

module.exports = router