import z from 'zod'

const productSchema = z.object({
  nombre1: z.string({
    invalid_type_error: 'Product title must be a string',
    required_error: 'Product title is required.'
  }),
  precio1: z.number().int().min(1).max(4000),
  ingredientes: z.string(),
  picante1: z.string(),
  moneda: z.array(
    z.enum(['Uru, "Ars', 'Usd']),
  {
    required_error: 'moneda is required.',
    invalid_type_error: 'moneda must be an array of enum moneda'
  }),
  imagen1: z.string().url({
    message: 'Poster must be a valid URL'
  }),
  genre: z.array(
    z.enum(['Salsa picante', 'Merch']),
    {
      required_error: 'Product tipo is required.',
      invalid_type_error: 'Product tipo must be an array of enum Tipo'
    }
  )
})

export function validateProduct (input) {
  return productSchema.safeParse(input)
}

export function validatePartialProduct (input) {
  return productSchema.partial().safeParse(input)
}