// Conexión Knex
const options = {
    mysql: {
        client: "mysql",
        connection: {
            host: "localhost",
            user: "root",
            password: "",
            database: "ecommerce",
        },
        pool: { min: 0, max: 10 }
    },
    sqlite3: {
        client: "sqlite3",
        connection: {
            filename: "./DB/mydb.sqlite"
        },
        useNullAsDefault: true
    }
};

module.exports = { options };

// Conexión SQLite3

