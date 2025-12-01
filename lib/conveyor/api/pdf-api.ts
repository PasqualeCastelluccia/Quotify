import { ConveyorApi } from '@/lib/preload/shared'

export class PdfApi extends ConveyorApi {
  generateQuote = (quoteId: number) => this.invoke('pdf:generateQuote', quoteId)
}
