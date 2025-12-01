import { z } from 'zod'

// Cliente type schema
const clienteSchema = z.object({
  id: z.number(),
  businessName: z.string(),
  email: z.string(),
  vatNumber: z.string(),
  address: z.string().nullish(),
  zipCode: z.string().nullish(),
  city: z.string().nullish(),
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

export const clientiIpcSchema = {
  'clienti:create': {
    args: z.tuple([clienteSchema.omit({ id: true, createdAt: true, updatedAt: true })]),
    return: createResponseSchema,
  },
  'clienti:getAll': {
    args: z.tuple([]),
    return: z.array(clienteSchema),
  },
  'clienti:getById': {
    args: z.tuple([z.number()]),
    return: clienteSchema.nullable(),
  },
  'clienti:update': {
    args: z.tuple([z.number(), clienteSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial()]),
    return: successResponseSchema,
  },
  'clienti:delete': {
    args: z.tuple([z.number()]),
    return: successResponseSchema,
  },
}
