import { ConveyorApi } from '@/lib/preload/shared'

interface ColumnMapping {
  code?: string
  description?: string
  measure?: string
  price?: string
}

export class ImportApi extends ConveyorApi {
  selectExcel = () => this.invoke('import:selectExcel')

  importProducts = (filePath: string, columnMapping: ColumnMapping) =>
    this.invoke('import:importProducts', filePath, columnMapping)
}
