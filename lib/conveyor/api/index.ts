import { electronAPI } from '@electron-toolkit/preload'
import { AppApi } from './app-api'
import { WindowApi } from './window-api'
import { CustomersApi } from './customers-api'
import { ProductsApi } from './products-api'
import { ImportApi } from './import-api'
import { QuotesApi } from './quotes-api'
import { PdfApi } from './pdf-api'
import { ProfilesApi } from './profiles-api'
import { EmailApi } from './email-api'

export const conveyor = {
  app: new AppApi(electronAPI),
  window: new WindowApi(electronAPI),
  customers: new CustomersApi(electronAPI),
  products: new ProductsApi(electronAPI),
  import: new ImportApi(electronAPI),
  quotes: new QuotesApi(electronAPI),
  pdf: new PdfApi(electronAPI),
  profiles: new ProfilesApi(electronAPI),
  email: new EmailApi(electronAPI),
}

export type ConveyorApi = typeof conveyor
