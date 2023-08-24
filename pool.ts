require('dotenv').config();
const mysql = require('mysql')

const development = {
    host: process.env.DB_HOST_DEV,
    port: process.env.DB_PORT_DEV,  
    user: process.env.DB_USER_DEV,
    password: process.env.DB_PASS_DEV,
    database: process.env.DB_NAME_DEV
}

const pool = mysql.createPool(development)

module.exports = pool