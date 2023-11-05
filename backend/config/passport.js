const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel'); // Asegúrate de que la ruta sea correcta

// Configuración de la estrategia de autenticación local
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email', // Nombre del campo en el formulario de inicio de sesión
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        // Si no se encuentra el usuario o la contraseña no coincide, devuelve un error
        if (!user || !user.comparePassword(password)) {
          return done(null, false, { message: 'Credenciales incorrectas' });
        }

        // Si las credenciales son correctas, devuelve el usuario
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Configuración de la estrategia de autenticación de Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: '',
      clientSecret: '',
      callbackURL: 'http://localhost:5000', // URL de redirección después de la autenticación de Google
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Busca o crea un usuario con la información de Google
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Si el usuario no existe, crea uno nuevo
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            // Otras propiedades según tus necesidades
          });
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serializa y deserializa al usuario para mantener una sesión de usuario
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
