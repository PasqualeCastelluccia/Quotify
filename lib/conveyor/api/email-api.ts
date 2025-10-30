import { ConveyorApi } from '@/lib/preload/shared'

export interface EmailData {
  preventivoId: number
  to: string
  subject: string
  body: string
}

export class EmailApi extends ConveyorApi {
  sendPreventivo = (data: EmailData) =>
    this.invoke('email:sendPreventivo', data)
}
