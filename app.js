import { readJSON } from './utils.js'
import express, { json } from 'express'
import crypto from 'crypto'
import cors from 'cors'
import { validateProduct, validatePartialProduct } from './schema/products.js'
// import path from 'path'
// import fs from 'fs'

const products = readJSON('./productos.json')
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

app.get('/', (req, res) => {
  res.json(products)
})

app.get('/products', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredProducts = products.filter(
      product => product.genre.includes(genre)
    )
    return res.json(filteredProducts)
  }
  res.json(products)
})

app.get('/products/:id', (req, res) => {
  const { id } = req.params
  const product = products.find(product => product.id == id)
  if (product) return res.json(product)

  res.status(404).json({message : 'Product not found'})
})

app.post('/products', (req, res) => {
  const result = validateProduct(req.body)

  if (!result.success) {
    // 422 Unprocessable Entity
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  // en base de datos
  const newProduct = {
    id: crypto.randomUUID(), // uuid v4
    ...result.data
  }

  // Esto no sería REST, porque estamos guardando
  // el estado de la aplicación en memoria
  products.push(newProduct)

  res.status(201).json(newProduct)
})

app.put('/products', (req, res) => {
  // req.body deberíamos guardar en bbdd
  res.status(201).json(req.body)
})

app.patch('/products/:id', (req, res) => {
  const result = validatePartialProduct(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const productIndex = products.findIndex(product => product.id === id)

  if (productIndex === -1) {
    return res.status(404).json({ message: 'product not found' })
  }

  const updateProduct = {
    ...products[productIndex],
    ...result.data
  }

  products[productIndex] = updateProduct

  return res.json(updateProduct)
})

app.delete('/products/:id', (req, res) => {
  const { id } = req.params
  const productIndex = products.findIndex(product => product.id === id)

  if (productIndex === -1) {
    return res.status(404).json({ message: 'product not found' })
  }

  products.splice(productIndex, 1)

  return res.json({ message: 'product deleted' })
})


// la última a la que va a llegar
app.use((req, res) => {
  res.status(404).send('<h1>404</h1>')
})

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})