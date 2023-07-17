const nodemailer = require('nodemailer')
const User = require('../models/userModel') // Importar el modelo User

// Función para enviar un correo electrónico de notificación
const sendPaymentNotificationEmail = async (payment) => {
  try {
    // Obtener el ID del usuario desde el pago
    const userId = payment.user; // Asumiendo que el ID del usuario está almacenado en payment.user

    // Obtener la dirección de correo electrónico del usuario desde la base de datos
    const user = await User.findById(userId);
    const email = user.email;

    // Configurar el transporte de correo electrónico
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: '', // Ingresa aquí tu correo electrónico
        pass: '' // Ingresa aquí tu contraseña
      }
    });

    // Crear el contenido del correo electrónico
    const mailOptions = {
      from: 'tu_correo@gmail.com',
      to: email,
      subject: 'Notificación de pago',
      text: `Se ha realizado un nuevo pago con ID: ${payment._id}`
    };

    // Enviar el correo electrónico
    await transporter.sendMail(mailOptions)
    console.log('Correo electrónico enviado')
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error)
  }
}

module.exports = { sendPaymentNotificationEmail }