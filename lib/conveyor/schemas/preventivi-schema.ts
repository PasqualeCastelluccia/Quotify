import { z } from 'zod'

const preventivoItemSchema = z.object({
  id: z.number(),
  preventivoId: z.number(),
  ordering: z.number(),
  prodottoId: z.number().nullish(),
  code: z.string(),
  measure: z.string().nullish(),
  description: z.string(),
  unit: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  lineTotal: z.number(),
  discount1: z.number(),
  discount2: z.number(),
  discount3: z.number(),
  netUnitPrice: z.number(),
  netLineTotal: z.number(),
  vatRate: z.number(),
  vatAmount: z.number(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
})

const preventivoSchema = z.object({
  id: z.number(),
  numero: z.string(),
  data: z.string(),
  companyProfileId: z.number().nullish(),
  clienteId: z.number().nullish(),
  clienteBusinessName: z.string(),
  clienteEmail: z.string().nullish(),
  clienteVatNumber: z.string().nullish(),
  clienteAddress: z.string().nullish(),
  clienteZipCode: z.string().nullish(),
  clienteCity: z.string().nullish(),
  subtotal: z.number(),
  totalVat: z.number(),
  total: z.number(),
  notes: z.string().nullish(),
  metadata: z.string().nullish(),
  status: z.string(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
})

const preventivoWithItemsSchema = preventivoSchema.extend({
  items: z.array(preventivoItemSchema),
})

const successResponseSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
})

const createResponseSchema = z.object({
  success: z.boolean(),
  id: z.number().optional(),
  error: z.string().optional(),
})

const nextNumberResponseSchema = z.object({
  success: z.boolean(),
  numero: z.string().optional(),
  error: z.string().optional(),
})

export const preventiviIpcSchema = {
  'preventivi:create': {
    args: z.tuple([
      preventivoSchema.omit({ id: true, createdAt: true, updatedAt: true }),
      z.array(preventivoItemSchema.omit({ id: true, preventivoId: true, createdAt: true, updatedAt: true })),
    ]),
    return: createResponseSchema,
  },
  'preventivi:getAll': {
    args: z.tuple([]),
    return: z.array(preventivoSchema),
  },
  'preventivi:getById': {
    args: z.tuple([z.number()]),
    return: preventivoWithItemsSchema.nullable(),
  },
  'preventivi:update': {
    args: z.tuple([
      z.number(),
      preventivoSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial(),
      z.array(preventivoItemSchema.omit({ id: true, preventivoId: true, createdAt: true, updatedAt: true })).optional(),
    ]),
    return: successResponseSchema,
  },
  'preventivi:delete': {
    args: z.tuple([z.number()]),
    return: successResponseSchema,
  },
  'preventivi:getNextNumber': {
    args: z.tuple([]),
    return: nextNumberResponseSchema,
  },
}
