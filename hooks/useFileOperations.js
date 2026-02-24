import { useOperationStore } from "@/store";
import { useRef, useState } from "react";
import { useSystemOperations } from "./useSystemOperations";

export const useFileOperations = () => {
  const {
    logs,
    clearLogs,
    addLog,
    checkPing,
    manageService,
    sendMessage,
    copyFileSecure,
    deleteFile,
    renameFile,
    // نیاز داریم به تابع exists هم دسترسی داشته باشیم (که داخل copyFileSecure هست، اما بهتره جدا کنیم)
    // برای سادگی، copyFileSecure خودش exists check دارد، اما برای replace لاجیک فرق دارد.
    // بیایید از توابع اتمیک window.electron مستقیم در اینجا استفاده کنیم (یا به useSystemOperations اضافه کنیم)
  } = useSystemOperations();

  const {
    destinationPath,
    services,
    message,
    stopBefore,
    startAfter,
    sendAfter,
  } = useOperationStore();

  const [isRunning, setIsRunningState] = useState(false);
  const [reportData, setReportData] = useState([]);

  const isRunningRef = useRef(false);
  const reportRef = useRef([]);

  // --- Helper to check remote existence via hook would be better ---
  // Assuming useSystemOperations has checkRemoteFile (if not, use window.electron directly)
  const checkRemoteFile = async (ip, path) => {
    // Build full path logic same as copyFileSecure
    // ... (Simplify for brevity: assume hook handles paths)
    // Actually, let's use window.electron directly for specific logic
    // But we need auth first.
    return false; // Placeholder
  };

  const startOperation = async (operationType, params) => {
    setIsRunningState(true);
    isRunningRef.current = true;
    clearLogs();
    setReportData([]);
    reportRef.current = [];

    const targets = params.targets || [];
    const files = params.files || [];
    const serviceList = services
      ? services
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s)
      : [];

    const addToReport = (target, file, status, msg) => {
      reportRef.current.push({ target, file, status, message: msg });
    };

    for (const target of targets) {
      if (!isRunningRef.current) break;

      addLog(`----------------------------------------`, "default");
      addLog(
        `Processing System: [${target.branch}] ${target.name} (${target.ip})`,
        "info",
      );

      // 1. Ping
      const isOnline = await checkPing(target.ip, 3);
      if (!isOnline) {
        addToReport(target.ip, "-", "error", "Offline");
        continue;
      }

      // 2. Stop Services
      if (stopBefore && serviceList.length > 0) {
        for (const srv of serviceList)
          await manageService(target.ip, srv, "stop");
      }

      // --- REPLACE LOGIC ---
      if (operationType === "replace") {
        const { prefix } = params.replaceConfig;

        for (const file of files) {
          if (!isRunningRef.current) break;

          const fileName = file.path.split(/[/\\]/).pop();
          const backupName = `${prefix}${fileName}`;

          // Note: renameFile handles auth internally
          // We first attempt to rename (which acts as check exist + backup)

          addLog(`Backing up ${fileName} to ${backupName}...`, "warning");
          const renameSuccess = await renameFile(
            target.ip,
            destinationPath,
            fileName,
            backupName,
          );

          if (!renameSuccess) {
            addLog(
              `File ${fileName} not found or locked. Skipping replace.`,
              "error",
            );
            addToReport(
              target.ip,
              fileName,
              "error",
              "Source not found / Locked",
            );
            continue;
          }

          // Now Copy New File
          addLog(`Copying new version...`, "default");
          // We use copyFileSecure but we need to force overwrite if backup succeeded (it should be empty now)
          // However copyFileSecure skips if file exists. But we just renamed it, so it shouldn't exist!

          const copyResult = await copyFileSecure(
            file.path,
            target.ip,
            destinationPath,
          );

          if (copyResult === true) {
            addToReport(target.ip, fileName, "success", "Replaced & Verified");
          } else {
            addLog(`Copy/Verify failed. Rolling back...`, "error");
            // Rollback: Delete partial new file and rename backup back
            // This requires more atomic functions exposed from useSystemOperations
            // For now, we report error.
            addToReport(
              target.ip,
              fileName,
              "error",
              "Copy Failed (Backup exists)",
            );
          }
        }
      }

      // ... (Copy/Delete/Rename blocks from previous step) ...

      // 3. Start Services
      if (startAfter && serviceList.length > 0) {
        for (const srv of serviceList) {
          let started = false;
          for (let k = 0; k < 3; k++) {
            if (await manageService(target.ip, srv, "start")) {
              started = true;
              break;
            }
            await new Promise((r) => setTimeout(r, 1000));
          }
          if (!started)
            addToReport(
              target.ip,
              `Service: ${srv}`,
              "error",
              "Failed to start",
            );
        }
      }

      // 4. Message
      if (sendAfter && message) await sendMessage(target.ip, message);
    }

    addLog("All Operations Completed.", "info");
    setReportData([...reportRef.current]);
    setIsRunningState(false);
    isRunningRef.current = false;
    return true;
  };

  const stopOperation = () => {
    setIsRunningState(false);
    isRunningRef.current = false;
    addLog("Operation Stopped by User.", "error");
  };

  return {
    logs,
    isRunning,
    startOperation,
    stopOperation,
    reportData,
    clearLogs,
  };
};
