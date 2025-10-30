import { handle } from '@/lib/main/shared'
import { db } from '@/lib/database/db'
import { generatePreventivoPDF } from '@/lib/main/utils/pdf-generator'
import { shell } from 'electron'

interface Preventivo {
  id: number
  numero: string
  data: string
  companyProfileId?: number
  clienteBusinessName: string
  clienteEmail?: string
  clienteVatNumber?: string
  clienteAddress?: string
  clienteZipCode?: string
  clienteCity?: string
  subtotal: number
  totalVat: number
  total: number
  notes?: string
  metadata?: string
  status: string
}

interface PreventivoItem {
  code: string
  measure?: string
  description: string
  unit: string
  quantity: number
  unitPrice: number
  discount1: number
  discount2: number
  discount3: number
  netUnitPrice: number
  netLineTotal: number
}

export const registerPdfHandlers = () => {
  handle('pdf:generatePreventivo', async (preventivoId: number) => {
    try {
      const preventivoStmt = db.prepare('SELECT * FROM preventivi WHERE id = ?')
      const preventivo = preventivoStmt.get(preventivoId) as Preventivo | undefined

      if (!preventivo) {
        return {
          success: false,
          error: 'Preventivo not found',
        }
      }

      const itemsStmt = db.prepare('SELECT * FROM preventivi_items WHERE preventivoId = ? ORDER BY ordering')
      const items = itemsStmt.all(preventivoId) as PreventivoItem[]

      const pdfPath = await generatePreventivoPDF({
        preventivo,
        items,
      })

      await shell.openPath(pdfPath)

      return {
        success: true,
        path: pdfPath,
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })
}
