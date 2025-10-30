import { electronAPI } from '@electron-toolkit/preload'
import { AppApi } from './app-api'
import { WindowApi } from './window-api'
import { ClientiApi } from './clienti-api'
import { ProdottiApi } from './prodotti-api'
import { ImportApi } from './import-api'
import { PreventiviApi } from './preventivi-api'
import { PdfApi } from './pdf-api'
import { ProfilesApi } from './profiles-api'
import { EmailApi } from './email-api'

export const conveyor = {
  app: new AppApi(electronAPI),
  window: new WindowApi(electronAPI),
  clienti: new ClientiApi(electronAPI),
  prodotti: new ProdottiApi(electronAPI),
  import: new ImportApi(electronAPI),
  preventivi: new PreventiviApi(electronAPI),
  pdf: new PdfApi(electronAPI),
  profiles: new ProfilesApi(electronAPI),
  email: new EmailApi(electronAPI),
}

export type ConveyorApi = typeof conveyor
