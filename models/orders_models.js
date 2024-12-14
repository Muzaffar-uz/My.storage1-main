const {Model} = require('objection')
const knex = require('../setting/db')

Model.knex(knex)

class  orders extends Model{
    static get tableName(){
        return 'orders'
    }
}

module.exports = orders