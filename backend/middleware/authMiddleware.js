const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler (async(req, res, next) => {
  let token 
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
      try {
          //obtengo el token del encabezado
          token = req.headers.authorization.split(' ')[1]
          //verificar la firma del token
          const decoded = jwt.verify(token, process.env.JWT_SECRET)
          //obtener el usuario/admin del token
          req.user = await User.findById(decoded.id).select('-password')
          next()
      } catch (error) {
          console.log(error)
          res.status(401)
          throw new Error('Acceso no autorizado')
      }
  }
  if(!token){
      res.status(401)
      throw new Error('Acceso no autorizado, no se recibió ningún token')
  }
})

const requireStripeApiKey = (req, res, next) => {
  // Verificar si se proporciona una clave de API de Stripe en el encabezado
  if (req.headers['stripe-authorization']) {
    req.stripeApiKey = req.headers['stripe-authorization'];
    next(); // Continuar con el flujo de la solicitud
  } else {
    res.status(401);
    throw new Error('Acceso no autorizado, no se proporcionó la clave de API de Stripe');
  }
};

module.exports = {
  protect,
  requireStripeApiKey,
};
