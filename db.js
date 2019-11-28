const mysql = require("mysql")
require("dotenv").config();

let p = process.env
console.log(p.HOSTNAME)

const pool = mysql.createPool(

    {
        host: p.HOSTNAME,
        user: p.USERDB,
        password: p.PASSWORD,
        port: p.PORTDB,
        database: p.DATABASE
    })

module.exports = pool
//exporto pool para no usar variable global