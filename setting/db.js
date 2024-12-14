const config = require('../knex')['development']

const knex = require('knex')(config)


module.exports = knex