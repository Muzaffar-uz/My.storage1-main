const Currency = require('../models/currency_models')

exports.getCurrency = async (req,res)=>{
    const currency = await Currency.query().select('*')
    return res.status(200).json({success: true, currency:currency})
}

exports.postCurrency = async (req,res)=>{
    await Currency.query().insert({
     name: req.body.name,
     exchange_rate: req.body.exchange_rate,  
   })
   return res.status(200).json({success:true, msg:"new currency insert"})
}

exports.putCurrency = async (req,res)=>{
   // const d = new Date()
   await Currency.query().where('id',req.params.id).update({
    name: req.body.name, 
    exchange_rate: req.body.exchange_rate,
      // time: d,
   })
   return res.status(200).json({success:true,msg:'currency update'})
}

exports.delCurrency = async (req,res)=>{
   await Currency.query().where('id',req.params.id).delete()
   return res.status(200).json({success:true,msg:'delete currency'})
}
