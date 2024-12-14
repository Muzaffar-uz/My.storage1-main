const Product = require('../models/product_models')

exports.productall = async (req, res) => {
    try {
    
      const knex = await Product.knex();
      const data = await knex.raw(`
      SELECT
      product_id,
      name,
      IFNULL(created,0) AS created ,
      IFNULL(kirim_miqdori, 0) AS kirim_miqdori,
      IFNULL(chiqim_miqdori, 0) AS chiqim_miqdori,
      SUM(IFNULL(kirim_miqdori, 0) - IFNULL(chiqim_miqdori, 0)) OVER (PARTITION BY product_id ORDER BY created) AS qolgan_miqdor
  FROM (
      SELECT
          p.id AS product_id,
          p.name,
          i.created,
          IFNULL(i.number, 0) AS kirim_miqdori,
          0 AS chiqim_miqdori
      FROM product AS p
      LEFT JOIN input_product AS i ON p.id = i.product_id
      
      UNION ALL
      
      SELECT
          p.id AS product_id,
          p.name,
          o.created,
          0 AS kirim_miqdori,
          IFNULL(o.number, 0) AS chiqim_miqdori
      FROM product AS p
      LEFT JOIN order_product AS o ON p.id = o.product_id
  ) AS kirim_chiqimlar
  ORDER BY product_id, created`);
  
      return res.json({ success: true, order_product: data[0] });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };