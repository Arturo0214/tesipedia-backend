const express = require('express');
const colors = require('colors');
const path = require('path');
const multer = require('multer');
const connectDB = require('./config/db.js');
const dotenv = require("dotenv").config();
const requestIp = require('request-ip');
const cors = require('cors');
const passport = require('passport'); 
const { errorHandler } = require('./middleware/errorMiddleware');
const bodyParser = require('body-parser');


const port = process.env.PORT || 5000;

connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


// Define tus rutas
app.use('/users', require('./routes/userRoutes'));
app.use('/requests', require('./routes/requestRoutes'));
app.use('/payments', require('./routes/paymentRoutes'));
app.use('/projects', require('./routes/projectRoutes'));
app.use('/google', require('./routes/googleRoutes'));


app.use((req, res, next) => {
  const visitorIp = req.clientIp; // Obtiene la dirección IP del visitante
  const timestamp = new Date().toISOString(); // Obtiene la hora de acceso

  // Registra la información del visitante en la consola
  console.log(`Visita desde IP ${visitorIp} a las ${timestamp}`);

  next();
});

app.use(errorHandler);

app.listen(port, () => console.log(`Server iniciado en el puerto ${port}`));
