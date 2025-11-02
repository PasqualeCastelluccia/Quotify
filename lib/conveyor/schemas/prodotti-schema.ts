import { z } from 'zod'

// Prodotto type schema
const prodottoSchema = z.object({
  id: z.number(),
  codice: z.string(),
  descrizione: z.string().nullish(),
  misura: z.string().nullish(),
  prezzo: z.number(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
})

// Response schemas
const successResponseSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
})

const createResponseSchema = z.object({
  success: z.boolean(),
  id: z.number().optional(),
  error: z.string().optional(),
})

const paginatedResponseSchema = z.object({
  data: z.array(prodottoSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
})

export const prodottiIpcSchema = {
  'prodotti:create': {
    args: z.tuple([prodottoSchema.omit({ id: true, createdAt: true, updatedAt: true })]),
    return: createResponseSchema,
  },
  'prodotti:getAll': {
    args: z.tuple([]),
    return: z.array(prodottoSchema),
  },
  'prodotti:getPaginated': {
    args: z.tuple([z.number().default(1), z.number().default(10), z.string().default('')]),
    return: paginatedResponseSchema,
  },
  'prodotti:getById': {
    args: z.tuple([z.number()]),
    return: prodottoSchema.nullable(),
  },
  'prodotti:update': {
    args: z.tuple([
      z.number(),
      prodottoSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial(),
    ]),
    return: successResponseSchema,
  },
  'prodotti:delete': {
    args: z.tuple([z.number()]),
    return: successResponseSchema,
  },
}
