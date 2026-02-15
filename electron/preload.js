const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Window Controls
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),

  // PowerShell
  powershell: (command) => ipcRenderer.invoke('exec-powershell', command),

    // Service Management
  manageService: (ip, serviceName, action) => 
    ipcRenderer.invoke('service-manage', { ip, serviceName, action }),
  
  // Launch Apps
  launchApp: (appPath, args) => ipcRenderer.invoke('launch-app', { appPath, args }),
  connectRDP: (ip) => ipcRenderer.invoke('connect-rdp', ip),


  // File System
  readDir: (path) => ipcRenderer.invoke('fs-read-dir', path),
  
  // System Operations
  exec: (command) => ipcRenderer.invoke('exec-command', command),
  
  // App Info
  platform: process.platform,

    // File Operations
  copy: (source, destination) => {
    console.log('[Preload] Sending copy request:', source, '->', destination); // برای دیباگ
    return ipcRenderer.invoke('fs-copy', { source, destination });
  },
  delete: (path) => ipcRenderer.invoke('fs-delete', path),
  rename: (oldPath, newPath) => ipcRenderer.invoke('fs-rename', { oldPath, newPath }),
  exists: (path) => ipcRenderer.invoke('fs-exists', path),
  checksum: (path) => ipcRenderer.invoke('fs-checksum', path),

});