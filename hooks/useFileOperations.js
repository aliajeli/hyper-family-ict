import { useOperationStore } from '@/store'; // 👈 Import
import { useRef, useState } from 'react'; // 👈 Import useRef
import { useSystemOperations } from './useSystemOperations';

export const useFileOperations = () => {
  const { 
    logs, 
    setLogs, 
    checkConnection, 
    copyFile,
    deleteFile
  } = useSystemOperations();

  const [isRunning, setIsRunningState] = useState(false);
  const isRunningRef = useRef(false); // 👈 Ref for instant access
  const { destinationPath } = useOperationStore(); // 👈 Get path from store

  const startOperation = async (operationType, params) => {
    // Set both State (for UI) and Ref (for Logic)
    setIsRunningState(true);
    isRunningRef.current = true;
    
    setLogs([]);
    
    const targets = params.targets || [];
    console.log('Targets count:', targets.length);

    for (const target of targets) {
      // Check Ref instead of State
      if (!isRunningRef.current) { 
         console.warn('Stopped by user');
         break; 
      }

      const prefix = `[${target.branch}-${target.name}]`;
      console.log('Processing target:', target.name);

      // 2. Check Connection
      const isOnline = await checkConnection(target.ip);
      
      if (!isOnline) {
        setLogs(prev => [...prev, { message: `${prefix} Skipped (Offline)`, type: 'error' }]);
        continue;
      }

      // 3. Perform Operation
      try {
          if (operationType === 'copy') {
            const files = params.files || [];
            for (const file of files) {
               if (!isRunningRef.current) break; // Check again inside inner loop
                         // 👇 Use dynamic path from store
               // If path is empty, default to C:\HyperFamily\Downloads
               const dest = destinationPath || 'HyperFamily\\Downloads';
               await copyFile(file.path, target.ip, dest);
            }
          } 
          else if (operationType === 'delete') {
             // ... delete logic ...
          }
      } catch (err) {
          setLogs(prev => [...prev, { message: `${prefix} Error: ${err.message}`, type: 'error' }]);
      }
    }

    setLogs(prev => [...prev, { message: 'Operation Completed.', type: 'info' }]);
    
    setIsRunningState(false);
    isRunningRef.current = false;
  };

  const stopOperation = () => {
    setIsRunningState(false);
    isRunningRef.current = false; // Stop immediately
    setLogs(prev => [...prev, { message: 'Stopped by user.', type: 'warning' }]);
  };

  return {
    logs,
    isRunning, // Return state for UI buttons
    startOperation,
    stopOperation
  };
};