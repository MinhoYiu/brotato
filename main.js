const { app, BrowserWindow } = require('electron');
const path = require('path');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    resizable: true,
    title: 'Brotato',
    backgroundColor: '#1a1a2e',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile('index.html');

  // 游戏音效通过 Web Audio API 播放，不需要额外配置

  win.on('closed', () => {
    win = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
