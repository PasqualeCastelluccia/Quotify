import { ConveyorApi } from '@/lib/preload/shared'

export class PdfApi extends ConveyorApi {
  generatePreventivo = (preventivoId: number) =>
    this.invoke('pdf:generatePreventivo', preventivoId)
}
