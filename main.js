const {app, BrowserWindow, ipcMain, ipcRenderer, Menu} = require('electron')
var osvar = process.platform;

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
    backgroundColor: '#212121', // Use YouTube's branding colors (Almost Black)
    width: 600,
    height: 400,
    autoHideMenuBar: true,
    frame: global.frame,
    darkTheme: true,
    titleBarStyle: 'hiddenInset',
    fullscreen: true
  })
  mainWindow.loadURL('https://www.youtube.com/tv#/',
  {userAgent: 'Roku/DVP-9.10 (519.10E04111A)'}); // YouTube will view the device as a Roku


  const topBarMenu = [{
    label: 'YouTube TV',
    submenu: [{
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload()
        }
      }, {
      role: 'quit'
    }]
  }]
  Menu.setApplicationMenu(Menu.buildFromTemplate(topBarMenu))
}
app.whenReady().then(() => {createWindow()})

