import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:5173',
  'https://kat-sort.pages.dev'
]

export const corsMiddleware = (acceptedOrigins = ACCEPTED_ORIGINS) =>
  cors({
    origin: (origin, callback) => {
      // Si no hay origen, permite la solicitud
      if (!origin) return callback(null, true)

      if (acceptedOrigins.includes(origin)) {
        return callback(null, true)
      } else {
        return callback(new Error('Not allowed by CORS'))
      }
    }
  })
