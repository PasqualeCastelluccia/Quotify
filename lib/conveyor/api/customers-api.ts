import { ConveyorApi } from '@/lib/preload/shared'
import type { Customer } from '@prisma/client'

export class CustomersApi extends ConveyorApi {
  create = (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) =>
    this.invoke('customers:create', customerData)

  getAll = () => this.invoke('customers:getAll')

  getById = (id: number) => this.invoke('customers:getById', id)

  update = (id: number, updateData: Partial<Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>>) =>
    this.invoke('customers:update', id, updateData)

  delete = (id: number) => this.invoke('customers:delete', id)
}
