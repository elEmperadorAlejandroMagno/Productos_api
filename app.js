import express, { json } from 'express'
import cors from 'cors'
import { productsRouter } from './routes/products.js'
// import path from 'path'
// import fs from 'fs'

const PORT = process.env.PORT ?? 1234
const app = express()

app.use(json())

app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:1234',
      'http://localhost:5173'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))

app.disable('x-powered-by')

app.use('/products', productsRouter)

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})