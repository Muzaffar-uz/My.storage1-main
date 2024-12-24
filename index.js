const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

// dasturni tahlil qilish/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// ilovani jsonli tahlil qilish
app.use(bodyParser.json())

app.use(cors())

const UsreRouter = require('./router/user_router')
const ProductRouter =require('./router/product_router')
const InputRouter = require('./router/input_router')
const OrdersRouter = require('./router/orders_router')
const Orde_productRouter = require('./router/order_product')
const CounterpartyRouter = require('./router/counterparty_router')
const Group_product = require("./router/group_product_router")
const CategoryRouter = require("./router/category_router")
const currencyRouter = require('./router/currency_router')
const Input_proRouter = require('./router/input_pro_router')
const Report_router = require('./router/report_router')
const Cashbox_router = require('./router/cashbox_router')
app.use('/user',UsreRouter)
app.use('/product',ProductRouter)
app.use('/input',InputRouter)
app.use('/orders',OrdersRouter)
app.use('/order_product',Orde_productRouter)
app.use('/counterparty',CounterpartyRouter)
app.use('/group',Group_product)
app.use('/category',CategoryRouter)
app.use("/currency",currencyRouter)
app.use('/input_pro',Input_proRouter)
app.use('/report',Report_router)
app.use('/cashbox',Cashbox_router)


app.listen('3000',()=>{
    console.log('server running');
})