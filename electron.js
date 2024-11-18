const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),  // Optional, for additional security
    },
  });

  // Load the Vue build output (dist/index.html)
  mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));

  // Optional: Open the DevTools
  // mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // macOS: Re-create a window if no other windows are open
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  // Quit the app on all platforms except macOS
  if (process.platform !== 'darwin') app.quit();
});