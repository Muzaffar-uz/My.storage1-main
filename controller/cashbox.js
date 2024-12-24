const Cashbox = require('../models/cashbox_models')
const { insert } = require('../setting/db')


exports.getCashbox = async (req,res) => {
const cashbox = await Cashbox.query().select('*').first()
return res.status(200).json({success:true, cashbox: cashbox})
}


exports.postCashbox = async (req,res) =>{

const {  counterparty_id, balance, currency_id, status, note}= req.boy
const allowedTypes = ['cash', 'card', 'bank transfer'];

// Agar `payment_type` ruxsat etilganlardan biri bo‘lmasa
if (!allowedTypes.includes(payment_type)) {
    return res.status(400).json({
        success: false,
        message: `Invalid payment type. Allowed types are: ${allowedTypes.join(', ')}.`,
    });
}

    await Cashbox.query().insert({
        counterparty_id: counterparty_id,
        balance: balance,
        currency_id: currency_id,
        status: status,
        note : payment_type
    })
}

