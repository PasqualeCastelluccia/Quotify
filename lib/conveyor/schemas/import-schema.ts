import { z } from 'zod'

const columnMappingSchema = z.object({
  codice: z.string().optional(),
  descrizione: z.string().optional(),
  misura: z.string().optional(),
  prezzo: z.string().optional(),
})

const selectExcelResponseSchema = z.object({
  success: z.boolean(),
  filePath: z.string().optional(),
  columns: z.array(z.string()).optional(),
  columnLetters: z.array(z.string()).optional(),
  previewData: z.array(z.any()).optional(),
  totalRows: z.number().optional(),
  error: z.string().optional(),
})

const importResponseSchema = z.object({
  success: z.boolean(),
  imported: z.number().optional(),
  errors: z.array(z.string()).optional(),
  total: z.number().optional(),
  error: z.string().optional(),
})

export const importIpcSchema = {
  'import:selectExcel': {
    args: z.tuple([]),
    return: selectExcelResponseSchema,
  },
  'import:importProducts': {
    args: z.tuple([z.string(), columnMappingSchema]),
    return: importResponseSchema,
  },
}
