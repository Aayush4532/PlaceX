const {Pool} = require("pg");

const connection = new Pool({
    host : "localhost",
    user : "postgres",
    port : 5432,
    password : "aayush123",
    database : "LearningPostgres"
});


module.exports = {connection};