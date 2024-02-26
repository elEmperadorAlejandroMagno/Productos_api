import { MovieModel } from "../models/movies.js";
import { validatePartialProduct, validateProduct } from "../schema/products.js";

export class MovieController {
  static async getAll (req, res) {
    const { genre } = req.query
    const products = await MovieModel.getAll({ genre })

    res.json(products)
  }
}