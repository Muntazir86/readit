// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const windowStateKeeper = require('electron-window-state');
const path = require('path')
const readItem = require('./readItem')
const appMenu = require('./menu')
let mainWindowState

ipcMain.on('add', (e, itemURL)=>{
  
  readItem( itemURL, item=>{
    
    e.sender.send('added-success', item)
  })

})

function createWindow () {

    mainWindowState = windowStateKeeper({
    defaultWidth: 500,
    defaultHeight: 650,
  });
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth:350, maxWidth: 650, minHeight: 300,
    center: true,
    webPreferences: {
      // preload: path.join(__dirname, '/renderer/preload.js'),
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false
    }
  })

  // creating app menu
  appMenu(mainWindow.webContents)

  mainWindow.loadFile('renderer/main.html')


  // and load the index.html of the app.

  mainWindowState.manage(mainWindow)
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
