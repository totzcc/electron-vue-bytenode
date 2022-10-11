import {app, BrowserWindow, Menu, powerSaveBlocker, protocol} from 'electron'
import '../renderer/store'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    useContentSize: true,
    webPreferences: {
      webviewTag: true,
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  })

  mainWindow.loadURL(winURL).then()

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  protocol.registerStringProtocol('itms-appss', (request) => {
    console.log('registerStringProtocol itms-appss', request)
  })
  protocol.registerStringProtocol('kwai', (request) => {
    console.log('registerStringProtocol kwai', request)
  })
  if (process.platform === 'darwin') {
    const template = [
      {
        label: "Application",
        submenu: [
          { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]
      },
      {
        label: "Edit",
        submenu: [
          { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" },
          { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
          { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
          { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        ]
      }
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  } else {
    Menu.setApplicationMenu(null)
  }
  powerSaveBlocker.start('prevent-display-sleep')
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
if (!app.requestSingleInstanceLock()) {
  app.quit();
}
app.on('second-instance', (e) => {
  mainWindow.show();
  mainWindow.focus();
});
