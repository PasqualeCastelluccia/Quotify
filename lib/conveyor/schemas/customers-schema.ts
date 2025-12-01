import { z } from 'zod'
import { CustomerSchema } from '@/lib/generated/zod'

const successResponseSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
})

const createResponseSchema = z.object({
  success: z.boolean(),
  id: z.number().optional(),
  error: z.string().optional(),
})

export const customersIpcSchema = {
  'customers:create': {
    args: z.tuple([CustomerSchema.omit({ id: true, createdAt: true, updatedAt: true })]),
    return: createResponseSchema,
  },
  'customers:getAll': {
    args: z.tuple([]),
    return: z.array(CustomerSchema),
  },
  'customers:getById': {
    args: z.tuple([z.number()]),
    return: CustomerSchema.nullable(),
  },
  'customers:update': {
    args: z.tuple([z.number(), CustomerSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial()]),
    return: successResponseSchema,
  },
  'customers:delete': {
    args: z.tuple([z.number()]),
    return: successResponseSchema,
  },
}
