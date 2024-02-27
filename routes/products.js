import { Router } from "express";
import { MovieController } from "../controller/movies.js";

export const productsRouter = Router()

productsRouter.get('/', MovieController.getAll)
productsRouter.get('/:id', MovieController.getById)
productsRouter.post('/', MovieController.create)
productsRouter.patch('/:id', MovieController.update)
productsRouter.delete('/:id', MovieController.delete)