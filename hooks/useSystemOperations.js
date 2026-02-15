import { useState } from 'react';

export const useSystemOperations = () => {
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = (message, type = 'default') => {
    setLogs(prev => [...prev, { message, type }]);
  };

  const checkConnection = async (ip) => {
    if (!window.electron) return true; 
    addLog(`Pinging ${ip}...`, 'default');
    // Using simple ping for speed
    const result = await window.electron.exec(`ping -n 1 ${ip}`);
    
    if (result.success && !result.output.includes('Unreachable') && !result.output.includes('timed out')) {
      addLog(`${ip} is Online`, 'success');
      return true;
    } else {
      addLog(`${ip} is Offline`, 'error');
      return false;
    }
  };

  const copyFile = async (sourcePath, destIp, destPath) => {
    if (!window.electron) {
      addLog(`[Mock] Copied to ${destIp}`, 'success');
      return true;
    }

    // Construct UNC Path: \\192.168.1.10\C$\Path\To\Dest
    // Assuming C$ share is enabled and accessible
    const uncDest = `\\\\${destIp}\\C$\\${destPath}`;
    
    addLog(`Copying to ${uncDest}...`, 'info');
    const result = await window.electron.copy(sourcePath, uncDest);
    
    if (result.success) {
      addLog(`Success: Copied to ${destIp}`, 'success');
      
      // Verify Checksum (Optional - takes time)
      // addLog(`Verifying checksum...`, 'info');
      // const localHash = await window.electron.checksum(sourcePath);
      // const remoteHash = await window.electron.checksum(uncDest);
      // if (localHash.hash === remoteHash.hash) {
      //    addLog(`Verified: Checksum Matched`, 'success');
      // }
      
      return true;
    } else {
      addLog(`Error: ${result.error}`, 'error');
      return false;
    }
  };

  const deleteFile = async (destIp, destPath) => {
    const uncPath = `\\\\${destIp}\\C$\\${destPath}`;
    addLog(`Deleting ${uncPath}...`, 'warning');
    
    if (!window.electron) return true;

    const result = await window.electron.delete(uncPath);
    if (result.success) {
      addLog(`Deleted: ${destIp}`, 'success');
      return true;
    } else {
      addLog(`Error: ${result.error}`, 'error');
      return false;
    }
  };

  return {
    logs,
    isRunning,
    setIsRunning,
    setLogs,
    checkConnection,
    copyFile,
    deleteFile
  };
};