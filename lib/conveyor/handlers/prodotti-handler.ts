import { handle } from '@/lib/main/shared'
import { db } from '@/lib/database/db'

interface Prodotto {
  id: number
  codice: string
  descrizione?: string
  misura?: string
  prezzo: number
  createdAt?: number
  updatedAt?: number
}

export const registerProdottiHandlers = () => {
  // Create a new prodotto
  handle('prodotti:create', async (prodottoData) => {
    try {
      const stmt = db.prepare(`
        INSERT INTO prodotti (codice, descrizione, misura, prezzo)
        VALUES (@codice, @descrizione, @misura, @prezzo)
      `)

      const result = stmt.run({
        codice: prodottoData.codice,
        descrizione: prodottoData.descrizione || null,
        misura: prodottoData.misura || null,
        prezzo: prodottoData.prezzo,
      })

      return {
        success: true,
        id: result.lastInsertRowid as number,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Errore sconosciuto',
      }
    }
  })

  // Get all prodotti (legacy - kept for compatibility)
  handle('prodotti:getAll', async () => {
    const stmt = db.prepare('SELECT * FROM prodotti ORDER BY createdAt DESC')
    return stmt.all() as Prodotto[]
  })

  // Get prodotti with pagination and search
  handle('prodotti:getPaginated', async (page: number = 1, pageSize: number = 10, searchTerm: string = '') => {
    try {
      // Calculate offset
      const offset = (page - 1) * pageSize

      // Build WHERE clause for search
      const hasSearch = searchTerm && searchTerm.trim().length > 0
      const searchPattern = hasSearch ? `%${searchTerm.trim()}%` : ''

      let whereClause = ''
      let params: any[] = []

      if (hasSearch) {
        whereClause = 'WHERE codice LIKE ? OR descrizione LIKE ? OR misura LIKE ?'
        params = [searchPattern, searchPattern, searchPattern]
      }

      // Get total count with search filter
      const countQuery = `SELECT COUNT(*) as total FROM prodotti ${whereClause}`
      const countStmt = db.prepare(countQuery)
      const { total } = (hasSearch ? countStmt.get(...params) : countStmt.get()) as { total: number }

      // Get paginated data with search filter
      const dataQuery = `
        SELECT * FROM prodotti
        ${whereClause}
        ORDER BY createdAt DESC
        LIMIT ? OFFSET ?
      `
      const dataStmt = db.prepare(dataQuery)
      const dataParams = hasSearch ? [...params, pageSize, offset] : [pageSize, offset]
      const data = dataStmt.all(...dataParams) as Prodotto[]

      return {
        data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    } catch (error) {
      console.error('Error in getPaginated:', error)
      return {
        data: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0
      }
    }
  })

  // Get prodotto by ID
  handle('prodotti:getById', async (id) => {
    const stmt = db.prepare('SELECT * FROM prodotti WHERE id = ?')
    return (stmt.get(id) as Prodotto) || null
  })

  // Update a prodotto
  handle('prodotti:update', async (id, updateData) => {
    try {
      // Build dynamic SET clause based on provided fields
      const fields = Object.keys(updateData).filter(key => updateData[key as keyof typeof updateData] !== undefined)

      if (fields.length === 0) {
        return { success: false, error: 'Nessun campo da aggiornare' }
      }

      const setClause = fields.map(field => `${field} = @${field}`).join(', ')
      const query = `UPDATE prodotti SET ${setClause}, updatedAt = unixepoch() WHERE id = @id`

      const stmt = db.prepare(query)
      const result = stmt.run({ id, ...updateData })

      if (result.changes === 0) {
        return {
          success: false,
          error: 'Prodotto non trovato',
        }
      }

      return {
        success: true,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Errore sconosciuto',
      }
    }
  })

  // Delete a prodotto
  handle('prodotti:delete', async (id) => {
    try {
      const stmt = db.prepare('DELETE FROM prodotti WHERE id = ?')
      const result = stmt.run(id)

      if (result.changes === 0) {
        return {
          success: false,
          error: 'Prodotto non trovato',
        }
      }

      return {
        success: true,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Errore sconosciuto',
      }
    }
  })
}
