import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('Falta la variable de entorno JWT_SECRET')
}

/**
 * Genera un token JWT para un usuario dado.
 * @param {string} userId - El ID del usuario para el que se genera el token.
 * @returns {string} - El token JWT generado.
 */
export const generateToken = (userId) => {
  const payload = { id: userId }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })
}

/**
 * Verifica un token JWT.
 * @param {string} token - El token JWT a verificar.
 * @returns {Object} - El payload decodificado si el token es válido.
 * @throws {Error} - Si el token no es válido o ha expirado.
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error('Token no válido o ha expirado')
  }
}
