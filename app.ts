import { Request, Response, NextFunction } from 'express'
import { OkPacket, queryCallback } from 'mysql'
import { v4 as uuidv4 } from 'uuid'

const express = require("express")
const mysql = require('mysql')
const logger = require('morgan')

const app = express()
const port = process.env.SERVER_PORT

// DATABASE CONNECTION

const development = {
    host: process.env.DB_HOST_DEV,
    port: process.env.DB_PORT_DEV,  
    user: process.env.DB_USER_DEV,
    password: process.env.DB_PASS_DEV,
    database: process.env.DB_NAME_DEV
}

const pool = mysql.createPool(development)

// QUERY FUNCTIONS



app.use(logger('dev'))
app.use(express.static('public'))
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    next()
})

app.use((req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({ error: 'No token provided' });
    }
    else if (authHeader !== process.env.TOKEN) {
        return res.status(401).json({ error: 'Not authorized' });
    } else {
        next();
    }
})

// app.post("/insertData", insertData)
// app.post("/setPoint", setPoint)

app.listen(port, () => { console.log(`⚡️[server]: Server is running on port ${port}`) })