const express = require('express')
const colors = require('colors')
const connectDB = require('./config/db.js')
const dotenv = require("dotenv").config()
const cors = require('cors')
const {errorHandler} = require('./middleware/errorMiddleware')
const port = process.env.PORT || 5000

connectDB()
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false}))

app.use('/users', require('./routes/userRoutes'))

app.use(errorHandler)
app.listen(port, () => console.log(`Server iniciado en el puerto ${port}`))