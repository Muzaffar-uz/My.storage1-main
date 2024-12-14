
const {Model} = require('objection')
const knex = require('../setting/db')

Model.knex(knex)

class Order_product extends Model{
    static get tableName(){
        return 'order_product'
    }
    
}
module.exports = Order_product