"use strict";
require('dotenv').config();
const mysql = require('mysql');
const dbs = {
    "development": {
        host: process.env.DB_HOST_DEV,
        port: process.env.DB_PORT_DEV,
        user: process.env.DB_USER_DEV,
        password: process.env.DB_PASS_DEV,
        database: process.env.DB_NAME_DEV
    },
    "production": {
        host: process.env.DB_HOST_PROD,
        user: process.env.DB_USER_PROD,
        password: process.env.DB_PASS_PROD,
        database: process.env.DB_NAME_PROD,
        port: process.env.DB_PORT_PROD
    }
};
const pool = mysql.createPool(dbs[process.env.NODE_ENV || 'development']);
module.exports = pool;
