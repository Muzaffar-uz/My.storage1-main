const Category = require('../models/category_models')

exports.getCategory = async (req,res)=>{
    const category = await Category.query().select('*');
    return res.status(200).json({success: true, category:category})
}

exports.postCategory = async (req,res)=>{
     await Category.query().insert({
      name: req.body.name,  
    })
    return res.status(200).json({success:true, msg:"new categoriy insert"})
}

exports.putCategory = async (req,res)=>{
    // const d = new Date()
    await Category.query().where('id',req.params.id).update({
       name: req.body.name ,
    //    time: d,
    })
    return res.status(200).json({success:true,msg:'categoriy update'})
}

exports.delCategory = async (req,res)=>{
    await Category.query().where('id',req.params.id).delete()
    return res.status(200).json({success:true,msg:'delete categoriy'})
}
