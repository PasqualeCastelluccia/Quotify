import { BrowserWindow, shell, app } from 'electron'
import { join } from 'path'
import appIcon from '@/resources/build/icon.png?asset'
import { registerResourcesProtocol } from './protocols'
import { registerWindowHandlers } from '@/lib/conveyor/handlers/window-handler'
import { registerAppHandlers } from '@/lib/conveyor/handlers/app-handler'
import { registerCustomersHandlers } from '@/lib/conveyor/handlers/customers-handler'
import { registerProductsHandlers } from '@/lib/conveyor/handlers/products-handler'
import { registerImportHandlers } from '@/lib/conveyor/handlers/import-handler'
import { registerQuotesHandlers } from '@/lib/conveyor/handlers/quotes-handler'
import { registerPdfHandlers } from '@/lib/conveyor/handlers/pdf-handler'
import { registerProfilesHandlers } from '@/lib/conveyor/handlers/profiles-handler'
import { registerEmailHandlers } from '@/lib/conveyor/handlers/email-handler'
import { initializePrisma } from '@/lib/database/prisma'

export async function createAppWindow(): Promise<void> {
  // Register custom protocol for resources
  registerResourcesProtocol()

  // Initialize Prisma database connection
  await initializePrisma()

  // Create the main window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    backgroundColor: '#1c1c1c',
    icon: appIcon,
    frame: true, // Title bar nativa
    title: 'Quotify', // Nome della tua app
    // Rimuovi titleBarStyle o impostalo a 'default'
    // titleBarStyle: 'default',
    maximizable: true, // Permetti massimizzazione
    resizable: true, // Permetti ridimensionamento
    minWidth: 800, // Larghezza minima opzionale
    minHeight: 600, // Altezza minima opzionale
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      sandbox: false,
    },
  })

  mainWindow.setMenu(null)

  // Register IPC events for the main window.
  registerWindowHandlers(mainWindow)
  registerAppHandlers(app)
  registerCustomersHandlers()
  registerProductsHandlers()
  registerImportHandlers()
  registerQuotesHandlers()
  registerPdfHandlers()
  registerProfilesHandlers()
  registerEmailHandlers()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()

    // Apri DevTools in modalità sviluppo
    if (!app.isPackaged) {
      mainWindow.webContents.openDevTools()
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
