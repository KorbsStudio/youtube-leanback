const {app, BrowserWindow, dialog, ipcMain, ipcRenderer, Menu} = require('electron')
const path = require('path');
var osvar = process.platform;
const {autoUpdater} = require("electron-updater");
const log = require('electron-log');
autoUpdater.logger = log;

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Update Ready',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new update is ready!'
  }
  dialog.showMessageBox(dialogOpts).then((returnValue) => {if (returnValue.response === 0) autoUpdater.quitAndInstall()})
})

if (osvar == 'darwin') { // macOS
  app.whenReady().then(() => {
    global.frame = false;
})}
else if(osvar == 'win32'){ // Windows
  app.whenReady().then(() => {
    global.frame = true;
})}
else{ //Linux
  app.whenReady().then(() => {
    global.frame = true;
})}

function createWindow () {
  const mainWindow = new BrowserWindow({
    title: 'YouTube Leanback',
    backgroundColor: '#212121', // Use YouTube's branding colors (Almost Black)
    width: 600,
    height: 400,
    autoHideMenuBar: true,
    frame: global.frame,
    darkTheme: true,
    titleBarStyle: 'hiddenInset',
    fullscreen: true,
    webPreferences: {
      nativeWindowOpen: true
    }
  })
  mainWindow.loadURL('https://www.youtube.com/tv#/',
  {userAgent: 'Roku/DVP-9.10 (519.10E04111A)'}); // YouTube will view the device as a Roku
  mainWindow.setIcon(path.join(__dirname, './icon.png'));
  mainWindow.webContents.on('did-finish-load', function() {mainWindow.webContents.insertCSS('#loader {background-size: 25% !important}')})
  mainWindow.webContents.openDevTools()

  const kbOverlay = new BrowserWindow({
    backgroundColor: '#212121',
    width: 700,
    height: 300,
    autoHideMenuBar: true,
    frame: false,
    darkTheme: true,
    show: false,  
    titleBarStyle: 'hidden',
    webPreferences: {
      nativeWindowOpen: true,
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  kbOverlay.loadFile('./kb.html')
  ipcMain.on('hideKB', () => {kbOverlay.hide()})

  const topBarMenu = [{
    label: 'YouTube TV',
    submenu: [{
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      click (item, focusedWindow) {
        if (focusedWindow) focusedWindow.reload()
      }
    }, {
      label: 'View Keyboard Shortcuts',
      accelerator: 'CmdOrCtrl+.',
      click () {kbOverlay.show()}
    }, {
      role: 'quit'
    }]
  }]
  Menu.setApplicationMenu(Menu.buildFromTemplate(topBarMenu))
}
app.whenReady().then(() => {createWindow();autoUpdater.checkForUpdatesAndNotify();})






