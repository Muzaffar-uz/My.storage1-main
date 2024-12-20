const Group = require('../models/group_product_models')

exports.getGroup = async (req,res)=>{
    const group = await Group.query()
    .select('group_product.id',
    'group_product.name',
    'category.name AS category_name',
    'category_id',
    'group_product.created')
    .leftJoin('category','group_product.category_id','category.id').where('category_id',req.params.id)
    return res.status(200).json({success: true, group:group})
}
exports.getGroup1 = async (req, res) => {
    const group = await Group.query().select('*');
    return res.status(200).json({ success: true, group: group });
};
exports.postGroup = async (req,res)=>{
    
     await Group.query().insert({
      name: req.body.name,
      category_id: req.params.id,
       
    })
    
    return res.status(200).json({success:true, msg:"new Group_product insert"})
}

exports.putGroup = async (req,res)=>{
    // const d = new Date()
    await Group.query().where('id',req.params.id).update({
        name: req.body.name,
      category_id: req.body.category_id,
      
    //    time: d,
    })
    return res.status(200).json({success:true,msg:'Group_product update'})
}

exports.delGroup = async (req, res) => {
    try {
        await Group.query().where('id', req.params.id).delete();
        return res.status(200).json({ success: true, msg: 'delete Group_product' });
    } catch (e) {
        return res.status(404).json({ success: false, msg: e.message });
    }
};
