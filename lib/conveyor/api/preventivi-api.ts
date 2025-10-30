import { ConveyorApi } from '@/lib/preload/shared'
import type { Preventivo, PreventivoItem, PreventivoWithItems } from '@/app/types/preventivo'

export class PreventiviApi extends ConveyorApi {
  create = (
    preventivoData: Omit<Preventivo, 'id' | 'createdAt' | 'updatedAt'>,
    items: Omit<PreventivoItem, 'id' | 'preventivoId' | 'createdAt' | 'updatedAt'>[]
  ) =>
    this.invoke('preventivi:create', preventivoData, items)

  getAll = () =>
    this.invoke('preventivi:getAll')

  getById = (id: number) =>
    this.invoke('preventivi:getById', id)

  update = (
    id: number,
    updateData: Partial<Omit<Preventivo, 'id' | 'createdAt' | 'updatedAt'>>,
    items?: Omit<PreventivoItem, 'id' | 'preventivoId' | 'createdAt' | 'updatedAt'>[]
  ) =>
    this.invoke('preventivi:update', id, updateData, items)

  delete = (id: number) =>
    this.invoke('preventivi:delete', id)

  getNextNumber = () =>
    this.invoke('preventivi:getNextNumber')
}
