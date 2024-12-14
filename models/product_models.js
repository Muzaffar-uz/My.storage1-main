const {Model} = require('objection')
const knex = require('../setting/db')

Model.knex(knex)

class product extends Model{
    static get tableName(){
        return 'product'
    }
}

module.exports = product