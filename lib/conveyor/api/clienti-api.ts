import { ConveyorApi } from '@/lib/preload/shared'
import type { Cliente } from '@/app/types/cliente'

export class ClientiApi extends ConveyorApi {
  create = (clienteData: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>) =>
    this.invoke('clienti:create', clienteData)

  getAll = () =>
    this.invoke('clienti:getAll')

  getById = (id: number) =>
    this.invoke('clienti:getById', id)

  update = (id: number, updateData: Partial<Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>>) =>
    this.invoke('clienti:update', id, updateData)

  delete = (id: number) =>
    this.invoke('clienti:delete', id)
}
