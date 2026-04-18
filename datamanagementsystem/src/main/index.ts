import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { startAPIServer, stopAPIServer } from './api-server';

let mainWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development';

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    titleBarStyle: 'default',
    show: false,
    icon: path.join(__dirname, '../../public/assets/icons/icon.png'),
  });

  // Load renderer
  if (isDev) {
    // Try multiple ports that Vite might use
    const portsToTry = [3000, 3001, 3002, 3003, 3004, 3005];
    let connected = false;

    for (const port of portsToTry) {
      try {
        await mainWindow.loadURL(`http://localhost:${port}`);
        console.log(`Successfully connected to Vite dev server on port ${port}`);
        connected = true;
        break;
      } catch (e) {
        console.log(`Failed to connect to port ${port}, trying next...`);
        continue;
      }
    }

    if (!connected) {
      // Fallback to first port and show error in devtools
      await mainWindow.loadURL('http://localhost:3000');
      console.warn('Could not connect to Vite dev server on any port');
    }

    mainWindow.webContents.openDevTools();
  } else {
    await mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(async () => {
  try {
    // Start API server
    await startAPIServer();
    
    // Create window
    await createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  } catch (error) {
    console.error('Failed to start application:', error);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  stopAPIServer();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  stopAPIServer();
});

// IPC handlers
ipcMain.handle('app:getVersion', () => {
  return app.getVersion();
});

ipcMain.handle('app:getName', () => {
  return app.getName();
});

ipcMain.handle('app:getPath', (_, name: string) => {
  return app.getPath(name as any);
});
