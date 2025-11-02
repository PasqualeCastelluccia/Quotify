import { ConveyorApi } from '@/lib/preload/shared'
import type { Prodotto } from '@/app/types/prodotto'

export class ProdottiApi extends ConveyorApi {
  create = (prodottoData: Omit<Prodotto, 'id' | 'createdAt' | 'updatedAt'>) =>
    this.invoke('prodotti:create', prodottoData)

  getAll = () =>
    this.invoke('prodotti:getAll')

  getPaginated = (page: number = 1, pageSize: number = 10, searchTerm: string = '') =>
    this.invoke('prodotti:getPaginated', page, pageSize, searchTerm)

  getById = (id: number) =>
    this.invoke('prodotti:getById', id)

  update = (id: number, updateData: Partial<Omit<Prodotto, 'id' | 'createdAt' | 'updatedAt'>>) =>
    this.invoke('prodotti:update', id, updateData)

  delete = (id: number) =>
    this.invoke('prodotti:delete', id)
}
