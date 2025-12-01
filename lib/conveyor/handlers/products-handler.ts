import { handle } from '@/lib/main/shared'
import { prisma } from '@/lib/database/prisma'

export const registerProductsHandlers = () => {
  handle('products:create', async (productData) => {
    try {
      const result = await prisma.product.create({
        data: {
          code: productData.code,
          description: productData.description || null,
          measure: productData.measure || null,
          price: productData.price,
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

  handle('products:getAll', async () => {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return products
  })

  handle('products:getPaginated', async (page: number = 1, pageSize: number = 10, searchTerm: string = '') => {
    try {
      const skip = (page - 1) * pageSize

      const where = searchTerm
        ? {
            OR: [
              { code: { contains: searchTerm } },
              { description: { contains: searchTerm } },
              { measure: { contains: searchTerm } },
            ],
          }
        : {}

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: pageSize,
        }),
        prisma.product.count({ where }),
      ])

      return {
        success: true,
        data: products,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })

  handle('products:getById', async (id) => {
    const product = await prisma.product.findUnique({
      where: { id },
    })
    return product || null
  })

  handle('products:update', async (id, updateData) => {
    try {
      const fieldsToUpdate: any = {}

      if (updateData.code !== undefined) fieldsToUpdate.code = updateData.code
      if (updateData.description !== undefined) fieldsToUpdate.description = updateData.description
      if (updateData.measure !== undefined) fieldsToUpdate.measure = updateData.measure
      if (updateData.price !== undefined) fieldsToUpdate.price = updateData.price

      if (Object.keys(fieldsToUpdate).length === 0) {
        return { success: false, error: 'No fields to update' }
      }

      fieldsToUpdate.updatedAt = Math.floor(Date.now() / 1000)

      await prisma.product.update({
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

  handle('products:delete', async (id) => {
    try {
      await prisma.product.delete({
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

  handle('products:search', async (searchTerm: string) => {
    try {
      const products = await prisma.product.findMany({
        where: {
          OR: [
            { code: { contains: searchTerm } },
            { description: { contains: searchTerm } },
            { measure: { contains: searchTerm } },
          ],
        },
        orderBy: { code: 'asc' },
        take: 50,
      })

      return {
        success: true,
        data: products,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })
}
