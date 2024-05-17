import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

export const User = mongoose.model('User', userSchema)

// import z from 'zod'

// const userSchema = z.object({
//   name: z.string({
//     invalid_type_error: 'El nombre debe ser una cadena de texto.',
//     invalid_empty_error: 'El nombre no puede estar vacío.',
//     required_error: 'El nombre es requerido.'
//   }),
//   lastName: z.string({
//     invalid_type_error: 'El Apellido debe ser una cadena de texto.',
//     invalid_empty_error: 'El Apellido no puede estar vacío.',
//     required_error: 'El Apellido es requerido.'
//   }),
//   email: z.string().email(),
//   password: z
//     .string({
//       invalid_type_error: 'la contraseña debe ser una cadena de texto.',
//       invalid_empty_error: 'la contraseña no puede estar vacío.',
//       required_error: 'la contraseña es requerido.'
//     })
//     .min(8, 'La contraseña debe tener al menos 8 caracteres.')
// })

// export function validateUser(user) {
//   return userSchema.safeParse(user)
// }
