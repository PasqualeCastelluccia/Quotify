import { z } from "zod"

export const prodottoSchema = z.object({
  codice: z.string().min(1, "Il codice è obbligatorio"),
  descrizione: z.string().optional(),
  misura: z.string().optional(),
  prezzo: z.coerce.number().positive("Il prezzo deve essere maggiore di zero"),
})

export type ProdottoFormData = z.infer<typeof prodottoSchema>
