import { useState } from 'react';
import toast from 'react-hot-toast';

export const useSystemOperations = () => {
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = (message, type = 'default') => {
    setLogs(prev => [...prev, { message, type }]);
  };

  const checkConnection = async (ip) => {
    if (!window.electron) return true; // Mock for browser
    
    addLog(`Pinging ${ip}...`, 'default');
    const result = await window.electron.powershell(`Test-Connection -ComputerName ${ip} -Count 1 -Quiet`);
    
    if (result.output.includes('True')) {
      addLog(`${ip} is Online`, 'success');
      return true;
    } else {
      addLog(`${ip} is Offline`, 'error');
      return false;
    }
  };

  const copyFile = async (sourcePath, destIp, destPath) => {
    if (!window.electron) {
      addLog(`[Mock] Copying ${sourcePath} to \\\\${destIp}\\${destPath}`, 'info');
      await new Promise(r => setTimeout(r, 1000));
      return true;
    }

    // Convert local path to UNC path if needed, or mapping
    // Simple copy command
    const command = `Copy-Item -Path "${sourcePath}" -Destination "\\\\${destIp}\\C$\\${destPath}" -Recurse -Force`;
    
    addLog(`Copying to ${destIp}...`, 'info');
    const result = await window.electron.powershell(command);
    
    if (result.success) {
      addLog(`Successfully copied to ${destIp}`, 'success');
      return true;
    } else {
      addLog(`Failed to copy to ${destIp}: ${result.error}`, 'error');
      return false;
    }
  };

  const manageService = async (ip, serviceName, action) => { // action: Start or Stop
    const command = `Get-Service -ComputerName ${ip} -Name ${serviceName} | ${action}-Service`;
    addLog(`${action}ing service ${serviceName} on ${ip}...`, 'warning');
    
    if (!window.electron) {
      await new Promise(r => setTimeout(r, 500));
      return true;
    }

    const result = await window.electron.powershell(command);
    return result.success;
  };

  return {
    logs,
    isRunning,
    setIsRunning,
    setLogs,
    checkConnection,
    copyFile,
    manageService
  };
};