import { readJSON } from './utils.js'
import { randomUUID } from 'node:crypto'
import { validateProduct, validatePartialProduct } from '../schema/products.js'

const products = readJSON('../productos.json')

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      return products.filter(
        product => product.genre.some(g => g.toLowerCase() == genre.toLowerCase())
      )
    }
    return products
  }
  static async getById (req, res) {
      const { id } = req.params
      const product = products.find(product => product.id == id)
      if (product) return res.json(product)
    
      res.status(404).json({message : 'Product not found'})
  }
  static async create (req, res) {
      const result = validateProduct(req.body)
    
      if (!result.success) {
        // 422 Unprocessable Entity
        return res.status(400).json({ error: JSON.parse(result.error.message) })
      }
    
      // en base de datos
      const newProduct = {
        id: randomUUID(), // uuid v4
        ...result.data
      }
    
      // Esto no sería REST, porque estamos guardando
      // el estado de la aplicación en memoria
      products.push(newProduct)
    
      res.status(201).json(newProduct)
  }
  static async update (req, res) {
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
  }
  static async delete (req, res) {
      const { id } = req.params
      const productIndex = products.findIndex(product => product.id === id)
    
      if (productIndex === -1) {
        return res.status(404).json({ message: 'product not found' })
      }
    
      products.splice(productIndex, 1)
    
      return res.json({ message: 'product deleted' })
  }
}