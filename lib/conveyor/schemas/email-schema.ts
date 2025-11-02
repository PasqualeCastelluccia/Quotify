import { z } from 'zod'

const emailDataSchema = z.object({
  preventivoId: z.number(),
  to: z.string().email(),
  subject: z.string(),
  body: z.string(),
})

const emailResponseSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
})

export const emailIpcSchema = {
  'email:sendPreventivo': {
    args: z.tuple([emailDataSchema]),
    return: emailResponseSchema,
  },
}
