import { z } from "zod"

export const clienteSchema = z.object({
  businessName: z.string().min(2, "Ragione Sociale deve avere almeno 2 caratteri"),
  email: z.string().email("Email non valida"),
  vatNumber: z.string().min(1, "Partita IVA è obbligatoria"),
  address: z.string().optional().or(z.literal("")),
  zipCode: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
})

export type ClienteFormData = z.infer<typeof clienteSchema>
