
const Order_product = require('../models/order_product_models')
const Product = require('../models/product_models')

exports.getOrderproduct = async (req, res) => {
    try {
     const  orderID  = req.params.id; // Ensure this is extracted correctly
      if (!orderID) {
        return res.status(400).json({ success: false, error: "Order ID is required" });
      }
      const knex = await Order_product.knex();
      const data = await knex.raw(`
        SELECT n.id, n.order_id, n.product_id, p.name AS praduct, n.number, n.price, 
        p.price_1, p.price_2, p.price_3, 
        n.currency_id, c.name AS currency
        FROM order_product AS n 
        LEFT JOIN product AS p ON p.id = n.product_id 
        LEFT JOIN currency AS c ON c.id = n.currency_id 
        WHERE n.order_id = ?`, [orderID]);
  
      return res.json({ success: true, order_product: data[0] });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };
  
  exports.getProduct = async (req, res) => {
    const { name } = req.query;
  
    const knex = await Product.knex();
  
    // Agar name parametri berilmagan bo'lsa, barcha counterpartylarni qaytar
    if (!name) {
      const data = await knex.raw(`
        SELECT id, name FROM product
      `);
      return res.json({ success: true, input: data[0] });
    }
  
    const data = await knex.raw(`
      SELECT id, name FROM product WHERE name LIKE ?`, [`${name}%`]);
  
    return res.json({ success: true, input: data[0] });
  };

  

 exports.postOrder_product = async (req,res) =>{
    await Order_product.query().insert({
      order_id: req.params.id,
      product_id:req.body.product_id,
      number: req.body.number,
      price: req.body.price,
      currency_id: req.body.currency_id,
      created: req.body.created

    })
//     const d = new Date()
//     const output = await Output.query().where('number', req.body.number).first()
//     const product = await Product.query().where('id', req.body.product_id).first()
// // maxsulot sonidan olish
//     await Product.query().where('id', req.body.product_id).update({
//         count: product.count - output.number,
//         updated: d,
//     })
// // klentdan  summani olish
//     const counterparty =  await Counterparty.query().where('id',req.body.counterparty_id).first()
//     await Counterparty.query().where('id',req.body.counterparty_id).update({
// summ: counterparty.summ-(input.number*input.summ),
// updated:d,
//     })
    return res.status(200).json({success:true, msg: ' maxsulot chiqdi'})
 }

 exports.putOutput = async (req,res)=>{
    await Output.query().where("id",req.params.id).update({
        counterparty_id: req.body.counterparty_id,
        product_id: req.body.product_id,
        number: req.body.number,
        currency_id: req.body.currency_id,
        price: req.body.price,
        //  bu yerda vaqt o'zgatirish
        created: req.body.created
    })
    return res.status(200).json({success:true, msg: ' Jo\'natma o\'zgartirldi'})
 }

 exports.delOutput = async (req,res) => {
await Output.query().where('id'.req.params.id).delete()
return res.status(200).json({ success: true, msg: "delete Output" })
 }


 