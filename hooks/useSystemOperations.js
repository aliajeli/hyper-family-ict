import { useState } from 'react';

export const useSystemOperations = () => {
  const [logs, setLogs] = useState([]);

  // Helper for adding logs
  const addLog = (message, type = 'default') => {
    // types: default (white), info (blue), success (green), warning (yellow), error (red)
    console.log(`[${type.toUpperCase()}] ${message}`);
    setLogs(prev => [...prev, { message, type }]);
  };

  // 1. Check Ping
  const checkPing = async (ip, retries = 3) => {
    for (let i = 1; i <= retries; i++) {
      // فقط دفعه اول یا اگر خطا خورد لاگ بزن
      if (i > 1) addLog(`Connection attempt ${i}/${retries}...`, 'warning');
      
      try {
        if (!window.electron) return true;
        const res = await window.electron.exec(`ping -n 1 ${ip}`);
        
        if (res.success && !res.output.includes('Unreachable') && !res.output.includes('timed out')) {
          addLog(`${ip} is Online`, 'success');
          return true;
        }
      } catch (e) {}

      if (i < retries) await new Promise(r => setTimeout(r, 1500));
    }
    
    addLog(`${ip} is Offline. Skipping.`, 'error');
    return false;
  };

  // 2. Manage Service
  const manageService = async (ip, serviceName, action) => {
       console.log(`🔧 Calling Service Manager: ${action} ${serviceName} on ${ip}`); // 👈 این لاگ را اضافه کنید

    // لاگ کمتر: فقط نتیجه نهایی را بگو
    if (!window.electron) return true;

    const res = await window.electron.manageService(ip, serviceName, action);
    if (res.success) {
      addLog(`Service ${serviceName} ${action}ed`, 'success');
      return true;
    } else {
      addLog(`Failed to ${action} ${serviceName}: ${res.error}`, 'error');
      return false;
    }
  };

  // 3. Send Message
  const sendMessage = async (ip, message) => {
    if (!window.electron) return true;
    const res = await window.electron.sendMsg(ip, message);
    if (res.success) {
      addLog(`Message sent to ${ip}`, 'success');
      return true;
    } else {
      addLog(`Message failed: ${res.error}`, 'error');
      return false;
    }
  };

  // 4. File Operations (Copy + Verify)
  const copyFileSecure = async (src, destIp, destPath) => {
    const fileName = src.split(/[/\\]/).pop();
    
    // Build UNC Path
    let targetPath = destPath || 'HyperFamily\\Downloads';
    let targetDrive = 'C$';
    if (targetPath.includes(':')) {
        const parts = targetPath.split(':');
        targetDrive = `${parts[0].toUpperCase()}$`;
        targetPath = parts[1];
    }
    targetPath = targetPath.replace(/^[\/\\]+|[\/\\]+$/g, '');
    const fullDest = `\\\\${destIp}\\${targetDrive}\\${targetPath}\\${fileName}`;

    // A. Check Exists
     const exists = await window.electron.existsRemote(fullDest);
    
    if (exists) {
        addLog(`File ${fileName} already exists. Skipped.`, 'error'); // قرمز
        return 'skipped'; // مقدار بازگشتی خاص
    } else {
        addLog(`File does not exist. Proceeding...`, 'success'); // سبز 
    }

    // B. Copy
    addLog(`Copying ${fileName}...`, 'default'); // رنگ سفید برای شروع
    const copyRes = await window.electron.copy(src, fullDest);
    
    if (!copyRes.success) {
        addLog(`Copy Failed: ${copyRes.error}`, 'error');
        return false;
    }

    // مکث کوتاه برای اطمینان از نوشتن فایل روی دیسک مقصد
    await new Promise(r => setTimeout(r, 1000));

    // C. Verify Hash
    // addLog(`Verifying...`, 'default'); // این خط را حذف کردیم تا شلوغ نشود
    
    // Calculate local hash
    const localHash = await window.electron.checksum(src);
    
    // Calculate remote hash (Reading back the file over network)
    const remoteHash = await window.electron.hashRemote(fullDest);

    if (localHash.success && remoteHash.success) {
        if (localHash.hash === remoteHash.hash) {
            addLog(`${fileName} Verified (SHA256 Match)`, 'success');
            return true;
        } else {
            addLog(`Hash Mismatch! Retrying...`, 'error');
            return 'retry'; 
        }
    } else {
        addLog(`Verification Failed: ${remoteHash.error || localHash.error}`, 'error');
        return 'retry'; 
    }
  };

  return {
    logs,
    setLogs,
    addLog,
    checkPing,
    manageService,
    sendMessage,
    copyFileSecure
  };
};