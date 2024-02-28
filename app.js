import { data } from './query'

const express = require("express")
const mysql = require('mysql')
const logger = require('morgan')

const app = express()
const port = process.env.SERVER_PORT

app.use(logger('dev'))
app.use(express.static('public'))
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    next()
})

// app.use((req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//         return res.status(403).json({ error: 'No token provided' });
//     }
//     else if (authHeader !== process.env.TOKEN) {
//         return res.status(401).json({ error: 'Not authorized' });
//     } else {
//         next();
//     }
// })

// app.post("/insertData", insertData)
// app.post("/setPoint", setPoint)
app.get("/test", data)
app.get("/test2", (req, res) => res.send('test2'))

app.listen(port, () => { console.log(`⚡️[server]: Server is running on port ${port}`) })