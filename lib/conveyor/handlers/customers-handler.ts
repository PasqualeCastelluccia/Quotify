import { handle } from '@/lib/main/shared'
import { prisma } from '@/lib/database/prisma'

export const registerCustomersHandlers = () => {
  handle('customers:create', async (customerData) => {
    try {
      const result = await prisma.customer.create({
        data: {
          businessName: customerData.businessName,
          email: customerData.email,
          vatNumber: customerData.vatNumber,
          address: customerData.address || null,
          zipCode: customerData.zipCode || null,
          city: customerData.city || null,
          createdAt: Math.floor(Date.now() / 1000),
          updatedAt: Math.floor(Date.now() / 1000),
        },
      })

      return {
        success: true,
        id: result.id,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })

  handle('customers:getAll', async () => {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return customers
  })

  handle('customers:getById', async (id) => {
    const customer = await prisma.customer.findUnique({
      where: { id },
    })
    return customer || null
  })

  handle('customers:update', async (id, updateData) => {
    try {
      const fieldsToUpdate: any = {}

      if (updateData.businessName !== undefined) fieldsToUpdate.businessName = updateData.businessName
      if (updateData.email !== undefined) fieldsToUpdate.email = updateData.email
      if (updateData.vatNumber !== undefined) fieldsToUpdate.vatNumber = updateData.vatNumber
      if (updateData.address !== undefined) fieldsToUpdate.address = updateData.address
      if (updateData.zipCode !== undefined) fieldsToUpdate.zipCode = updateData.zipCode
      if (updateData.city !== undefined) fieldsToUpdate.city = updateData.city

      if (Object.keys(fieldsToUpdate).length === 0) {
        return { success: false, error: 'No fields to update' }
      }

      fieldsToUpdate.updatedAt = Math.floor(Date.now() / 1000)

      await prisma.customer.update({
        where: { id },
        data: fieldsToUpdate,
      })

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })

  handle('customers:delete', async (id) => {
    try {
      await prisma.customer.delete({
        where: { id },
      })

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })
}
