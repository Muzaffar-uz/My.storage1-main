const group = require("../models/group_product_models");
const Product = require("../models/product_models");



exports.getProduct = async (req, res) => {
  
  const product = await Product.query().select("*").where('group_id', req.params.id)

  
  return res.status(200).json({ success: true, product: product });
};

exports.postProduct = async (req, res) => {
    const Group = await group.query().where('id', req.params.id).first();
    const status = 1;
    await Product.query().insert({
        name: req.body.name,
        group_id: req.params.id,
        category_id: Group.category_id,
        price_1: req.body.price_1,
        price_2: req.body.price_2,
        price_3: req.body.price_3,
        currency_id: req.body.currency_id,
        status: status,
    });
    return res.status(200).json({ success: true, msg: 'new Product insert' });
};
exports.postStatus = async (req, res) => {

  const status = await Product.query().update
    ({
    status: req.body.status,
  
  }).where('id', req.params.id)
  return res.status(200).json({ success: true, msg: "new Product insert" })
}

exports.putProduct = async (req, res) => {
  
  await Product.query().where("id", req.params.id).update({
    name: req.body.name,
    // gourp o'zgarmin duribdi
    group_id: req.params.id,  
    category_id: req.body.category_id,
    price_1:req.body.price_1,
    price_2: req.body.price_2,
    price_3: req.body.price_3,
    currency_id: req.body.currency_id,
    status: req.body.status,
  });
  return res.status(200).json({ success: true, msg: "Product update" });
};

exports.delProduct = async (req, res) => {
  await Product.query().where("id", req.params.id).delete();
  return res.status(200).json({ success: true, msg: "delete Product" });
};
