

const Input_pro = require('../models/input_pro_models')
const Input = require('../models/input_models')
const Product = require('../models/product_models')
const Counterparty = require('../models/counterparty_models')

exports.getCounterparty = async (req, res) => {
  const { name } = req.query;

  const knex = await Counterparty.knex();

  // Agar name parametri berilmagan bo'lsa, barcha counterpartylarni qaytar
  if (!name) {
    const data = await knex.raw(`
      SELECT id, name FROM counterparty WHERE status != 0
    `);
    return res.json({ success: true, input: data[0] });
  }

  const data = await knex.raw(`
    SELECT id, name FROM counterparty WHERE name LIKE ? AND status != 0 `, [`${name}%`]);

  return res.json({ success: true, input: data[0] });
};



exports.getstatus1 = async (req, res) => {
  try {
    const knex = await Input_pro.knex();
    const data = await knex.raw(`
    SELECT 
  n.id, 
  n.counterparty_id, 
  b.name,
  
  -- Statuslar bo'yicha mahsulotlar soni va jami soni
  COUNT(CASE WHEN a.status = 1 THEN a.product_id ELSE NULL END) AS status_1_product_soni,
 
  
  SUM(CASE WHEN a.status = 1 THEN a.number ELSE 0 END) AS status_1_jami_soni,

  
  -- Statuslar bo'yicha narxlar (dollar va so'm)
  SUM(CASE WHEN a.status = 1 AND a.currency_id = 1 THEN (a.price*a.number) ELSE 0 END) AS status_1_narx_dollar,
  SUM(CASE WHEN a.status = 1 AND a.currency_id = 2 THEN (a.price*a.number) ELSE 0 END) AS status_1_narx_sum,
  
  MIN(n.created) AS yaratilgan_sana
FROM 
  input_provider AS n
LEFT JOIN 
  input_product AS a ON a.provider_id = n.id
LEFT JOIN 
  counterparty AS b ON b.id = n.counterparty_id
  WHERE 
      a.status = 1 OR a.status IS NULL
GROUP BY 
  n.id, b.name
ORDER BY
  n.created DESC;
    `);
        return res.json({ success: true, input: data[0] });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.getstatus2 = async (req, res) => {
  try {
    const knex = await Input_pro.knex();
    const data = await knex.raw(`
    SELECT 
    n.id, 
    n.counterparty_id, 
    b.name,
    
    -- Statuslar bo'yicha mahsulotlar soni va jami soni

    COUNT(CASE WHEN a.status = 2 THEN a.product_id ELSE NULL END) AS status_2_product_soni,


    SUM(CASE WHEN a.status = 2 THEN a.number ELSE 0 END) AS status_2_jami_soni,

    -- Statuslar bo'yicha narxlar (dollar va so'm)

    
    SUM(CASE WHEN a.status = 2 AND a.currency_id = 1 THEN (a.price*a.number) ELSE 0 END) AS status_2_narx_dollar,
    SUM(CASE WHEN a.status = 2 AND a.currency_id = 2 THEN a.price ELSE 0 END) AS status_2_narx_sum,
    
  
    
    MIN(n.created) AS yaratilgan_sana
  FROM 
    input_provider AS n
  LEFT JOIN 
    input_product AS a ON a.provider_id = n.id
  LEFT JOIN 
    counterparty AS b ON b.id = n.counterparty_id
    WHERE 
    a.status = 2 OR a.status IS NULL
  GROUP BY 
    n.id, b.name
  ORDER BY
    n.created DESC;
  
    `);
        return res.json({ success: true, input: data[0] });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.getstatus3 = async (req, res) => {
  try {
    const knex = await Input_pro.knex();
    const data = await knex.raw(`
    SELECT 
    n.id, 
    n.counterparty_id, 
    b.name,
    
    -- Statuslar bo'yicha mahsulotlar soni va jami soni
   
    COUNT(CASE WHEN a.status = 3 THEN a.product_id ELSE NULL END) AS status_3_product_soni,
   
    
    
    SUM(CASE WHEN a.status = 3 THEN a.number ELSE 0 END) AS status_3_jami_soni,
  
    
    -- Statuslar bo'yicha narxlar (dollar va so'm)
    
    
    SUM(CASE WHEN a.status = 3 AND a.currency_id = 1 THEN (a.price*a.number) ELSE 0 END) AS status_3_narx_dollar,
    SUM(CASE WHEN a.status = 3 AND a.currency_id = 2 THEN (a.price*a.number) ELSE 0 END) AS status_3_narx_sum,
  
    MIN(n.created) AS yaratilgan_sana
  FROM 
    input_provider AS n
  LEFT JOIN 
    input_product AS a ON a.provider_id = n.id
  LEFT JOIN 
    counterparty AS b ON b.id = n.counterparty_id
    WHERE 
    a.status = 3 OR a.status IS NULL
  GROUP BY 
    n.id, b.name
  ORDER BY
    n.created DESC;
  
    `);
        return res.json({ success: true, input: data[0] });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};



exports.postInput_pro = async (req, res) => {
    try {
        await Input_pro.query().insert({
            counterparty_id: req.body.counterparty_id,
        });
        return res.status(200).json({ success: true, msg: 'input_pro insert' });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};



const input_controller = require('../controller/input_controller'); // input_controller'ni chaqirish

exports.delInput_pro = async (req, res) => {
  try {
    const startId = req.params.id; // URL parametridan provider_id ni olish
    const inputs = await Input.query().where('provider_id', startId); // Ma'lumotlarni olish

    // Agar hech qanday input topilmasa
    if (inputs.length === 0) {
      return res.status(404).json({ success: false, message: 'No records found for the given provider_id' });
    }

    // inputs massivini tekshirish
    console.log('Inputs:', inputs); // inputs ni tekshirish

    // Har bir elementni tekshirish va funksiyani chaqirish
    for (let i = 0; i < inputs.length; i++) {
     

      // item mavjudligini va statusni tekshirish
      if (inputs[i] && inputs[i].status !== undefined) {
        console.log(`Processing item with`); // Item ID ni chiqarish

        // delInput funksiyasini chaqirish
        await input_controller.delInput({
          params: { id: inputs[i].id }, // ID uchun params
          body: {}, // Agar delInput'da body ishlatilsa
          query: {}, // Agar query parametrlari kerak bo‘lsa
        });
      } else {
        // Agar item yoki status mavjud bo'lmasa
        console.log(`Xato: element yoki uning status property yo'q`);
        continue; // Keyingi yozuvga o'tish
      }
    }

    // Javob qaytarish
    return res.status(200).json({ success: true, message: 'Entries processed successfully' });
  } catch (error) {
    console.error('Xato:', error.message); // Xatolikni loglash
    return res.status(500).json({ success: false, error: error.message });
  }
};


    


//  bu status = 1 prixod
exports.getInput_proTime1 = async (req, res) => {
    const { startDate, endDate } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const start = startDate && startDate.trim() ? startDate : today;
    const end = endDate && endDate.trim() ? endDate : today;

    const knex = await Input_pro.knex();
    try {
        const data = await knex.raw(
            `
      SELECT 
      n.id, 
      n.counterparty_id, 
      b.name,
      
      -- Status 1 bo'yicha mahsulotlar soni va jami soni
      COUNT(CASE WHEN a.status = 1 THEN a.product_id ELSE NULL END) AS status_1_product_soni,
      SUM(CASE WHEN a.status = 1 THEN a.number ELSE 0 END) AS status_1_jami_soni,
      
      -- Status 1 bo'yicha narxlar (dollar va so'm)
      SUM(CASE WHEN a.status = 1 AND a.currency_id = 1 THEN a.price ELSE 0 END) AS status_1_narx_dollar,
      SUM(CASE WHEN a.status = 1 AND a.currency_id = 2 THEN a.price ELSE 0 END) AS status_1_narx_sum,
        DATE_FORMAT(n.created, '%d/%m/%Y %H:%i') AS yaratilgan_sana
      FROM 
        input_provider AS n 
      LEFT JOIN      
        input_product AS a ON a.provider_id = n.id 
      LEFT JOIN 
        counterparty AS b ON b.id = n.counterparty_id 
      WHERE 
        n.created BETWEEN ? AND ? AND a.status = 1
      GROUP BY 
        n.id, b.name;
    `,
            [`${start} 00:00:00`, `${end} 23:59:59`]
        );
        return res.json({ success: true, input: data[0] });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

//  bu status 2  rasxod
exports.getInput_proTime2 = async (req, res) => {
  const { startDate, endDate } = req.body;
  const today = new Date().toISOString().split('T')[0];
  const start = startDate && startDate.trim() ? startDate : today;
  const end = endDate && endDate.trim() ? endDate : today;

  const knex = await Input_pro.knex();
  try { 
      const data = await knex.raw(
          `
          SELECT 
          n.id, 
          n.counterparty_id, 
          b.name,
          
          -- Statuslar bo'yicha mahsulotlar soni va jami soni
      
          COUNT(CASE WHEN a.status = 2 THEN a.product_id ELSE NULL END) AS status_2_product_soni,
      
      
          SUM(CASE WHEN a.status = 2 THEN a.number ELSE 0 END) AS status_2_jami_soni,
      
          -- Statuslar bo'yicha narxlar (dollar va so'm)
      
          
          SUM(CASE WHEN a.status = 2 AND a.currency_id = 1 THEN a.price ELSE 0 END) AS status_2_narx_dollar,
          SUM(CASE WHEN a.status = 2 AND a.currency_id = 2 THEN a.price ELSE 0 END) AS status_2_narx_sum,
      DATE_FORMAT(n.created, '%d/%m/%Y %H:%i') AS yaratilgan_sana
    FROM 
      input_provider AS n 
    LEFT JOIN      
      input_product AS a ON a.provider_id = n.id 
    LEFT JOIN 
      counterparty AS b ON b.id = n.counterparty_id 
    WHERE 
      n.created BETWEEN ? AND ? AND a.status = 2
    GROUP BY 
      n.id, b.name;
  `,
          [`${start} 00:00:00`, `${end} 23:59:59`]
      );
      return res.json({ success: true, input: data[0] });
  } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
  }
};

// bu status 3 vazvrat
exports.getInput_proTime3 = async (req, res) => {
  const { startDate, endDate } = req.body;
  const today = new Date().toISOString().split('T')[0];
  const start = startDate && startDate.trim() ? startDate : today;
  const end = endDate && endDate.trim() ? endDate : today;

  const knex = await Input_pro.knex();
  try {
      const data = await knex.raw(
          `SELECT 
          n.id, 
          n.counterparty_id, 
          b.name,
          
          -- Statuslar bo'yicha mahsulotlar soni va jami soni
         
          COUNT(CASE WHEN a.status = 3 THEN a.product_id ELSE NULL END) AS status_3_product_soni,
         
          
          
          SUM(CASE WHEN a.status = 3 THEN a.number ELSE 0 END) AS status_3_jami_soni,
        
          
          -- Statuslar bo'yicha narxlar (dollar va so'm)
          
          
          SUM(CASE WHEN a.status = 3 AND a.currency_id = 1 THEN a.price ELSE 0 END) AS status_3_narx_dollar,
          SUM(CASE WHEN a.status = 3 AND a.currency_id = 2 THEN a.price ELSE 0 END) AS status_3_narx_sum,
      DATE_FORMAT(n.created, '%d/%m/%Y %H:%i') AS yaratilgan_sana
    FROM 
      input_provider AS n 
    LEFT JOIN      
      input_product AS a ON a.provider_id = n.id 
    LEFT JOIN 
      counterparty AS b ON b.id = n.counterparty_id 
    WHERE 
      n.created BETWEEN ? AND ? AND a.status = 3
    GROUP BY 
      n.id, b.name;
  `,
          [`${start} 00:00:00`, `${end} 23:59:59`]
      );
      return res.json({ success: true, input: data[0] });
  } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
  }
};

//  bu status  1 prixod
exports.getInput_proSearch1 = async (req, res) => {
  const { name } = req.query;
  const knex = await Input_pro.knex();
  try {
      const data = await knex.raw(
          `
    SELECT 
      n.id, 
      n.counterparty_id, 
      b.name,
      
      -- Status 1 bo'yicha mahsulotlar soni va jami soni
      COUNT(CASE WHEN a.status = 1 THEN a.product_id ELSE NULL END) AS status_1_product_soni,
      SUM(CASE WHEN a.status = 1 THEN a.number ELSE 0 END) AS status_1_jami_soni,
      
      -- Status 1 bo'yicha narxlar (dollar va so'm)
      SUM(CASE WHEN a.status = 1 AND a.currency_id = 1 THEN a.price ELSE 0 END) AS status_1_narx_dollar,
      SUM(CASE WHEN a.status = 1 AND a.currency_id = 2 THEN a.price ELSE 0 END) AS status_1_narx_sum,
      
      DATE_FORMAT(n.created, '%d/%m/%Y %H:%i') AS yaratilgan_sana
    FROM 
      input_provider AS n 
    LEFT JOIN      
      input_product AS a ON a.provider_id = n.id 
    LEFT JOIN 
      counterparty AS b ON b.id = n.counterparty_id 
    WHERE 
      b.name LIKE ? AND a.status = 1
    GROUP BY 
      n.id, n.counterparty_id, b.name, n.created;
  `,
          [`${name}%`] 
      );
      return res.json({ success: true, input: data[0] });
  } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
  }
};

// bu status 2 rasxod
exports.getInput_proSearch2 = async (req, res) => {
  const { name } = req.query;
  const knex = await Input_pro.knex();
  try {
      const data = await knex.raw(
          `
          SELECT 
          n.id, 
          n.counterparty_id, 
          b.name,
          
          -- Statuslar bo'yicha mahsulotlar soni va jami soni
      
          COUNT(CASE WHEN a.status = 2 THEN a.product_id ELSE NULL END) AS status_2_product_soni,
      
      
          SUM(CASE WHEN a.status = 2 THEN a.number ELSE 0 END) AS status_2_jami_soni,
      
          -- Statuslar bo'yicha narxlar (dollar va so'm)
      
          
          SUM(CASE WHEN a.status = 2 AND a.currency_id = 1 THEN a.price ELSE 0 END) AS status_2_narx_dollar,
          SUM(CASE WHEN a.status = 2 AND a.currency_id = 2 THEN a.price ELSE 0 END) AS status_2_narx_sum,
      DATE_FORMAT(n.created, '%d/%m/%Y %H:%i') AS yaratilgan_sana
    FROM 
      input_provider AS n 
    LEFT JOIN      
      input_product AS a ON a.provider_id = n.id 
    LEFT JOIN 
      counterparty AS b ON b.id = n.counterparty_id 
    WHERE 
      b.name LIKE ? AND a.status = 2
    GROUP BY 
      n.id, n.counterparty_id, b.name, n.created;
  `,
          [`${name}%`]
      );
      return res.json({ success: true, input: data[0] });
  } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
  }
};

// bu status 3 vazvrat
exports.getInput_proSearch3 = async (req, res) => {
  const { name } = req.query;
  const knex = await Input_pro.knex();
  try {
      const data = await knex.raw(
          `
          SELECT 
          n.id, 
          n.counterparty_id, 
          b.name,
          
          -- Statuslar bo'yicha mahsulotlar soni va jami soni
         
          COUNT(CASE WHEN a.status = 3 THEN a.product_id ELSE NULL END) AS status_3_product_soni,
         
          
          
          SUM(CASE WHEN a.status = 3 THEN a.number ELSE 0 END) AS status_3_jami_soni,
        
          
          -- Statuslar bo'yicha narxlar (dollar va so'm)
          
          
          SUM(CASE WHEN a.status = 3 AND a.currency_id = 1 THEN a.price ELSE 0 END) AS status_3_narx_dollar,
          SUM(CASE WHEN a.status = 3 AND a.currency_id = 2 THEN a.price ELSE 0 END) AS status_3_narx_sum,
      DATE_FORMAT(n.created, '%d/%m/%Y %H:%i') AS yaratilgan_sana
    FROM 
      input_provider AS n 
    LEFT JOIN      
      input_product AS a ON a.provider_id = n.id 
    LEFT JOIN 
      counterparty AS b ON b.id = n.counterparty_id 
    WHERE 
      b.name LIKE ? AND a.status = 3
    GROUP BY 
      n.id, n.counterparty_id, b.name, n.created;
  `,
          [`${name}%`]
      );
      return res.json({ success: true, input: data[0] });
  } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
  }
};
