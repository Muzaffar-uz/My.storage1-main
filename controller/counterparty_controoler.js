const Counterparty = require('../models/counterparty_models');


exports.getCounterparty = async (req, res) => {
    const counterparty = await Counterparty.query().select('*');
    return res.status(200).json({ success: true, counterparty: counterparty });
};



exports.postCounterparty = async (req, res) => {
    try {
        
        // mijoni bor yo'qligini tekshirish
       
        const status = 1;
        await Counterparty.query().insert({
            name: req.body.name,
            first_name: req.body.first_name,
            address: req.body.address,
            regions: req.body.regions,
            phone: req.body.phone,
            inn: req.body.inn,
            stir: req.body.stir,
            mfo: req.body.mfo,
            note: req.body.note,
            email: req.body.email,
            who: req.body.who,
            status: status,
        });
        return res
            .status(200)
            .json({ success: true, msg: "yangi Klent qo'shildi" });
    } catch (e) {
        return res.status(500).json({ success: false, error: e });
    }
};
exports.putCounterparty = async (req,res)=>{
   try{ 
 await Counterparty.query().where('id',req.params.id).update({
    name: req.body.name,
    first_name: req.body.first_name,
    address: req.body.address,
    regions: req.body.regions,
    phone: req.body.phone,
    email: req.body.email,
    inn: req.body.inn,
    stir: req.body.stir,
    mfo: req.body.mfo,
    note: req.body.note,
    who: req.body.who, 
    status:req.body.status
 })
 return res.status(200).json({success:true, msg:" Klent o'zgartirildi"})
}catch(e){
    return res.status(500).json({success:false, msg: "Server error" ,error: e.msg})
}
}
exports.putstatus = async (req, res) => {
    try {
        await Counterparty.query().where('id',req.params.id).update({ status: req.body.status });
        return res.status(200).json({ success: true, msg: 'updated' });
    } catch (e) {
        return res.status(500).json({ success: false, msg: e });
    }
};

exports.putCounterparty = async (req, res) => {
    try {
        await Counterparty.query().where('id', req.params.id).update({
            name: req.body.name,
            first_name: req.body.first_name,
            address: req.body.address,
            regions: req.body.regions,
            phone: req.body.phone,
            email: req.body.email,
            inn: req.body.inn,
            stir: req.body.stir,
            mfo: req.body.mfo,
            note: req.body.note,
            who: req.body.who,
            status: req.body.status,
        });
        return res
            .status(200)
            .json({ success: true, msg: " Klent o'zgartirildi" });
    } catch (e) {
        return res
            .status(500)
            .json({ success: false, msg: 'Server error', error: e });
    }
};

exports.delCounterparty = async (req, res) => {
    try {
        await Counterparty.query().where('id', req.params.id).delete();

        return res.status(200).json({ success: true, msg: " Klent o'chirldi" });
    } catch (err) {
        return res
            .status(500)
            .json({ success: false, msg: 'Server error', error: err});
    }
};
