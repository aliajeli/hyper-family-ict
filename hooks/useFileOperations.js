import { useOperationStore } from "@/store";
import { useRef, useState } from "react";
import { useSystemOperations } from "./useSystemOperations";

export const useFileOperations = () => {
  const {
    logs,
    clearLogs, // 👈
    addLog,
    checkPing,
    manageService,
    sendMessage,
    copyFileSecure,
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
  const [reportData, setReportData] = useState([]); // 👈 Store results
  const isRunningRef = useRef(false);

  const startOperation = async (operationType, params) => {
    setIsRunningState(true);
    isRunningRef.current = true;

    // Clear previous logs and report
    clearLogs();
    setReportData([]);
    let currentReport = []; // Local var for accumulation

    const targets = params.targets || [];
    const files = params.files || [];
    const serviceList = services
      ? services
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s)
      : [];

    // Helper to add report
    const addToReport = (target, file, status, msg) => {
      const entry = { target, file, status, message: msg };
      currentReport.push(entry);
      // We update state immediately so UI *could* show progress, or wait till end
      // setReportData([...currentReport]);
    };

    for (const target of targets) {
      if (!isRunningRef.current) break;

      addLog(`----------------------------------------`, "default");
      addLog(
        `Processing System: [${target.branch}] ${target.name} (${target.ip})`,
        "info",
      );

      // 1. Check Ping
      const isOnline = await checkPing(target.ip, 3);
      if (!isOnline) {
        addToReport(target.ip, "-", "error", "Offline / Unreachable");
        continue;
      }

      // 5. Stop Services
      if (stopBefore && serviceList.length > 0) {
        for (const srv of serviceList) {
          const res = await manageService(target.ip, srv, "stop");
          if (!res)
            addToReport(
              target.ip,
              `Service: ${srv}`,
              "error",
              "Failed to stop",
            );
        }
      }

      // File Operations
      if (operationType === "copy") {
        for (const file of files) {
          if (!isRunningRef.current) break;

          let attempts = 0;
          let success = false;
          let finalMsg = "";

          while (attempts < 2 && !success) {
            const result = await copyFileSecure(
              file.path,
              target.ip,
              destinationPath,
            );

            if (result === true) {
              success = true;
              addToReport(target.ip, file.name, "success", "Copied & Verified");
            } else if (result === "skipped") {
              success = true;
              addToReport(target.ip, file.name, "skipped", "File exists");
            } else if (result === "retry") {
              addLog(`Retrying...`, "warning");
              attempts++;
              finalMsg = "Verification/Copy Failed";
            } else {
              finalMsg = "Copy Error";
              break;
            }
          }

          if (!success) {
            addToReport(target.ip, file.name, "error", finalMsg);
          }
        }
      }

      // 8. Start Services
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

      // Message
      if (sendAfter && message) {
        await sendMessage(target.ip, message);
      }
    }

    addLog("All Operations Completed.", "info");

    setReportData(currentReport); // Update final report data
    setIsRunningState(false);
    isRunningRef.current = false;

    return true; // Signal completion
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
    reportData, // 👈 Export report data
    clearLogs,
  };
};
