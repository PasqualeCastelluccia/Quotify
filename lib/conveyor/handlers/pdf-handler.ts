import { handle } from '@/lib/main/shared'
import { prisma } from '@/lib/database/prisma'
import { generateQuotePDF } from '@/lib/main/utils/pdf-generator'
import { dialog } from 'electron'
import fs from 'fs'


export const registerPdfHandlers = () => {
  handle('pdf:generateQuote', async (quoteId: number) => {
    try {
      const quote = await prisma.quote.findUnique({
        where: { id: quoteId },
        include: { items: true },
      })

      if (!quote) {
        return {
          success: false,
          error: 'Quote not found',
        }
      }

      const tempPdfPath = await generateQuotePDF({
        quote: {
          id: quote.id,
          number: quote.number,
          revision: quote.revision,
          date: quote.date,
          companyProfileId: quote.companyProfileId || undefined,
          customerBusinessName: quote.customerBusinessName,
          customerEmail: quote.customerEmail || undefined,
          customerVatNumber: quote.customerVatNumber || undefined,
          customerAddress: quote.customerAddress || undefined,
          customerZipCode: quote.customerZipCode || undefined,
          customerCity: quote.customerCity || undefined,
          subtotal: quote.subtotal,
          totalVat: quote.totalVat,
          total: quote.total,
          notes: quote.notes || undefined,
          metadata: quote.metadata || undefined,
          status: quote.status,
        },
        items: quote.items.map((item) => ({
          code: item.code,
          measure: item.measure || undefined,
          description: item.description,
          unit: item.unit,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount1: item.discount1 || 0,
          discount2: item.discount2 || 0,
          discount3: item.discount3 || 0,
          netUnitPrice: item.netUnitPrice,
          netLineTotal: item.netLineTotal,
        })),
      })

      // Show save dialog
      const defaultFileName = `preventivo_${quote.number}_rev${quote.revision}.pdf`
      const { filePath, canceled } = await dialog.showSaveDialog({
        title: 'Salva preventivo',
        defaultPath: defaultFileName,
        filters: [
          { name: 'PDF', extensions: ['pdf'] },
          { name: 'Tutti i file', extensions: ['*'] },
        ],
      })

      if (canceled || !filePath) {
        // User canceled, remove temp file
        fs.unlinkSync(tempPdfPath)
        return {
          success: false,
          error: 'Salvataggio annullato',
        }
      }

      // Copy temp file to chosen location
      fs.copyFileSync(tempPdfPath, filePath)
      fs.unlinkSync(tempPdfPath)

      return {
        success: true,
        path: filePath,
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
