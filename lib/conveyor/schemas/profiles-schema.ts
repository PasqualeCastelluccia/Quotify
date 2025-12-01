import { z } from 'zod'
import { CompanyProfileSchema } from '@/lib/generated/zod'

const successResponseSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
})

const createResponseSchema = z.object({
  success: z.boolean(),
  id: z.number().optional(),
  error: z.string().optional(),
})

export const profilesIpcSchema = {
  'quotify-profiles:getAll': {
    args: z.tuple([]),
    return: z.array(CompanyProfileSchema),
  },
  'quotify-profiles:getById': {
    args: z.tuple([z.number()]),
    return: CompanyProfileSchema.nullable(),
  },
  'quotify-profiles:getDefault': {
    args: z.tuple([]),
    return: CompanyProfileSchema.nullable(),
  },
  'quotify-profiles:create': {
    args: z.tuple([CompanyProfileSchema.omit({ id: true, createdAt: true, updatedAt: true })]),
    return: createResponseSchema,
  },
  'quotify-profiles:update': {
    args: z.tuple([CompanyProfileSchema.omit({ createdAt: true, updatedAt: true }).partial().required({ id: true })]),
    return: successResponseSchema,
  },
  'quotify-profiles:delete': {
    args: z.tuple([z.number()]),
    return: successResponseSchema,
  },
  'quotify-profiles:setDefault': {
    args: z.tuple([z.number()]),
    return: successResponseSchema,
  },
}
