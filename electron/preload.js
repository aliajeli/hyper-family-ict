const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Window Controls
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),

  // File System
  readDir: (path) => ipcRenderer.invoke('fs-read-dir', path),
  
  // System Operations
  exec: (command) => ipcRenderer.invoke('exec-command', command),
  
  // App Info
  platform: process.platform,
});