const express = require('express');
const colors = require('colors');
const connectDB = require('./config/db.js');
const dotenv = require("dotenv").config();
const cors = require('cors');
const passport = require('passport'); // Importa Passport.js
const { errorHandler } = require('./middleware/errorMiddleware');

const port = process.env.PORT || 5000;

connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

// Define tus rutas
app.use('/users', require('./routes/userRoutes'));
app.use('/requests', require('./routes/requestRoutes'));
app.use('/payments', require('./routes/paymentRoutes'));
app.use('/google', require('./routes/googleRoutes'));

app.use(errorHandler);

app.listen(port, () => console.log(`Server iniciado en el puerto ${port}`));
