const {Model} = require('objection')
const knex = require('../setting/db')

Model.knex(knex)

class group_product extends Model{
    static get tableName(){
        return 'group_product'
    }
}
module.exports = group_product