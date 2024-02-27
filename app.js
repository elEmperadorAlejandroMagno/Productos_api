import express, { json } from 'express'
import { corsMiddleware } from './midleware/cors.js'
import { productsRouter } from './routes/products.js'
// import path from 'path'
// import fs from 'fs'

const PORT = process.env.PORT ?? 1234
const app = express()

app.use(json())

app.disable('x-powered-by')

app.use('/products', productsRouter)

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})