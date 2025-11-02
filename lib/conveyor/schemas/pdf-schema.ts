import { z } from 'zod'

const pdfResponseSchema = z.object({
  success: z.boolean(),
  path: z.string().optional(),
  error: z.string().optional(),
})

export const pdfIpcSchema = {
  'pdf:generatePreventivo': {
    args: z.tuple([z.number()]),
    return: pdfResponseSchema,
  },
}
