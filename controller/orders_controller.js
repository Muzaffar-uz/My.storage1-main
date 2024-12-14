
const Orders = require('../models/orders_models')

exports.getOrder = async (req,res)=>{

    const knex = await Orders.knex();
    const data = await knex.raw(`
    SELECT 
  n.id, 
  n.counterparty_id, 
  b.name,
  count(a.product_id) as prduct_soni,
  SUM(a.number) AS jami_soni, 
  SUM(CASE WHEN a.currency_id = 1 THEN a.price ELSE 0 END) AS narx_dollar, 
  SUM(CASE WHEN a.currency_id = 2 THEN a.price ELSE 0 END) AS narx_sum, 
  MIN(n.created) AS yaratilgan_sana 
  FROM orders AS n 
  LEFT JOIN 
  order_product AS a 
  ON a.order_id = n.id 
  LEFT JOIN 
  counterparty AS b 
  ON b.id = n.counterparty_id 
  GROUP BY 
  n.id, b.name
  ORDER BY
       n.created DESC`);
  
    return res.json({ success: true, orders: data[0] });
  };

  exports.getOrdersTime = async (req, res) => {
    const { startDate, endDate } = req.body;  // startDate va endDate ni req.body'dan qabul qilamiz
    
    // Bugungi sanani olish
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0]; // YYYY-MM-DD formatida
  
    // Sanalarni tekshirish, agar bo'sh bo'lsa, bugungi kunga o'rnatamiz
    const start = startDate && startDate.trim() ? startDate : currentDate;
    const end = endDate && endDate.trim() ? endDate : currentDate;
  
    const knex = await Orders.knex();
    
    try {
      const data = await knex.raw(`
      SELECT 
      n.id, 
      n.counterparty_id, 
      b.name,
      count(a.product_id) as prduct_soni,
      SUM(a.number) AS jami_soni, 
      SUM(CASE WHEN a.currency_id = 1 THEN a.price ELSE 0 END) AS narx_dollar, 
      SUM(CASE WHEN a.currency_id = 2 THEN a.price ELSE 0 END) AS narx_sum, 
      MIN(n.created) AS yaratilgan_sana 
      FROM orders AS n 
      LEFT JOIN 
      order_product AS a 
      ON a.order_id = n.id 
      LEFT JOIN 
      counterparty AS b 
      ON b.id = n.counterparty_id 
        WHERE 
          n.created BETWEEN ? AND ?  -- parametrlarni query orqali qo'shamiz
        GROUP BY 
          n.id, b.name;
      `, [start + ' 00:00:00', end + ' 23:59:59']);;  // start va end bu yerda qo'llaniladi

      return res.json({ success: true, orders: data[0] });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Query failed', error: error.message });
    }
  };

  exports.getOrdersSearch = async (req, res) => {
    const { name } = req.query;
  
    const knex = await Orders.knex();
    try {
        const data = await knex.raw(`
        SELECT 
        n.id, 
        n.counterparty_id, 
        b.name,
        count(a.product_id) as prduct_soni,
        SUM(a.number) AS jami_soni, 
        SUM(CASE WHEN a.currency_id = 1 THEN a.price ELSE 0 END) AS narx_dollar, 
        SUM(CASE WHEN a.currency_id = 2 THEN a.price ELSE 0 END) AS narx_sum, 
        MIN(n.created) AS yaratilgan_sana 
        FROM orders AS n 
        LEFT JOIN 
        order_product AS a 
        ON a.order_id = n.id 
        LEFT JOIN 
        counterparty AS b 
        ON b.id = n.counterparty_id 
            WHERE b.name LIKE ?  -- 'name' bilan qidirish
            GROUP BY 
                n.id, n.counterparty_id, b.name, n.created;
        `, [`${name}%`]);  // 'name' bilan boshlanadigan barcha nomlar
  
        return res.json({ success: true, orders: data[0] });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Query failed', error: error.message });
    }
  };

  exports.postOrders = async (req,res) =>{
    try{ await Orders.query().insert({
     counterparty_id: req.body.counterparty_id,
   
     })
     return res.status(200).json({success:true, msg: " Orders insort"})
   }catch(e){
       res.status(500).json({ error: e});
     }
   }

   exports.putOrders = async (req,res)=>{
    try{await Orders.query().findOne('id', req.params.id).update(req.body)
    return res.status(200).json({success:true})}catch(e){
        res.status(500).json({ error: e});
      }
}

exports.delOrders = async (req,res)=>{
  try{ await Orders.query().where('id',req.params.id).delete()
   return res.status(200).json({success:true})}catch(e){
       res.status(500).json({ error: e});
   }
}