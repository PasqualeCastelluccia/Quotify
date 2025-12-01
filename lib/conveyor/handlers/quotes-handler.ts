import { handle } from '@/lib/main/shared'
import { prisma } from '@/lib/database/prisma'
import { generateQuoteHTML } from '@/lib/main/utils/pdf-generator'

export const registerQuotesHandlers = () => {
  handle('quotes:create', async (quoteData, items) => {
    try {
      const result = await prisma.quote.create({
        data: {
          number: quoteData.number,
          revision: quoteData.revision,
          date: quoteData.date,
          customerId: quoteData.customerId || null,
          customerBusinessName: quoteData.customerBusinessName,
          customerEmail: quoteData.customerEmail || null,
          customerVatNumber: quoteData.customerVatNumber || null,
          customerAddress: quoteData.customerAddress || null,
          customerZipCode: quoteData.customerZipCode || null,
          customerCity: quoteData.customerCity || null,
          subtotal: quoteData.subtotal,
          totalVat: quoteData.totalVat,
          total: quoteData.total,
          notes: quoteData.notes || null,
          metadata: quoteData.metadata || null,
          status: quoteData.status,
          companyProfileId: quoteData.companyProfileId || null,
          createdAt: Math.floor(Date.now() / 1000),
          updatedAt: Math.floor(Date.now() / 1000),
          items: {
            create: items.map((item: any) => ({
              ordering: item.ordering,
              productId: item.productId || null,
              code: item.code,
              measure: item.measure || null,
              description: item.description,
              unit: item.unit,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              lineTotal: item.lineTotal,
              discount1: item.discount1 || 0,
              discount2: item.discount2 || 0,
              discount3: item.discount3 || 0,
              netUnitPrice: item.netUnitPrice,
              netLineTotal: item.netLineTotal,
              vatRate: item.vatRate || 22.0,
              vatAmount: item.vatAmount,
              createdAt: Math.floor(Date.now() / 1000),
              updatedAt: Math.floor(Date.now() / 1000),
            })),
          },
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

  handle('quotes:getAll', async () => {
    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return quotes.map((q) => ({
      id: q.id,
      number: q.number,
      revision: q.revision,
      date: q.date,
      customerId: q.customerId,
      customerBusinessName: q.customerBusinessName,
      customerEmail: q.customerEmail,
      customerVatNumber: q.customerVatNumber,
      customerAddress: q.customerAddress,
      customerZipCode: q.customerZipCode,
      customerCity: q.customerCity,
      subtotal: q.subtotal,
      totalVat: q.totalVat,
      total: q.total,
      notes: q.notes,
      metadata: q.metadata,
      status: q.status,
      companyProfileId: q.companyProfileId,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
    }))
  })

  handle('quotes:getById', async (id) => {
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: { items: true },
    })

    if (!quote) return null

    return {
      id: quote.id,
      number: quote.number,
      revision: quote.revision,
      date: quote.date,
      customerId: quote.customerId,
      customerBusinessName: quote.customerBusinessName,
      customerEmail: quote.customerEmail,
      customerVatNumber: quote.customerVatNumber,
      customerAddress: quote.customerAddress,
      customerZipCode: quote.customerZipCode,
      customerCity: quote.customerCity,
      subtotal: quote.subtotal,
      totalVat: quote.totalVat,
      total: quote.total,
      notes: quote.notes,
      metadata: quote.metadata,
      status: quote.status,
      companyProfileId: quote.companyProfileId,
      createdAt: quote.createdAt,
      updatedAt: quote.updatedAt,
      items: quote.items.map((item) => ({
        id: item.id,
        quoteId: item.quoteId,
        ordering: item.ordering,
        productId: item.productId,
        code: item.code,
        measure: item.measure,
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
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    }
  })

  handle('quotes:delete', async (id) => {
    try {
      await prisma.quote.delete({
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

  handle('quotes:getByCustomerId', async (customerId) => {
    if (!customerId) {
      return []
    }

    const quotes = await prisma.quote.findMany({
      where: { customerId: customerId },
      orderBy: { createdAt: 'desc' },
    })

    return quotes.map((q) => ({
      id: q.id,
      number: q.number,
      revision: q.revision,
      date: q.date,
      customerId: q.customerId,
      customerBusinessName: q.customerBusinessName,
      customerEmail: q.customerEmail,
      customerVatNumber: q.customerVatNumber,
      customerAddress: q.customerAddress,
      customerZipCode: q.customerZipCode,
      customerCity: q.customerCity,
      subtotal: q.subtotal,
      totalVat: q.totalVat,
      total: q.total,
      notes: q.notes,
      metadata: q.metadata,
      status: q.status,
      companyProfileId: q.companyProfileId,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
    }))
  })

  handle('quotes:getNextNumber', async () => {
    try {
      const lastQuote = await prisma.quote.findFirst({
        orderBy: { number: 'desc' },
      })

      let nextNumber = 1
      if (lastQuote) {
        const currentNum = lastQuote.number
        if (currentNum) {
          nextNumber = currentNum + 1
        }
      }

      return {
        success: true,
        number: nextNumber,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })

  handle('quotes:getNextRevision', async (quoteNumber: number) => {
    try {
      const lastRevision = await prisma.quote.findFirst({
        where: { number: quoteNumber },
        orderBy: { revision: 'desc' },
      })

      let nextRevision = 0
      if (lastRevision) {
        nextRevision = lastRevision.revision + 1
      }

      return {
        success: true,
        revision: nextRevision,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })

  handle('quotes:generatePreviewHTML', async (quoteData: any, items: any[]) => {
    try {
      const html = await generateQuoteHTML({
        quote: quoteData,
        items: items,
      })

      return {
        success: true,
        html: html,
      }
    } catch (error) {
      console.error('Error generating preview HTML:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })
}
