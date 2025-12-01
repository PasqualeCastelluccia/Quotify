import { z } from 'zod'

export const createQuoteSchema = z
  .object({
    quoteNumber: z.number().positive('Numero preventivo obbligatorio'),
    quoteDate: z.string().min(1, 'Data preventivo obbligatoria'),
    selectedProfileId: z.number({
      required_error: 'Seleziona un profilo aziendale',
    }),
    selectedCustomer: z
      .object({
        id: z.number(),
        businessName: z.string(),
      })
      .nullable(),
    rows: z.array(z.any()).min(1, 'Aggiungi almeno una riga al preventivo'),
  })
  .refine((data) => data.selectedCustomer !== null, {
    message: 'Cliente obbligatorio',
    path: ['selectedCustomer'],
  })

export type CreateQuoteFormData = z.infer<typeof createQuoteSchema>
