import { useOperationStore } from "@/store"; // برای دسترسی به تنظیمات Auth
import { useState } from "react";

export const useSystemOperations = () => {
  const [logs, setLogs] = useState([]);

  // دریافت تنظیمات احراز هویت از استور
  const { authMode, username, password } = useOperationStore();

  // --- Helpers ---

  const addLog = (message, type = "default") => {
    console.log(`[${type.toUpperCase()}] ${message}`);
    setLogs((prev) => [...prev, { message, type }]);

    // Log to file via Electron
    if (window.electron) {
      window.electron.logToFile(`[${type.toUpperCase()}] ${message}`);
    }
  };

  const clearLogs = () => setLogs([]);

  // 🔐 1. Establish Authentication (Net Use)
  const establishConnection = async (ip) => {
    if (!window.electron) return true;

    // A. Current User (Default)
    if (authMode === "current") {
      // No action needed, uses current Windows session
      return true;
    }

    // B. Anonymous (Null Session)
    if (authMode === "anonymous") {
      const cmd = `net use \\\\${ip}\\IPC$ "" /u:""`;
      await window.electron.exec(cmd);
      return true;
    }

    // C. Specific Credentials
    if (authMode === "this") {
      if (!username || !password) {
        addLog(`Skipped: Missing credentials for ${ip}`, "error");
        return false;
      }

      addLog(`Authenticating as ${username}...`, "warning");

      // Clear previous sessions to avoid conflicts
      await window.electron.exec(`net use \\\\${ip}\\IPC$ /delete /y`);

      // Connect
      // Use standard Windows command: net use \\IP\IPC$ "Password" /u:"User"
      const cmd = `net use \\\\${ip}\\IPC$ "${password}" /u:"${username}"`;
      const res = await window.electron.exec(cmd);

      if (res.success) {
        addLog(`Authenticated successfully`, "success");
        return true;
      } else {
        addLog(`Authentication failed: ${res.error}`, "error");
        return false;
      }
    }

    return true;
  };

  // 🔓 2. Close Connection
  const closeConnection = async (ip) => {
    if (authMode === "this" && window.electron) {
      await window.electron.exec(`net use \\\\${ip}\\IPC$ /delete /y`);
    }
  };

  // 📡 3. Check Ping
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

    addLog(`${ip} is Offline. Skipping.`, "error");
    return false;
  };

  // ⚙️ 4. Manage Service
  const manageService = async (ip, serviceName, action) => {
    // Auth First
    const isAuth = await establishConnection(ip);
    if (!isAuth) return false;

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

  // ✉️ 5. Send Message
  const sendMessage = async (ip, message) => {
    // Auth First (RPC might need it)
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

  // 📂 6. File Copy (Secure)
  const copyFileSecure = async (src, destIp, destPath) => {
    // Auth First
    const isAuth = await establishConnection(destIp);
    if (!isAuth) return false;

    try {
      const fileName = src.split(/[/\\]/).pop();

      // Build UNC Path
      let targetPath = destPath || "HyperFamily\\Downloads";
      let targetDrive = "C$";
      if (targetPath.includes(":")) {
        const parts = targetPath.split(":");
        targetDrive = `${parts[0].toUpperCase()}$`;
        targetPath = parts[1];
      }
      targetPath = targetPath.replace(/^[\/\\]+|[\/\\]+$/g, "");
      const fullDest = `\\\\${destIp}\\${targetDrive}\\${targetPath}\\${fileName}`;

      // A. Check Exists
      const exists = await window.electron.existsRemote(fullDest);
      if (exists) {
        addLog(`File ${fileName} already exists. Skipped.`, "error");
        return "skipped";
      }

      // B. Copy
      addLog(`Copying ${fileName}...`, "default");
      const copyRes = await window.electron.copy(src, fullDest);

      if (!copyRes.success) {
        addLog(`Copy Failed: ${copyRes.error}`, "error");
        return false;
      }

      await new Promise((r) => setTimeout(r, 1000));

      // C. Verify Hash
      const localHash = await window.electron.checksum(src);
      const remoteHash = await window.electron.hashRemote(fullDest);

      if (localHash.success && remoteHash.success) {
        const hash1 = localHash.hash.toLowerCase().trim();
        const hash2 = remoteHash.hash.toLowerCase().trim();

        if (hash1 === hash2) {
          addLog(`${fileName} Copied & Verified`, "success");
          return true;
        } else {
          addLog(`Hash Mismatch! Retrying...`, "error");
          return "retry";
        }
      } else {
        addLog(`Verification Failed (Access Denied?)`, "error");
        return "retry";
      }
    } finally {
      // Always close connection
      await closeConnection(destIp);
    }
  };

  return {
    logs,
    setLogs,
    clearLogs,
    addLog,
    checkPing,
    manageService,
    sendMessage,
    copyFileSecure,
  };
};
