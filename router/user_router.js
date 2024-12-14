const router = require('express').Router()
const Usercontroller = require('../controller/user_controller')
const {protect,role} = require('../middleware/auth-middleware')

;
router.get('/all',Usercontroller.getUser)
router.post('/insert',Usercontroller.postUser);
router.put('/updated/:id',Usercontroller.updetUser)
router.delete('/delete/:id',Usercontroller.delteUser)
router.post('/auth',Usercontroller.auth)
router.post('/res',protect,role("Admin"),Usercontroller.repassword)


module.exports = router;