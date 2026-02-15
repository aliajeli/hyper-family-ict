import { useOperationStore } from '@/store';
import { useRef, useState } from 'react';
import { useSystemOperations } from './useSystemOperations';

export const useFileOperations = () => {
  const { 
    logs, 
    setLogs, 
    addLog, 
    checkPing, 
    manageService, 
    sendMessage, 
    copyFileSecure 
  } = useSystemOperations();

  const { destinationPath, services, message, stopBefore, startAfter, sendAfter } = useOperationStore();
  const [isRunning, setIsRunningState] = useState(false);
  const isRunningRef = useRef(false);

  const startOperation = async (operationType, params) => {
    setIsRunningState(true);
    isRunningRef.current = true;
    setLogs([]);

    const targets = params.targets || [];
    const files = params.files || [];
const serviceList = services ? services.split(',').map(s => s.trim()).filter(s => s) : [];






    for (const target of targets) {
      if (!isRunningRef.current) break;

      addLog(`----------------------------------------`, 'default');
      addLog(`Processing System: [${target.branch}] ${target.name} (${target.ip})`, 'info');

      // 1 & 2. Check Connection (3 Retries)
      const isOnline = await checkPing(target.ip, 3);
      if (!isOnline) continue; // Go to next system

      // 5. Stop Services (If checked)
      if (stopBefore && serviceList.length > 0) {
                console.log('🛑 Stopping services:', serviceList); // 👈 این لاگ را اضافه کنید
        for (const srv of serviceList) {
           await manageService(target.ip, srv, 'stop');
        }
      }

      // 3, 4, 6, 7. File Operations Loop
      if (operationType === 'copy') {
        for (const file of files) {
           if (!isRunningRef.current) break;

           let attempts = 0;
           let success = false;

           // Retry Logic for Copy (Step 7-1)
while (attempts < 2 && !success) { 
               const result = await copyFileSecure(file.path, target.ip, destinationPath);
               
               if (result === true) {
                   success = true;
               } else if (result === 'skipped') {
                   // اگر فایل وجود داشت، موفقیت نیست ولی کار تمام است.
                   // می‌رویم سراغ فایل بعدی (حلقه while می‌شکند)
                   success = true; 
               } else if (result === 'retry') {
                   addLog(`Retrying copy operation for ${file.name}...`, 'warning');
                   attempts++;
               } else {
                   break; // Fatal error
               }
           }
        }
      }

      // 8. Start Services (If checked or Start After)
      if (startAfter && serviceList.length > 0) {
                 console.log('🟢 Starting services:', serviceList); // 👈 این لاگ را اضافه کنید

         for (const srv of serviceList) {
            // Retry logic for services (Step 8)
            let srvStarted = false;
            for(let k=0; k<3; k++) {
                if(await manageService(target.ip, srv, 'start')) {
                    srvStarted = true;
                    break;
                }
                await new Promise(r => setTimeout(r, 1000));
            }
            if(!srvStarted) addLog(`Could not start service ${srv} after 3 attempts`, 'error');
         }
      }

      // 9 & 10. Send Message
      if (sendAfter && message) {
         await sendMessage(target.ip, message);
      }
    }

    addLog('All Operations Completed.', 'info');
    setIsRunningState(false);
    isRunningRef.current = false;
  };

  const stopOperation = () => {
    setIsRunningState(false);
    isRunningRef.current = false;
    addLog('Operation Stopped by User.', 'error');
  };

  return { logs, isRunning, startOperation, stopOperation };
};