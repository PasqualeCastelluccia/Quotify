import { ConveyorApi } from '@/lib/preload/shared'

export interface EmailData {
  quoteId: number
  to: string
  subject: string
  body: string
}

export class EmailApi extends ConveyorApi {
  sendQuote = (data: EmailData) => this.invoke('email:sendQuote', data)
}
