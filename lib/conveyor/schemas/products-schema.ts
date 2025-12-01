import { z } from 'zod'
import { ProductSchema } from '@/app/types/product'

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
  data: z.array(ProductSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
})

export const productsIpcSchema = {
  'products:create': {
    args: z.tuple([ProductSchema.omit({ id: true, createdAt: true, updatedAt: true })]),
    return: createResponseSchema,
  },
  'products:getAll': {
    args: z.tuple([]),
    return: z.array(ProductSchema),
  },
  'products:getPaginated': {
    args: z.tuple([z.number().default(1), z.number().default(10), z.string().default('')]),
    return: paginatedResponseSchema,
  },
  'products:getById': {
    args: z.tuple([z.number()]),
    return: ProductSchema.nullable(),
  },
  'products:update': {
    args: z.tuple([z.number(), ProductSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial()]),
    return: successResponseSchema,
  },
  'products:delete': {
    args: z.tuple([z.number()]),
    return: successResponseSchema,
  },
}
