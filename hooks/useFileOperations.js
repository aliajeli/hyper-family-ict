import { useDestinationStore } from '@/store';
import { useState } from 'react';
import { useSystemOperations } from './useSystemOperations'; // Import new hook


export const useFileOperations = () => {
  const { 
    logs, 
    setLogs, 
    isRunning, 
    setIsRunning, 
    checkConnection, 
    copyFile 
  } = useSystemOperations();
  
  const { destinations, selectedDestinations } = useDestinationStore();

  const addLog = (message, type = 'default') => {
    setLogs(prev => [...prev, { message, type }]);
  };

  const startOperation = async (operationType, params) => {
    setIsRunning(true);
    setLogs([]);
    
    // Get selected destinations or use mock if empty
    const targets = selectedDestinations.length > 0 
      ? destinations.filter(d => selectedDestinations.includes(d.id))
      : [
          { branch: 'Lahijan', name: 'Mock-PC', ip: '127.0.0.1' } // Localhost for testing
        ];

    for (const target of targets) {
      if (!isRunning) break; 

      const prefix = `[${target.branch}-${target.name}]`;

      // 1. Check Connection (Real Ping)
      const isOnline = await checkConnection(target.ip);
      
      if (!isOnline) {
        setLogs(prev => [...prev, { message: `${prefix} Skipped (Offline)`, type: 'error' }]);
        continue;
      }

      // 2. Perform Operation
      if (operationType === 'copy') {
        const files = params; // array of files
        for (const file of files) {
           // Default path C:\HyperFamily\Downloads
           await copyFile(file.path, target.ip, 'HyperFamily\\Downloads');
        }
      }
      
      // ... handle other operations ...
    }

    setLogs(prev => [...prev, { message: 'Operation Completed.', type: 'info' }]);
    setIsRunning(false);
  };

  const stopOperation = () => {
    setIsRunning(false);
    setLogs(prev => [...prev, { message: 'Stopped by user.', type: 'warning' }]);
  };

  return {
    logs,
    isRunning,
    startOperation,
    stopOperation
  };
};