const {Model} = require('objection')
const knex  = require('../setting/db')

Model.knex(knex)

class Input_pro  extends Model {
    static get tableName(){
        return 'input_provider'
    }
}
module.exports = Input_pro