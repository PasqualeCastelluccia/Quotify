import { ConveyorApi } from '@/lib/preload/shared'
import type { Product } from '@/app/types/product'

export class ProductsApi extends ConveyorApi {
  create = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) =>
    this.invoke('products:create', productData)

  getAll = () => this.invoke('products:getAll')

  getPaginated = (page: number = 1, pageSize: number = 10, searchTerm: string = '') =>
    this.invoke('products:getPaginated', page, pageSize, searchTerm)

  getById = (id: number) => this.invoke('products:getById', id)

  update = (id: number, updateData: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>) =>
    this.invoke('products:update', id, updateData)

  delete = (id: number) => this.invoke('products:delete', id)
}
