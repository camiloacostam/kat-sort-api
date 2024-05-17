import express from 'express'
//Controllers
import { registerUser } from '../controllers/users.js'

const router = express.Router()

//Routes
router.post('/register', registerUser)

export default router
