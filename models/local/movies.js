import { readJSON } from '../../utils.js'
import { randomUUID } from 'node:crypto'

const products = readJSON('./productos.json')

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      return products.filter(
        product => product.genre.some(g => g.toLowerCase() == genre.toLowerCase())
      )
    }
    return products
  }
  static async getById ({ id }) {
      const product = products.find(product => product.id == id)
      return product
  }
  static async create ({ input }) {
      // en base de datos
      const newProduct = {
        id: randomUUID(), // uuid v4
        ...input
      }
      // Esto no sería REST, porque estamos guardando
      // el estado de la aplicación en memoria
      products.push(newProduct)
    
      return newProduct
  }
  static async update ({ id, input }) {
      const productIndex = products.findIndex(product => product.id === id)
      if (productIndex === -1) {
        return res.status(404).json({ message: 'product not found' })
      }
      products[productIndex] = {
        ...products[productIndex],
        ...input
      }
      return products[productIndex]
  }
  static async delete ({ id }) {
      const productIndex = products.findIndex(product => product.id === id)
    
      if (productIndex === -1) return false
    
      products.splice(productIndex, 1)
    
      return true
  }
}