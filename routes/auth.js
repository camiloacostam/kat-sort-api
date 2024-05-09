const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

router.post('/register', async (req, res) => {
  const { name, lastName, email, password } = req.body

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe.' })
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear un nuevo usuario
    const newUser = new User({
      name,
      lastName,
      email,
      password: hashedPassword
    })

    // Guardar el usuario en la base de datos
    await newUser.save()

    // Enviar una respuesta exitosa
    res.status(201).json({ message: 'Usuario registrado exitosamente.' })
  } catch (error) {
    console.error('Error al registrar usuario:', error)
    res.status(500).json({ message: 'Error interno del servidor.' })
  }
})
