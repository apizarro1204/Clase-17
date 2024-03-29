const {options} = require('./../connection');
const knex = require('knex')(options.mysql);
const knexSql = require('knex')(options.sqlite3)


class Tablas {


// Tabla productos
async prod(){
await knex.schema.dropTableIfExists('productos').then(() => {
    knex.schema.createTable('productos', (table) => {
        table.increments('id');
        table.string('title', 15).notNullable();
        table.float('price', 4).notNullable();
        table.string('thumbnail').notNullable();
    }).then(() => {
        console.log('table product created')
    }).catch((err) => {
        console.log(err)
    }).finally(() => {
        knex.destroy();
    })
});
}


// Tabla Mensajes
async mess(){
await knexSql.schema.dropTableIfExists('mensajes').then(() => {
    knexSql.schema.createTable('mensajes', (table)=>{
        table.increments('id');
        table.string('author').notNullable();
        table.string('text').notNullable();
        table.string('fecha');
    }).then(() => {
        console.log('table message created')
    }).catch((err) => {
        console.log(err)
    }).finally(() => {
        knex.destroy();
    })
})
}
}

module.exports = Tablas;
