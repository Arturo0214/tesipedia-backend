const express = require('express');
const passport = require('passport');
const router = express.Router();

// Configura la ruta de inicio de sesión con Google
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] })
);

// Configura la ruta de redirección después de la autenticación de Google
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Lógica de redirección después de la autenticación exitosa de Google
    res.redirect('/dashboard'); // Puedes cambiar esto según tus necesidades
  }
);

module.exports = router;
