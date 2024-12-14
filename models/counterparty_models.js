const {Model} = require('objection')

const knex = require('../setting/db')

Model.knex(knex)

class counterparty extends Model{
    static get tableName(){
        return 'counterparty'
    }
}
module.exports = counterparty