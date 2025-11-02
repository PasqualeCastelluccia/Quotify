import { handle } from '@/lib/main/shared'
import { db } from '@/lib/database/db'

interface Preventivo {
  id: number
  numero: string
  data: string
  companyProfileId?: number
  clienteId?: number
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
  createdAt?: number
  updatedAt?: number
}

interface PreventivoItem {
  id: number
  preventivoId: number
  ordering: number
  prodottoId?: number
  code: string
  measure?: string
  description: string
  unit: string
  quantity: number
  unitPrice: number
  lineTotal: number
  discount1: number
  discount2: number
  discount3: number
  netUnitPrice: number
  netLineTotal: number
  vatRate: number
  vatAmount: number
  createdAt?: number
  updatedAt?: number
}

export const registerPreventiviHandlers = () => {
  handle('preventivi:create', async (preventivoData, items) => {
    try {
      const preventivoStmt = db.prepare(`
        INSERT INTO preventivi (
          numero, data, companyProfileId, clienteId, clienteBusinessName, clienteEmail,
          clienteVatNumber, clienteAddress, clienteZipCode, clienteCity,
          subtotal, totalVat, total, notes, metadata, status
        )
        VALUES (
          @numero, @data, @companyProfileId, @clienteId, @clienteBusinessName, @clienteEmail,
          @clienteVatNumber, @clienteAddress, @clienteZipCode, @clienteCity,
          @subtotal, @totalVat, @total, @notes, @metadata, @status
        )
      `)

      const preventivoResult = preventivoStmt.run({
        numero: preventivoData.numero,
        data: preventivoData.data,
        companyProfileId: preventivoData.companyProfileId || null,
        clienteId: preventivoData.clienteId || null,
        clienteBusinessName: preventivoData.clienteBusinessName,
        clienteEmail: preventivoData.clienteEmail || null,
        clienteVatNumber: preventivoData.clienteVatNumber || null,
        clienteAddress: preventivoData.clienteAddress || null,
        clienteZipCode: preventivoData.clienteZipCode || null,
        clienteCity: preventivoData.clienteCity || null,
        subtotal: preventivoData.subtotal,
        totalVat: preventivoData.totalVat,
        total: preventivoData.total,
        notes: preventivoData.notes || null,
        metadata: preventivoData.metadata || null,
        status: preventivoData.status,
      })

      const preventivoId = preventivoResult.lastInsertRowid as number

      const itemStmt = db.prepare(`
        INSERT INTO preventivi_items (
          preventivoId, ordering, prodottoId, code, measure, description, unit,
          quantity, unitPrice, lineTotal, discount1, discount2, discount3,
          netUnitPrice, netLineTotal, vatRate, vatAmount
        )
        VALUES (
          @preventivoId, @ordering, @prodottoId, @code, @measure, @description, @unit,
          @quantity, @unitPrice, @lineTotal, @discount1, @discount2, @discount3,
          @netUnitPrice, @netLineTotal, @vatRate, @vatAmount
        )
      `)

      items.forEach((item, index) => {
        itemStmt.run({
          preventivoId,
          ordering: item.ordering ?? index,
          prodottoId: item.prodottoId || null,
          code: item.code,
          measure: item.measure || null,
          description: item.description,
          unit: item.unit,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal,
          discount1: item.discount1,
          discount2: item.discount2,
          discount3: item.discount3,
          netUnitPrice: item.netUnitPrice,
          netLineTotal: item.netLineTotal,
          vatRate: item.vatRate,
          vatAmount: item.vatAmount,
        })
      })

      return {
        success: true,
        id: preventivoId,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })

  handle('preventivi:getAll', async () => {
    const stmt = db.prepare('SELECT * FROM preventivi ORDER BY createdAt DESC')
    return stmt.all() as Preventivo[]
  })

  handle('preventivi:getById', async (id) => {
    const preventivoStmt = db.prepare('SELECT * FROM preventivi WHERE id = ?')
    const preventivo = preventivoStmt.get(id) as Preventivo | undefined

    if (!preventivo) {
      return null
    }

    const itemsStmt = db.prepare('SELECT * FROM preventivi_items WHERE preventivoId = ? ORDER BY ordering')
    const items = itemsStmt.all(id) as PreventivoItem[]

    return {
      ...preventivo,
      items,
    }
  })

  handle('preventivi:update', async (id, updateData, items) => {
    try {
      if (updateData && Object.keys(updateData).length > 0) {
        const fields = Object.keys(updateData).filter(
          key => updateData[key as keyof typeof updateData] !== undefined
        )

        if (fields.length > 0) {
          const setClause = fields.map(field => `${field} = @${field}`).join(', ')
          const query = `UPDATE preventivi SET ${setClause}, updatedAt = unixepoch() WHERE id = @id`

          const stmt = db.prepare(query)
          const result = stmt.run({ id, ...updateData })

          if (result.changes === 0) {
            return {
              success: false,
              error: 'Preventivo not found',
            }
          }
        }
      }

      if (items) {
        const deleteStmt = db.prepare('DELETE FROM preventivi_items WHERE preventivoId = ?')
        deleteStmt.run(id)

        const itemStmt = db.prepare(`
          INSERT INTO preventivi_items (
            preventivoId, ordering, prodottoId, code, measure, description, unit,
            quantity, unitPrice, lineTotal, discount1, discount2, discount3,
            netUnitPrice, netLineTotal, vatRate, vatAmount
          )
          VALUES (
            @preventivoId, @ordering, @prodottoId, @code, @measure, @description, @unit,
            @quantity, @unitPrice, @lineTotal, @discount1, @discount2, @discount3,
            @netUnitPrice, @netLineTotal, @vatRate, @vatAmount
          )
        `)

        items.forEach((item, index) => {
          itemStmt.run({
            preventivoId: id,
            ordering: item.ordering ?? index,
            prodottoId: item.prodottoId || null,
            code: item.code,
            measure: item.measure || null,
            description: item.description,
            unit: item.unit,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal,
            discount1: item.discount1,
            discount2: item.discount2,
            discount3: item.discount3,
            netUnitPrice: item.netUnitPrice,
            netLineTotal: item.netLineTotal,
            vatRate: item.vatRate,
            vatAmount: item.vatAmount,
          })
        })
      }

      return {
        success: true,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })

  handle('preventivi:delete', async (id) => {
    try {
      const stmt = db.prepare('DELETE FROM preventivi WHERE id = ?')
      const result = stmt.run(id)

      if (result.changes === 0) {
        return {
          success: false,
          error: 'Preventivo not found',
        }
      }

      return {
        success: true,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })

  handle('preventivi:getNextNumber', async () => {
    try {
      // Get the highest preventivo number
      const stmt = db.prepare(`
        SELECT MAX(CAST(numero AS INTEGER)) as maxNumero FROM preventivi
      `)

      const result = stmt.get() as { maxNumero: number | null } | undefined

      console.log('[preventivi:getNextNumber] Last result:', result)

      let nextNumber = 1

      if (result && result.maxNumero !== null) {
        nextNumber = result.maxNumero + 1
      }

      console.log('[preventivi:getNextNumber] Generated number:', nextNumber)

      return {
        success: true,
        numero: nextNumber.toString(),
      }
    } catch (error) {
      console.error('[preventivi:getNextNumber] Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })
}
