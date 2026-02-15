const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const fsExtra = require('fs-extra'); // Make sure fs-extra is installed
const { PowerShell } = require('node-powershell');
const crypto = require('crypto');

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
      sandbox: false, // Required for Node APIs
    },
    icon: path.join(__dirname, '../public/icons/icon.png'),
    backgroundColor: '#0f172a',
  });

  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../out/index.html')}`;
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

// ----------------------------------------------------------------
// IPC Handlers
// ----------------------------------------------------------------

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


// File System Browser (Local)
ipcMain.handle('fs-read-dir', async (event, dirPath) => {
  try {
    const targetPath = dirPath === 'root' ? '/' : dirPath;
    
    // Windows Drives Logic
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
      size: item.isFile() ? 'Unknown' : null 
    })).filter(item => !item.name.startsWith('.')); // Hide hidden files
    
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
});


// Execute Simple Command
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


// Execute PowerShell Script
ipcMain.handle('exec-powershell', async (event, command) => {
  const { exec } = require('child_process');
  // Use PowerShell explicitly with Bypass policy
  const psCommand = `powershell.exe -ExecutionPolicy Bypass -Command "${command.replace(/"/g, '\\"')}"`;
  
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


// Launch External App
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


// Connect RDP
ipcMain.handle('connect-rdp', async (event, ip) => {
  const { exec } = require('child_process');
  exec(`mstsc /v:${ip}`);
  return { success: true };
});


// --- FILE OPERATIONS (COPY, DELETE, RENAME) ---

// // Copy File/Folder
// ipcMain.handle('fs-copy', async (event, { source, destination }) => {
//   try {
//     // Normalize paths
//     const src = path.normalize(source);
//     const dest = path.normalize(destination);

//     // Check source
//     if (!fsExtra.existsSync(src)) {
//         return { success: false, error: `Source not found: ${src}` };
//     }

//     // Create destination folder if needed
//     await fsExtra.ensureDir(path.dirname(dest));

//     console.log(`Copying: ${src} -> ${dest}`);
//     await fsExtra.copy(src, dest, { overwrite: true, errorOnExist: false });
    
//     return { success: true };
//   } catch (error) {
//     console.error('Copy Error:', error);
//     return { success: false, error: error.message };
//   }
// });


// Copy File/Folder Handler (Debug Version)
ipcMain.handle('fs-copy', async (event, { source, destination }) => {
  console.log('------------------------------------------------');
  console.log('📥 COPY REQUEST RECEIVED');
  console.log('📍 Source Raw:', source);
  console.log('📍 Dest Raw:', destination);

  try {
    const fsExtra = require('fs-extra');
    const path = require('path');

    // 1. Normalize Paths
    const src = path.resolve(source); // Resolve to absolute path
    const dest = path.resolve(destination); // Resolve to absolute path
    
    console.log('✅ Normalized Source:', src);
    console.log('✅ Normalized Dest:', dest);

    // 2. Check Source Existence
    if (!fsExtra.existsSync(src)) {
        console.error('❌ ERROR: Source file does not exist!');
        return { success: false, error: `Source not found: ${src}` };
    }

    // 3. Ensure Destination Directory Exists
    const destDir = path.dirname(dest);
    console.log('📂 Ensuring directory exists:', destDir);
    await fsExtra.ensureDir(destDir);

    // 4. Perform Copy
    console.log('🚀 Starting copy operation...');
    await fsExtra.copy(src, dest, { overwrite: true, errorOnExist: false });
    
    console.log('🎉 Copy Success!');
    console.log('------------------------------------------------');
    return { success: true };

  } catch (error) {
    console.error('❌ COPY FAILED:', error);
    console.log('------------------------------------------------');
    return { success: false, error: error.message };
  }
});


// Delete File/Folder
ipcMain.handle('fs-delete', async (event, targetPath) => {
  try {
    await fsExtra.remove(path.normalize(targetPath));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Rename/Move File/Folder
ipcMain.handle('fs-rename', async (event, { oldPath, newPath }) => {
  try {
    await fsExtra.move(path.normalize(oldPath), path.normalize(newPath), { overwrite: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Check Exists
ipcMain.handle('fs-exists', async (event, targetPath) => {
  return fsExtra.existsSync(path.normalize(targetPath));
});

// Checksum
ipcMain.handle('fs-checksum', async (event, filePath) => {
  return new Promise((resolve) => {
    try {
      const hash = crypto.createHash('sha256');
      const stream = fsExtra.createReadStream(path.normalize(filePath));
      
      stream.on('error', err => resolve({ success: false, error: err.message }));
      stream.on('data', chunk => hash.update(chunk));
      stream.on('end', () => resolve({ success: true, hash: hash.digest('hex') }));
    } catch (e) {
      resolve({ success: false, error: e.message });
    }
  });
});


// --- SERVICE MANAGEMENT (via node-powershell) ---
ipcMain.handle('service-manage', async (event, { ip, serviceName, action }) => {
  const ps = new PowerShell({
    executionPolicy: 'Bypass',
    noProfile: true,
  });

  try {
    const command = `
      $service = Get-Service -ComputerName "${ip}" -Name "${serviceName}" -ErrorAction SilentlyContinue;
      if ($service) {
        if ("${action}" -eq "start") {
          Start-Service -InputObject $service;
          Write-Output "Service started";
        } elseif ("${action}" -eq "stop") {
          Stop-Service -InputObject $service;
          Write-Output "Service stopped";
        }
      } else {
        Write-Error "Service not found";
      }
    `;

    await ps.addCommand(command);
    const result = await ps.invoke();
    await ps.dispose();
    
    return { success: true, output: result };
  } catch (err) {
    await ps.dispose();
    return { success: false, error: err.message };
  }
});