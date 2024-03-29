// Clase con los métodos agregar producto y
class Contenedor {
    constructor(table, knex){
        this.db = require("knex")(knex);
        this.table = table;
    }

    async addProduct(prod){
        try {
            return await this.db(this.table).insert(prod)
        } catch (error) {
            throw error;
        }
    }

    async getAll() {
        try {
            // knex('tabla').condiciones.campos
            return await this.db.select("*").from(this.table)
    
        } catch (error) {
            throw error;
        }
    
    }    
        
}

module.exports = Contenedor;


