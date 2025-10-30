import { handle } from '@/lib/main/shared'
import { db } from '@/lib/database/db'

interface Cliente {
  id: number
  businessName: string
  email: string
  vatNumber: string
  address?: string
  zipCode?: string
  city?: string
  createdAt?: number
  updatedAt?: number
}

export const registerClientiHandlers = () => {
  // Create a new cliente
  handle('clienti:create', async (clienteData) => {
    try {
      const stmt = db.prepare(`
        INSERT INTO clienti (businessName, email, vatNumber, address, zipCode, city)
        VALUES (@businessName, @email, @vatNumber, @address, @zipCode, @city)
      `)

      const result = stmt.run({
        businessName: clienteData.businessName,
        email: clienteData.email,
        vatNumber: clienteData.vatNumber,
        address: clienteData.address || null,
        zipCode: clienteData.zipCode || null,
        city: clienteData.city || null,
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

  // Get all clienti
  handle('clienti:getAll', async () => {
    const stmt = db.prepare('SELECT * FROM clienti ORDER BY createdAt DESC')
    return stmt.all() as Cliente[]
  })

  // Get cliente by ID
  handle('clienti:getById', async (id) => {
    const stmt = db.prepare('SELECT * FROM clienti WHERE id = ?')
    return (stmt.get(id) as Cliente) || null
  })

  // Update a cliente
  handle('clienti:update', async (id, updateData) => {
    try {
      // Build dynamic SET clause based on provided fields
      const fields = Object.keys(updateData).filter(key => updateData[key as keyof typeof updateData] !== undefined)

      if (fields.length === 0) {
        return { success: false, error: 'Nessun campo da aggiornare' }
      }

      const setClause = fields.map(field => `${field} = @${field}`).join(', ')
      const query = `UPDATE clienti SET ${setClause}, updatedAt = unixepoch() WHERE id = @id`

      const stmt = db.prepare(query)
      const result = stmt.run({ id, ...updateData })

      if (result.changes === 0) {
        return {
          success: false,
          error: 'Cliente non trovato',
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

  // Delete a cliente
  handle('clienti:delete', async (id) => {
    try {
      const stmt = db.prepare('DELETE FROM clienti WHERE id = ?')
      const result = stmt.run(id)

      if (result.changes === 0) {
        return {
          success: false,
          error: 'Cliente non trovato',
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
