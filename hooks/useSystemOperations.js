import { useOperationStore } from "@/store";
import { useState } from "react";

export const useSystemOperations = () => {
  const [logs, setLogs] = useState([]);
  const { authMode, username, password } = useOperationStore();

  // --- Logger ---
  const addLog = (message, type = "default") => {
    // types: default, info, success, warning, error
    console.log(`[${type.toUpperCase()}] ${message}`);
    setLogs((prev) => [...prev, { message, type }]);

    if (window.electron) {
      window.electron.logToFile(`[${type.toUpperCase()}] ${message}`);
    }
  };

  const clearLogs = () => setLogs([]);

  // --- Authentication ---
  const establishConnection = async (ip) => {
    if (!window.electron) return true;

    if (authMode === "current") return true;

    if (authMode === "anonymous") {
      await window.electron.exec(`net use \\\\${ip}\\IPC$ "" /u:""`);
      return true;
    }

    if (authMode === "this") {
      if (!username || !password) {
        addLog(`Missing credentials for ${ip}`, "error");
        return false;
      }

      // Disconnect first to be safe
      await window.electron.exec(`net use \\\\${ip}\\IPC$ /delete /y`);

      const cmd = `net use \\\\${ip}\\IPC$ "${password}" /u:"${username}"`;
      const res = await window.electron.exec(cmd);

      if (res.success) return true;

      addLog(`Authentication failed: ${res.error}`, "error");
      return false;
    }
    return true;
  };

  const closeConnection = async (ip) => {
    if (authMode === "this" && window.electron) {
      await window.electron.exec(`net use \\\\${ip}\\IPC$ /delete /y`);
    }
  };

  // --- Network Check ---
  const checkPing = async (ip, retries = 3) => {
    for (let i = 1; i <= retries; i++) {
      if (i > 1) addLog(`Connection attempt ${i}/${retries}...`, "warning");

      try {
        if (!window.electron) return true;
        const res = await window.electron.exec(`ping -n 1 ${ip}`);

        if (
          res.success &&
          !res.output.includes("Unreachable") &&
          !res.output.includes("timed out")
        ) {
          addLog(`${ip} is Online`, "success");
          return true;
        }
      } catch (e) {}

      if (i < retries) await new Promise((r) => setTimeout(r, 1500));
    }

    addLog(`${ip} is Offline`, "error");
    return false;
  };

  // --- Service Management ---
  const manageService = async (ip, serviceName, action) => {
    await establishConnection(ip);
    try {
      if (!window.electron) return true;
      const res = await window.electron.manageService(ip, serviceName, action);

      if (res.success) {
        addLog(`Service ${serviceName} ${action}ed`, "success");
        return true;
      } else {
        addLog(`Failed to ${action} ${serviceName}: ${res.error}`, "error");
        return false;
      }
    } finally {
      await closeConnection(ip);
    }
  };

  // --- Send Message ---
  const sendMessage = async (ip, message) => {
    await establishConnection(ip);
    try {
      if (!window.electron) return true;
      const res = await window.electron.sendMsg(ip, message);
      if (res.success) {
        addLog(`Message sent to ${ip}`, "success");
        return true;
      } else {
        addLog(`Message failed: ${res.error}`, "error");
        return false;
      }
    } finally {
      await closeConnection(ip);
    }
  };

  // --- Copy File ---
  const copyFileSecure = async (src, destIp, destPath) => {
    await establishConnection(destIp);
    try {
      const fileName = src.split(/[/\\]/).pop();

      // Build UNC Path (Default to C$)
      let targetPath = destPath || "HyperFamily\\Downloads";
      let targetDrive = "C$";

      if (targetPath.includes(":")) {
        const parts = targetPath.split(":");
        targetDrive = `${parts[0].toUpperCase()}$`;
        targetPath = parts[1];
      }
      targetPath = targetPath.replace(/^[\/\\]+|[\/\\]+$/g, "");
      const fullDest = `\\\\${destIp}\\${targetDrive}\\${targetPath}\\${fileName}`;

      // Check Exists
      const exists = await window.electron.existsRemote(fullDest);
      if (exists) {
        addLog(`File ${fileName} already exists. Skipped.`, "error");
        return "skipped";
      }

      // Copy
      addLog(`Copying ${fileName}...`, "default");
      const copyRes = await window.electron.copy(src, fullDest);

      if (!copyRes.success) {
        addLog(`Copy Failed: ${copyRes.error}`, "error");
        return false;
      }

      await new Promise((r) => setTimeout(r, 1000));

      // Verify Hash
      const localHash = await window.electron.checksum(src);
      const remoteHash = await window.electron.hashRemote(fullDest);

      if (localHash.success && remoteHash.success) {
        if (localHash.hash.toLowerCase() === remoteHash.hash.toLowerCase()) {
          addLog(`${fileName} Verified`, "success");
          return true;
        } else {
          addLog(`Hash Mismatch!`, "error");
          return "retry";
        }
      } else {
        addLog(`Verification Failed (Access?)`, "error");
        return "retry";
      }
    } finally {
      await closeConnection(destIp);
    }
  };

  // --- Delete File ---
  const deleteFile = async (destIp, destPath) => {
    await establishConnection(destIp);
    try {
      let targetPath = destPath;
      let targetDrive = "C$";

      if (targetPath.includes(":")) {
        const parts = targetPath.split(":");
        targetDrive = `${parts[0].toUpperCase()}$`;
        targetPath = parts[1];
      }

      targetPath = targetPath.replace(/^[\/\\]+|[\/\\]+$/g, "");
      const uncPath = `\\\\${destIp}\\${targetDrive}\\${targetPath}`;

      addLog(`Deleting ${uncPath}...`, "warning");

      if (!window.electron) return true;

      const result = await window.electron.delete(uncPath);
      if (result.success) {
        addLog(`Deleted successfully`, "success");
        return true;
      } else {
        addLog(`Error deleting: ${result.error}`, "error");
        return false;
      }
    } finally {
      await closeConnection(destIp);
    }
  };

  // --- Rename File ---
  const renameFile = async (destIp, destPath, oldName, newName) => {
    await establishConnection(destIp);
    try {
      let targetPath = destPath || "HyperFamily\\Downloads";
      let targetDrive = "C$";
      if (targetPath.includes(":")) {
        const parts = targetPath.split(":");
        targetDrive = `${parts[0].toUpperCase()}$`;
        targetPath = parts[1];
      }
      targetPath = targetPath.replace(/^[\/\\]+|[\/\\]+$/g, "");

      const oldFullPath = `\\\\${destIp}\\${targetDrive}\\${targetPath}\\${oldName}`;
      const newFullPath = `\\\\${destIp}\\${targetDrive}\\${targetPath}\\${newName}`;

      addLog(`Renaming ${oldName} to ${newName}...`, "default");

      if (!window.electron) return true;

      const result = await window.electron.rename(oldFullPath, newFullPath);
      if (result.success) {
        addLog(`Renamed successfully`, "success");
        return true;
      } else {
        addLog(`Error renaming: ${result.error}`, "error");
        return false;
      }
    } finally {
      await closeConnection(destIp);
    }
  };

  // ... (Return renameFile)
  return {
    logs,
    setLogs,
    clearLogs,
    addLog,
    checkPing,
    manageService,
    sendMessage,
    copyFileSecure,
    deleteFile,
    renameFile, // 👈 این خط را اضافه کنید
  };
};
