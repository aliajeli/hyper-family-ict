import { useState } from 'react';

// 👇 این خط export بسیار مهم است
export const useSystemOperations = () => {
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = (message, type = 'default') => {
    console.log(`📝 LOG: ${message}`);
    setLogs(prev => [...prev, { message, type }]);
  };

  // --- 1. Check Connection (Ping) ---
  const checkConnection = async (ip) => {
    if (!window.electron) return true;

    addLog(`Pinging ${ip}...`, 'default');
    
    try {
        const result = await window.electron.exec(`ping -n 1 ${ip}`);
        
        if (result.success && !result.output.includes('Unreachable') && !result.output.includes('timed out')) {
          addLog(`${ip} is Online`, 'success');
          return true;
        } else {
          addLog(`${ip} is Offline`, 'error');
          return false;
        }
    } catch (e) {
        addLog(`Ping Error: ${e.message}`, 'error');
        return false;
    }
  };

  // --- 2. Copy File (Network Only) ---
  const copyFile = async (sourcePath, destIp, destPath) => {
    console.log('----------------------------------------');
    console.log('🔄 COPY START');
    console.log('📂 Src:', sourcePath);
    console.log('🎯 IP:', destIp);
    console.log('📂 User Path:', destPath);

    if (!window.electron) {
        addLog('Error: Electron API not available', 'error');
        return false;
    }

    // استخراج نام فایل
    const fileName = sourcePath.split(/[/\\]/).pop();

    // مسیر پیش‌فرض
    let targetPath = destPath || 'HyperFamily\\Downloads';
    let targetDrive = 'C$'; // پیش‌فرض C$

    // اگر کاربر درایو مشخص کرده باشد (مثلاً D:\Data)
    // باید تبدیل شود به D$\Data
    if (targetPath.includes(':')) {
        const parts = targetPath.split(':');
        const driveLetter = parts[0].toUpperCase(); // D
        targetDrive = `${driveLetter}$`; // D$
        targetPath = parts[1]; // \Data
    }

    // حذف بک‌اسلش‌های اضافی اول و آخر مسیر
    targetPath = targetPath.replace(/^[\/\\]+|[\/\\]+$/g, '');

    // ساخت مسیر نهایی شبکه (UNC Path)
    // فرمت: \\IP\Drive$\Path\FileName
    const fullDest = `\\\\${destIp}\\${targetDrive}\\${targetPath}\\${fileName}`;
    
    console.log('🌐 Network Path Constructed:', fullDest);
    addLog(`Copying ${fileName} to ${fullDest}...`, 'info');
    
    try {
      console.log('🚀 Invoking Electron IPC: fs-copy');
      const result = await window.electron.copy(sourcePath, fullDest);
      console.log('✅ Result from Electron:', result);

      if (result.success) {
        addLog(`Success: Copied to ${destIp}`, 'success');
        return true;
      } else {
        console.error('❌ Copy Failed:', result.error);
        addLog(`Error copying to ${destIp}: ${result.error}`, 'error');
        return false;
      }
    } catch (error) {
      console.error('💥 Exception during copy:', error);
      addLog(`Exception: ${error.message}`, 'error');
      return false;
    }
  };

  // --- 3. Delete File ---
  const deleteFile = async (destIp, destPath) => {
    // تبدیل مسیر ساده به UNC Path برای حذف
    // فرض: destPath شامل نام فایل است
    
    let targetPath = destPath;
    let targetDrive = 'C$';

    if (targetPath.includes(':')) {
        const parts = targetPath.split(':');
        targetDrive = `${parts[0].toUpperCase()}$`;
        targetPath = parts[1];
    }
    
    targetPath = targetPath.replace(/^[\/\\]+|[\/\\]+$/g, '');
    const uncPath = `\\\\${destIp}\\${targetDrive}\\${targetPath}`;

    addLog(`Deleting ${uncPath}...`, 'warning');
    
    if (!window.electron) return true;

    const result = await window.electron.delete(uncPath);
    if (result.success) {
      addLog(`Deleted from ${destIp}`, 'success');
      return true;
    } else {
      addLog(`Error deleting: ${result.error}`, 'error');
      return false;
    }
  };

  // --- 4. Service Management ---
  const manageService = async (ip, serviceName, action) => {
      // این بخش در TopSection مستقیماً صدا زده می‌شود
      // اما اگر بخواهید اینجا باشد:
      return await window.electron.manageService(ip, serviceName, action);
  };

  // بازگرداندن توابع و متغیرها
  return {
    logs,
    isRunning,
    setIsRunning,
    setLogs,
    checkConnection,
    copyFile,
    deleteFile,
    manageService
  };
};