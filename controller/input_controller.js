 const Input = require('../models/input_models')
const Product = require('../models/product_models')
const Counterparty = require('../models/counterparty_models')
const input_provider = require('../models/input_pro_models')
const XLSX = require('xlsx');
const { count } = require('../setting/db');



exports.getInput = async (req, res) => {
  try {
    const input = await Input.query()
      .select(
        "input_product.id",
        "input_product.product_id",
        "product.name as product",
        "input_product.provider_id",
        "input_product.number",
        "input_product.price",
        "input_product.currency_id",
        "currency.name as currency",
        "input_product.created"
      )
      .where('provider_id', req.params.id)
      .whereNot('input_product.status', 4) // Status 4 bo'lgan qiymatlarni ko‘rsatmaydi
      .leftJoin('currency', 'input_product.currency_id', 'currency.id')
      .leftJoin('product', 'input_product.product_id', 'product.id');

    return res.status(200).json({ success: true, input });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};


exports.getProduct = async (req, res) => {
  const { name } = req.query;

  const knex = await Product.knex();

  // Agar name parametri berilmagan bo'lsa, status 0 bo'lmagan barcha mahsulotlarni qaytar
  if (!name) {
    const data = await knex.raw(`
      SELECT id, name FROM product WHERE status != 0
    `);
    return res.json({ success: true, input: data[0] });
  }

  // name parametriga ko'ra qidirish, status 0 bo'lmagan mahsulotlar
  const data = await knex.raw(`
    SELECT id, name FROM product WHERE name LIKE ? AND status != 0
  `, [`${name}%`]);

  return res.json({ success: true, input: data[0] });
};


exports.getPrice = async (req, res) => {
  const { price } = req.query;

  const knex = await Product.knex();

  // Agar name parametri berilmagan bo'lsa, status 0 bo'lmagan barcha mahsulo
  if (!price) {
    try{const data = await knex.raw(`
     SELECT id, price_1,price_2,price_3 FROM product WHERE status != 0
    `);
    return res.json({ success: true, input: data[0] });
    }catch(e){
      return res.json({success:false, msg:e.message})
    }
    }
  }



exports.postInput = async (req, res) => {
  try {
    const status = parseFloat(req.body.status); // parseFloat ishlatiladi
    const provider_id = req.params.id;

    // Statusni tekshirish (faqat 1, 2 yoki 3 qabul qilinadi)
    if (![1, 2, 3].includes(status)) {
      return res.status(400).json({
        success: false, 
        message: 'Noto‘g‘ri `status` qiymati. Faqat 1, 2 yoki 3 qabul qilinadi.',
      });
    }
// Mahsulot va valyutani olish
const product_ = await Product.query().where('id',req.body.product_id).first();
if (!product_) {
  return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
}

const product_currency = parseFloat(product_.currency_id);


    // Qo‘llaniladigan qiymatlarni olish
    const product_id = req.body.product_id;
    const number = parseFloat(req.body.number);
    const price = parseFloat(req.body.price);
    const currency_id = product_currency;
    const created = req.body.created;

    if (!product_id || isNaN(number) || isNaN(price)) {
      return res.status(400).json({
        success: false,
        message: 'Noto‘g‘ri `product_id`, `number` yoki `price` qiymati',
      });
    }

    // Oxirgi qo‘shilgan mahsulotni olish
    const lastAdded = await Input.query()
  .where('product_id', product_id)
  .where('status', '!=', 4)  // Status 4 bo'lmaganlarni olish
  .orderBy('id', 'desc')
  .first();

    const lastTotal = lastAdded ? parseFloat(lastAdded.total) : 0;
    const newTotal = status == 2 ? lastTotal - number : lastTotal + number;

 // Provider ma'lumotlarini olish
    const customer = await input_provider.query().where('id', provider_id).first();
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }
    const counterparty_id = customer.counterparty_id || 0;
    

    // Oxirgi balansni olish
    const lastBalanceRecord = await Input.query()
    .where('counterparty_id', counterparty_id )
    .where('currency_id', currency_id) // currency_id bo'yicha filtrlash
    .where('status', '!=', 4)  // Status 4 bo'lmaganlarni olish
    .orderBy('id', 'desc')
    .first();
    const lastBalance = lastBalanceRecord && lastBalanceRecord.balance != null ? parseFloat(lastBalanceRecord.balance) : 0;

    // Yangi balansni hisoblash
    const newBalance = status == 2 ? lastBalance + (price*number) : lastBalance - (price*number);

   
    
    
    // Ma'lumotlarni qo'shish
    await Input.query().insert({
      provider_id,
      counterparty_id,
      status,
      product_id,
      number,
      currency_id,
      price,
      total: newTotal,
      balance: newBalance,
      created,
    });

    // Mahsulotni yangilash
    const product = await Product.query().where('id', product_id).first();
    if (product) {
      const currentCount = parseFloat(product.count) || 0;
      const updatedCount = status === 2 ? currentCount - number : currentCount + number;

      await Product.query().where('id', product_id).update({ count: updatedCount });
    } else {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Counterparty balansini yangilash
    const counterparty = await Counterparty.query().where('id', counterparty_id).first();
    if (counterparty) {
      const currentBalance = parseFloat(counterparty.balance) || 0;
      const currentsum = parseFloat(counterparty.balance_sum) || 0;
      if(currency_id == 1){
      const updatedBalance = status === 2 ? currentBalance + (price*number) : currentBalance - (price*number);

      await Counterparty.query().where('id', counterparty_id).update({ balance: updatedBalance });
      } else if(currency_id == 2){
        const updatedBalance_sum = status === 2 ? currentsum + (price*number) : currentsum - (price*number);

        await Counterparty.query().where('id', counterparty_id).update({ balance_sum: updatedBalance_sum });
      }
 }

    return res.status(200).json({
      success: true,
      message: 'Data inserted and total updated successfully',
      total: newTotal,
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};



exports.delInput = async (req, res) => {
  try {
    const startId = req.params.id; // Bosilgan ID

    const input = await Input.query().where('id', startId).first();

    if (!input) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }
if(input.status == 4){
  return res.status(404).json({success: false, msg: 'This has been deleted.'})
}
    const { product_id, provider_id, number, price,counterparty_id,status,currency_id} = input;
   
   
    // 1. Bosilgan IDni 4-statusga yangilash
    await Input.query().where('id', startId).update({ status: 4 });

    // Mahsulotni yangilash
    const product = await Product.query().where('id', product_id).first();
    if (product) {
      const currentCount = parseFloat(product.count) || 0;
      const updatedCount = status == 2 ? currentCount + number : currentCount - number;

      await Product.query().where('id', product_id).update({ count: updatedCount });
    } else {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Counterparty balansini yangilash
    const counterparty = await Counterparty.query().where('id', counterparty_id).first();
    if (counterparty) {
      const currentBalance = parseFloat(counterparty.balance) || 0;
      const currentsum = parseFloat(counterparty.balance_sum) || 0;
    if(currency_id == 1){
      const updatedBalance = status === 2 ? currentBalance - (price*number) : currentBalance + (price*number);

      await Counterparty.query().where('id', counterparty_id).update({ balance: updatedBalance });
      } else if(currency_id == 2){
        const updatedBalance_sum = status === 2 ? currentsum - (price*number) : currentsum + (price*number);

        await Counterparty.query().where('id', counterparty_id).update({ balance_sum: updatedBalance_sum });
      }
    }
    // 2. IDdan keyingi yozuvlarni olish (shu product_id va provider_id bo'yicha)
    const tabletotal = await Input.query()
      .where('id', '>=', startId)
      .where('product_id', product_id)
      .orderBy('id', 'asc');

    const tablebalance = await Input.query()
      .where('id', '>=', startId)
      .where('provider_id', provider_id)
      .orderBy('id', 'asc');

    if (!tabletotal.length && !tablebalance.length) {
      return res.status(200).json({ success: true, message: 'No further rows to update' });
    }

    // Product bo'yicha hisob-kitob
    for (let i = 0; i < tabletotal.length; i++) {
      let currentTotal = parseFloat(tabletotal[i].total) || 0; // Boshlang'ich total qiymati

      if (tabletotal[i].status == 4) {
        continue; // Status 4 bo'lsa, o'tkazib yuboriladi
      }

     if (status == 2) {
      currentTotal += parseFloat(number); // orqa qaytish olingandi endi qo'shiladi
}else if(status == 1 || status == 3){
       currentTotal -= parseFloat(number)
}
      
      await Input.query().where('id', tabletotal[i].id).update({ total: currentTotal });
    }

    // Provider bo'yicha hisob-kitob
    for (let j = 0; j < tablebalance.length; j++) {
      let currentBalance = parseFloat(tablebalance[j].balance) || 0; // Boshlang'ich balance qiymati

      if (tablebalance[j].status == 4) {
        continue; // Status 4 bo'lsa, o'tkazib yuboriladi
      }

      if (parseFloat(currency_id) === parseFloat(tablebalance[j].currency_id)) {
        if (status == 2) {
          currentBalance -= Number(price * number); // Kirim holati
        } else if (status == 1 || status == 3) {
          currentBalance += Number(price * number); // Chiqim yoki qaytarish holati
        }

      }
      

      await Input.query().where('id', tablebalance[j].id).update({ balance: currentBalance });
    }

    return res.status(200).json({
      success: true,
      message: 'Status updated and totals recalculated successfully',
    });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
};
 


exports.exportInputToExcel = async (req, res) => {

  const providerId = req.params.id;
  const knex = await Input.knex();
  try {
    const result = await knex.raw(`
    SELECT d.name, a.name AS product, n.number, 
           CASE 
             WHEN p.name = 'mlliy valyuta' THEN n.price 
             ELSE NULL 
           END AS price_milliy,
           CASE 
             WHEN p.name != 'mlliy valyuta' THEN n.price 
             ELSE NULL 
           END AS price_$$,
           q.created
    FROM input_product AS n
    LEFT JOIN product AS a ON a.id = n.product_id
    LEFT JOIN currency AS p ON p.id = n.currency_id 
    LEFT JOIN input_provider AS q ON q.id = n.provider_id
    LEFT JOIN counterparty AS d ON d.id = q.counterparty_id
    WHERE n.provider_id = ?
    `, [providerId]);

    const products = result[0];
    if (products.length === 0) {
        return res.status(404).json({ success: false, message: "Ma'lumot topilmadi" });
    }

    // Excel faylini yaratish
    const worksheet = XLSX.utils.json_to_sheet(products);

    // Jami hisoblash
    const totalNumber = products.reduce((sum, product) => sum + (product.number || 0), 0);
    const totalPrice = products.reduce((sum, product) => sum + (product.price_$$ || 0), 0);
    const totalPriceMilliy = products.reduce((sum, product) => sum + (product.price_milliy || 0), 0);

    // Jami qatorini qo'shish
    XLSX.utils.sheet_add_aoa(worksheet, [
      ["", "", totalNumber, totalPrice, totalPriceMilliy]
    ], { origin: -1 });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Mahsulotlar");

    // Faylni bufferga yozish
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // Faylni yuborish
    res.setHeader('Content-Disposition', `attachment; filename=mahsulotlar.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Xatolik yuz berdi" });
  }
}


  