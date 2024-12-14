const router = require('express').Router();
const Counterparty_counroller = require('../controller/counterparty_controoler');

// router.get('/all2', Counterparty_counroller.getCustomer);
// router.get('/all1', Counterparty_counroller.getProvider);
router.get('/all', Counterparty_counroller.getCounterparty);
router.post('/insert', Counterparty_counroller.postCounterparty);
router.put('/update/:id', Counterparty_counroller.putCounterparty);
router.delete('/delete/:id', Counterparty_counroller.delCounterparty);
router.post('/status/:id', Counterparty_counroller.putstatus);
module.exports = router;

