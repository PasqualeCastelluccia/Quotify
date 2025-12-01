import { handle } from '@/lib/main/shared'
import { dialog } from 'electron'
import * as XLSX from 'xlsx'
import fs from 'fs'
import { prisma } from '@/lib/database/prisma'

interface ColumnMapping {
  code?: string
  description?: string
  measure?: string
  price?: string
}

export const registerImportHandlers = () => {
  // Open file dialog and read Excel columns
  handle('import:selectExcel', async () => {
    try {
      const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Excel Files', extensions: ['xlsx', 'xls', 'csv'] }],
      })

      if (result.canceled || result.filePaths.length === 0) {
        return {
          success: false,
          error: 'Nessun file selezionato',
        }
      }

      const filePath = result.filePaths[0]
      const fileBuffer = fs.readFileSync(filePath)
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' })

      // Get first sheet
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]

      // Convert to JSON to get column names
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

      if (jsonData.length === 0) {
        return {
          success: false,
          error: 'Il file Excel è vuoto',
        }
      }

      // First row contains column names
      const rawColumns = jsonData[0] as any[]

      // Create columns with indices to handle merged cells properly
      const columnsWithIndex: { name: string; letter: string; index: number }[] = []
      rawColumns.forEach((col, idx) => {
        const colName = col !== undefined && col !== null && col !== '' ? String(col).trim() : ''
        if (colName) {
          const columnLetter = String.fromCharCode(65 + idx) // A=65 in ASCII
          columnsWithIndex.push({
            name: colName,
            letter: columnLetter,
            index: idx,
          })
        }
      })

      // Check if we found valid column headers
      if (columnsWithIndex.length === 0) {
        return {
          success: false,
          error:
            'Nessuna intestazione trovata alla riga 1. Assicurati che il file Excel abbia i nomi delle colonne nella prima riga. Se le intestazioni sono in una riga diversa, modifica il file Excel e riprova.',
        }
      }

      const columns = columnsWithIndex.map((c) => c.name)
      const columnLetters = columnsWithIndex.map((c) => c.letter)

      const previewData = jsonData.slice(1, 6).map((row) => {
        const mappedRow: any = {}
        columnsWithIndex.forEach((col) => {
          mappedRow[col.name] = (row as any[])[col.index]
        })
        return mappedRow
      })

      return {
        success: true,
        filePath,
        columns,
        columnLetters,
        previewData,
        totalRows: jsonData.length - 1, // Exclude header
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Errore nella lettura del file',
      }
    }
  })

  // Import products with column mapping
  handle('import:importProducts', async (filePath: string, columnMapping: ColumnMapping) => {
    try {
      console.log(columnMapping);
      const fileBuffer = fs.readFileSync(filePath)
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' })

      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]

      // Convert to JSON as array of arrays to preserve column indices
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

      if (jsonData.length <= 1) {
        return {
          success: false,
          error: 'Nessun dato da importare',
        }
      }

      // Skip header row
      const dataRows = jsonData.slice(1) as any[][]

      let imported = 0
      let errors: string[] = []

      console.log("==================", columnMapping);

      const getColumnIndex = (columnName?: string): number | null => {
        if (!columnName) return null
        const parts = columnName.split('|')
        if (parts.length === 2) {
          return parts[1].charCodeAt(0) - 65 // Convert A->0, B->1, etc.
        }
        return null
      }

      const codeIdx = getColumnIndex(columnMapping.code)
      const descriptionIdx = getColumnIndex(columnMapping.description)
      const measureIdx = getColumnIndex(columnMapping.measure)
      const priceIdx = getColumnIndex(columnMapping.price)

      if (codeIdx === null || priceIdx === null) {
        return {
          success: false,
          error: 'Mapping colonne non valido: codice e prezzo sono obbligatori',
        }
      }

      const productsToInsert: Array<{
        code: string
        description: string | null
        measure: string | null
        price: number
        createdAt: number
        updatedAt: number
      }> = []

      for (let i = 0; i < dataRows.length; i++) {
        try {
          const row = dataRows[i]
          const code = row[codeIdx]
          const priceStr = row[priceIdx]
          const price = priceStr !== undefined && priceStr !== null ? parseFloat(String(priceStr)) : null

          // Validate required fields
          if (!code || !price || isNaN(price)) {
            errors.push(`Riga ${i + 2} saltata: codice o prezzo mancante/invalido`)
            continue
          }

          productsToInsert.push({
            code: String(code),
            description: descriptionIdx !== null && row[descriptionIdx] ? String(row[descriptionIdx]) : null,
            measure: measureIdx !== null && row[measureIdx] ? String(row[measureIdx]) : null,
            price: price,
            createdAt: Math.floor(Date.now() / 1000),
            updatedAt: Math.floor(Date.now() / 1000),
          })

          imported++
        } catch (error) {
          errors.push(`Errore riga ${i + 2}: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`)
        }
      }

      if (productsToInsert.length > 0) {
        await prisma.product.createMany({
          data: productsToInsert,
        })
      }

      return {
        success: true,
        imported,
        errors: errors.length > 0 ? errors : undefined,
        total: dataRows.length,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Errore nell'importazione",
      }
    }
  })
}
