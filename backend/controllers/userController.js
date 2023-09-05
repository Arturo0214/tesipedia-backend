const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET,{
        expiresIn: '30d'
    })
}
const loginUser = asyncHandler (async (req, res) => {
    //destructuring de la informacion del body request
    const {email, password} = req.body
    //mandar error por si no se pusieron todos los datos en la solicitud
    if(!email || !password) {
        res.status(400)
        throw new Error('Favor de verificar que esten todos los datos')
    }
    //verificar que el usuario exista 
    const user = await User.findOne({email})

    //comparamos el hash del password y el usuario
    if(user && (await bcrypt.compare(password, user.password))){
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user.id)
        })
    } else {
        res.status(400)
        throw new Error('Credenciales incorrectas')
    }
})
const registerUser = asyncHandler (async (req, res) => {
    //desestructuramos el body request
    const {name, email, password} = req.body
    if(!name || !email || !password) {
        res.status(400)
        throw new Error('Favor de verificar que esten todos los datos')
    }
    //verificamos que recibamos la informacion que el modelo User necesita
    const userExiste = await User.findOne({email})
    if(userExiste){
        res.status(400)
        throw new Error('Este email ya fue registrado, el usuario ya existe')
    }
    //hash al password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    //creamos el usuario
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })
    //mandamos la respuesta de la funcion
    if(user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email
    })
    } else {
        res.status(400)
        throw new Error('No se pudo crear el usuario, datos incorrectos')
    }
})

const getMisDatos = asyncHandler (async (req, res) => {
    res.json(req.user)
})


module.exports = {
    loginUser,
    registerUser,
    getMisDatos
}