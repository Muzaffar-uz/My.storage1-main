const {Model} = require("objection")

const knex = require('../setting/db')

Model.knex(knex)

class Category extends Model{
    static get tableName(){
        return 'category'
    }
}

module.exports = Category