import { ConveyorApi } from '@/lib/preload/shared'

export class QuotesApi extends ConveyorApi {
  create = (quoteData: any, items: any[]) => this.invoke('quotes:create', quoteData, items)

  getAll = () => this.invoke('quotes:getAll')

  getById = (id: number) => this.invoke('quotes:getById', id)

  delete = (id: number) => this.invoke('quotes:delete', id)

  getByCustomerId = (customerId: number) => this.invoke('quotes:getByCustomerId', customerId)

  getNextNumber = () => this.invoke('quotes:getNextNumber')

  getNextRevision = (quoteNumber: number) => this.invoke('quotes:getNextRevision', quoteNumber)

  generatePreviewHTML = (quoteData: any, items: any[]) => this.invoke('quotes:generatePreviewHTML', quoteData, items)
}
