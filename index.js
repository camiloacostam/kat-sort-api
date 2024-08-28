import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
// Routes imports
import userRoutes from './routes/users.js'
import authRoutes from './routes/auth.js'
import testRoutes from './routes/tests.js'
import solutionRoutes from './routes/solution.js'
// Middleware
import { corsMiddleware } from './middleware/cors.js'
import cors from 'cors'

dotenv.config()

const app = express()

// Conectar a la base de datos
connectDB()

// Middleware
app.use(bodyParser.json())
app.use(corsMiddleware())
// app.use(cors())

// Rutas
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/test', testRoutes)
app.use('/api/solution', solutionRoutes)

export default app
