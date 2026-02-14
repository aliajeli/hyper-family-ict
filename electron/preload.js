const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Window Controls
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),

  // PowerShell
  powershell: (command) => ipcRenderer.invoke('exec-powershell', command),
  
  // Launch Apps
  launchApp: (appPath, args) => ipcRenderer.invoke('launch-app', { appPath, args }),
  connectRDP: (ip) => ipcRenderer.invoke('connect-rdp', ip),


  // File System
  readDir: (path) => ipcRenderer.invoke('fs-read-dir', path),
  
  // System Operations
  exec: (command) => ipcRenderer.invoke('exec-command', command),
  
  // App Info
  platform: process.platform,
});