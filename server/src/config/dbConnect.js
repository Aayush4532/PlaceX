const {Pool} = require("pg");

const connection = new Pool({
    host : "localhost",
    user : "postgres",
    port : 5432,
    password : "1149",
    database : "PlaceX"
});


module.exports = {connection};