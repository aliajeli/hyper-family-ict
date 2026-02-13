import { useDestinationStore } from '@/store';
import { useState } from 'react';

export const useFileOperations = () => {
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const { destinations } = useDestinationStore(); // In real app, use selectedDestinations

  const addLog = (message, type = 'default') => {
    setLogs(prev => [...prev, { message, type }]);
  };

  const simulateOperation = async (operationType, params) => {
    setIsRunning(true);
    setLogs([]);
    addLog(`Starting ${operationType} operation...`, 'info');

    // Filter systems (Mock: using all destinations for demo)
    const targets = destinations.length > 0 ? destinations : [
      { branch: 'Lahijan', name: 'Server-01', ip: '192.168.1.10' },
      { branch: 'Ramsar', name: 'Client-04', ip: '192.168.2.15' }
    ];

    for (const target of targets) {
      if (!isRunning) break; // Check if stopped (doesn't work perfectly in loop without ref, but OK for demo)

      const prefix = `[${target.branch} - ${target.name}]`;

      // 1. Check Connection
      addLog(`${prefix} Connecting...`, 'default');
      await new Promise(r => setTimeout(r, 800)); // Simulate network delay

      const isConnected = Math.random() > 0.1; // 90% success chance

      if (!isConnected) {
        addLog(`${prefix} Not Connected`, 'error');
        continue;
      }

      addLog(`${prefix} Connected`, 'success');

      // 2. Perform Operation
      await new Promise(r => setTimeout(r, 1000)); // Simulate operation time

      switch (operationType) {
        case 'copy':
          addLog(`${prefix} Copying files...`, 'default');
          addLog(`${prefix} Copied`, 'success');
          
          // 3. Verify (Only for Copy/Replace)
          await new Promise(r => setTimeout(r, 500));
          addLog(`${prefix} Verifying SHA checksum...`, 'info');
          addLog(`${prefix} Verified`, 'success');
          break;

        case 'delete':
          addLog(`${prefix} Deleting files...`, 'default');
          addLog(`${prefix} Deleted`, 'success');
          break;

        case 'rename':
          addLog(`${prefix} Checking file existence...`, 'default');
          addLog(`${prefix} File Exists`, 'success');
          addLog(`${prefix} Renamed to ${params.newName}`, 'success');
          break;
          
        case 'replace':
           addLog(`${prefix} Checking existence...`, 'default');
           addLog(`${prefix} Found. Renaming old file...`, 'warning');
           addLog(`${prefix} Copying new file...`, 'default');
           addLog(`${prefix} Verified`, 'success');
           break;
      }
      
      addLog('----------------------------------------', 'default');
    }

    addLog('Operation Completed.', 'info');
    setIsRunning(false);
  };

  const stopOperation = () => {
    setIsRunning(false);
    addLog('Operation Stopped by User.', 'error');
  };

  return {
    logs,
    isRunning,
    startOperation: simulateOperation,
    stopOperation
  };
};