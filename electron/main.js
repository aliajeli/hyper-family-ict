const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: false, // Custom Titlebar
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false, // Required for some Node APIs
    },
    icon: path.join(__dirname, '../public/icons/icon.png'),
    backgroundColor: '#0f172a',
  });

  // این بخش را اصلاح کنید
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  let startUrl;
  if (isDev) {
    // در حالت توسعه از پورت 3000 نکت استفاده کن
    startUrl = 'http://localhost:3000';
  } else {
    // در حالت نهایی فایل ساخته شده را باز کن
    startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../out/index.html')}`;
  }
  mainWindow.loadURL(startUrl);


  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});


// Execute PowerShell Command
ipcMain.handle('exec-powershell', async (event, command) => {
  const { exec } = require('child_process');
  // Use PowerShell explicitly
  const psCommand = `powershell.exe -Command "${command.replace(/"/g, '\\"')}"`;
  
  return new Promise((resolve) => {
    exec(psCommand, (error, stdout, stderr) => {
      resolve({ 
        success: !error, 
        output: stdout.trim(), 
        error: stderr.trim() 
      });
    });
  });
});

// Launch External App (RDP, Putty, Winbox)
ipcMain.handle('launch-app', async (event, { appPath, args = [] }) => {
  const { spawn } = require('child_process');
  try {
    const subprocess = spawn(appPath, args, {
      detached: true,
      stdio: 'ignore'
    });
    subprocess.unref();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// RDP Connection
ipcMain.handle('connect-rdp', async (event, ip) => {
  const { exec } = require('child_process');
  exec(`mstsc /v:${ip}`);
  return { success: true };
});


// --- IPC Handlers ---

// Window Controls
ipcMain.on('window-minimize', () => mainWindow?.minimize());
ipcMain.on('window-maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});
ipcMain.on('window-close', () => mainWindow?.close());

// File System Operations
ipcMain.handle('fs-read-dir', async (event, dirPath) => {
  try {
    const targetPath = dirPath === 'root' ? '/' : dirPath; // Adjust for Windows later
    
    // For Windows Drives
    if (dirPath === 'root' && process.platform === 'win32') {
      const { exec } = require('child_process');
      return new Promise((resolve) => {
        exec('wmic logicaldisk get name', (error, stdout) => {
          if (error) return resolve([]);
          const drives = stdout.split('\r\r\n')
            .filter(value => /[A-Za-z]:/.test(value))
            .map(value => ({
              name: value.trim(),
              type: 'drive',
              path: value.trim() + '\\'
            }));
          resolve(drives);
        });
      });
    }

    const items = await fs.readdir(targetPath, { withFileTypes: true });
    
    return items.map(item => ({
      name: item.name,
      type: item.isDirectory() ? 'folder' : 'file',
      path: path.join(targetPath, item.name),
      size: item.isFile() ? 'Unknown' : null // Can get size with fs.stat
    })).filter(item => !item.name.startsWith('.')); // Hide hidden files
    
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
});

// Execute Command (Ping, Copy, etc.)
ipcMain.handle('exec-command', async (event, command) => {
  const { exec } = require('child_process');
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      resolve({ 
        success: !error, 
        output: stdout || stderr 
      });
    });
  });
});

// ... existing code ...

// --- File Operations Handlers ---

// Copy File/Folder
ipcMain.handle('fs-copy', async (event, { source, destination }) => {
  try {
    const fs = require('fs-extra'); // Need fs-extra for recursive copy
    await fs.copy(source, destination, { overwrite: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Delete File/Folder
ipcMain.handle('fs-delete', async (event, path) => {
  try {
    const fs = require('fs-extra');
    await fs.remove(path);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Rename/Move File/Folder
ipcMain.handle('fs-rename', async (event, { oldPath, newPath }) => {
  try {
    const fs = require('fs-extra');
    await fs.move(oldPath, newPath, { overwrite: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Check if File Exists
ipcMain.handle('fs-exists', async (event, path) => {
  const fs = require('fs');
  return fs.existsSync(path);
});

// Calculate SHA256 Checksum
ipcMain.handle('fs-checksum', async (event, filePath) => {
  const crypto = require('crypto');
  const fs = require('fs');
  
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    
    stream.on('error', err => resolve({ success: false, error: err.message }));
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => resolve({ success: true, hash: hash.digest('hex') }));
  });
});