import { z } from 'zod'
import { QuoteSchema } from '@/lib/generated/zod'

const successResponseSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
})

const createResponseSchema = z.object({
  success: z.boolean(),
  id: z.number().optional(),
  error: z.string().optional(),
})

/* const quoteDataSchema = z.object({
  numero: z.string(),
  data: z.string(),
  clienteId: z.number().optional(),
  clienteBusinessName: z.string(),
  clienteEmail: z.string().optional(),
  clienteVatNumber: z.string().optional(),
  clienteAddress: z.string().optional(),
  clienteZipCode: z.string().optional(),
  clienteCity: z.string().optional(),
  subtotal: z.number(),
  totalVat: z.number(),
  total: z.number(),
  notes: z.string().optional(),
  metadata: z.string().optional(),
  status: z.string().optional(),
  companyProfileId: z.number().optional(),
}) */

const quoteItemSchema = z.object({
  id: z.number().optional(),
  quoteId: z.number().optional(),
  ordering: z.number(),
  productId: z.number().optional().nullable(),
  code: z.string(),
  measure: z.string().optional().nullable(),
  description: z.string().nullable(),
  unit: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  lineTotal: z.number(),
  discount1: z.number(),
  discount2: z.number(),
  discount3: z.number(),
  netUnitPrice: z.number(),
  netLineTotal: z.number(),
  vatRate: z.number().nullable(),
  vatAmount: z.number(),
  createdAt: z.number().optional().nullable(),
  updatedAt: z.number().optional().nullable(),
})

const quoteWithItemsSchema = QuoteSchema.extend({
  items: z.array(quoteItemSchema),
})

const successResponseGetNextNumberSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
  number: z.number()
})

const successResponseGetNextRevisionSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
  revision: z.number()
})

const successResponseGeneratePreviewHTMLSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
  html: z.string().optional()
})

export const quotesIpcSchema = {
  'quotes:create': {
    args: z.tuple([QuoteSchema.omit({ id: true, createdAt: true, updatedAt: true }), z.array(quoteItemSchema)]),
    return: createResponseSchema,
  },
  'quotes:getAll': {
    args: z.tuple([]),
    return: z.array(QuoteSchema),
  },
  'quotes:getById': {
    args: z.tuple([z.number()]),
    return: quoteWithItemsSchema.nullable(),
  },
  'quotes:getByCustomerId': {
    args: z.tuple([z.number()]),
    return: z.array(QuoteSchema),
  },
  'quotes:update': {
    args: z.tuple([z.number(), QuoteSchema.partial(), z.array(quoteItemSchema).optional()]),
    return: successResponseSchema,
  },
  'quotes:delete': {
    args: z.tuple([z.number()]),
    return: successResponseSchema,
  },
  'quotes:getNextNumber': {
    args: z.tuple([]),
    return: successResponseGetNextNumberSchema,
  },
  'quotes:getNextRevision': {
    args: z.tuple([z.number()]),
    return: successResponseGetNextRevisionSchema,
  },
  'quotes:generatePreviewHTML': {
    args: z.tuple([z.any(), z.array(z.any())]),
    return: successResponseGeneratePreviewHTMLSchema,
  },
}
