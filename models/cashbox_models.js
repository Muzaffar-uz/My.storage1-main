const {Model} = require('objection')
const knex = require('../setting/db')
Model.knex(knex)

class Cashbox extends Model{
static get tableName(){
    return 'cashbox'
}
}

module.exports = Cashbox