import { ConveyorApi } from '@/lib/preload/shared'

interface ColumnMapping {
  codice?: string
  descrizione?: string
  misura?: string
  prezzo?: string
}

export class ImportApi extends ConveyorApi {
  selectExcel = () =>
    this.invoke('import:selectExcel')

  importProducts = (filePath: string, columnMapping: ColumnMapping) =>
    this.invoke('import:importProducts', filePath, columnMapping)
}
