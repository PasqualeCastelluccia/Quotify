import { app, BrowserWindow, dialog } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createAppWindow } from './app'
import { closeDatabase } from '@/lib/database/db'
import { autoUpdater } from 'electron-updater'

// Configurazione auto-updater
autoUpdater.autoDownload = false // Chiedi conferma prima di scaricare
autoUpdater.autoInstallOnAppQuit = true // Installa quando l'app si chiude

// Eventi auto-updater
autoUpdater.on('checking-for-update', () => {
  console.log('Controllo aggiornamenti...')
})

autoUpdater.on('update-available', (info) => {
  console.log('Aggiornamento disponibile:', info.version)
  
  dialog.showMessageBox({
    type: 'info',
    title: 'Aggiornamento Disponibile',
    message: `È disponibile la versione ${info.version}. Vuoi scaricarla?`,
    buttons: ['Sì', 'Più tardi']
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.downloadUpdate()
    }
  })
})

autoUpdater.on('update-not-available', () => {
  console.log('Nessun aggiornamento disponibile')
})

autoUpdater.on('download-progress', (progressObj) => {
  const message = `Velocità: ${progressObj.bytesPerSecond} - Scaricato ${progressObj.percent}%`
  console.log(message)
})

autoUpdater.on('update-downloaded', (info) => {
  console.log('Aggiornamento scaricato:', info.version)
  
  dialog.showMessageBox({
    type: 'info',
    title: 'Aggiornamento Pronto',
    message: `L'aggiornamento alla versione ${info.version} è stato scaricato. L'app verrà riavviata per completare l'installazione.`,
    buttons: ['Riavvia Ora', 'Più tardi']
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall(false, true)
    }
  })
})

autoUpdater.on('error', (err) => {
  console.error('Errore auto-updater:', err)
  dialog.showErrorBox('Errore Aggiornamento', `Si è verificato un errore: ${err.message}`)
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')
  
  // Create app window
  createAppWindow()

  // Controlla gli aggiornamenti dopo 3 secondi (solo in produzione)
  if (!app.isPackaged) {
    console.log('Modalità sviluppo: auto-updater disabilitato')
  } else {
    setTimeout(() => {
      autoUpdater.checkForUpdatesAndNotify()
    }, 3000)
  }

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createAppWindow()
    }
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Close database before app quits
app.on('before-quit', () => {
  closeDatabase()
})

// In this file, you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.