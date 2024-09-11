import { MovieModel } from "../models/local/movies.js";
// import { MovieModel } from "../models/mysql_db/movies.js";
import { validatePartialProduct, validateProduct } from "../schema/products.js";

export class MovieController {
  static async getAll (req, res) {
    const { type } = req.query
    const products = await MovieModel.getAll({ type })
    res.json(products)
  }
  static async getById (req, res) {
    const { id } = req.params
    const product = await MovieModel.getById({ id })
    if (product) return res.json(product)
    res.status(404).json({message : 'Product not found'})
  }
  static async create (req, res) {
    const result = validateProduct(req.body)
    
      if (!result.success) {
        // 422 Unprocessable Entity
        return res.status(400).json({ error: JSON.parse(result.error.message) })
      }
    const newProduct = await MovieModel.create({ input: result.data })

    res.status(201).json(newProduct)
  }
  static async update (req, res) {
    const result = validatePartialProduct(req.body)
    
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params

    const updatedProduct = await MovieModel.update({ id, input: result.data })

    return res.json(updatedProduct)
  }
  static async delete (req, res) {
    const { id } = req.params
    const result = await MovieModel.delete({ id })

    if (result === false) {
      return res.status(404).json({ message: 'Product not found' })
    }
    return res.status(200).json({ message: 'Product deleted' })
  }
}