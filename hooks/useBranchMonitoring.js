import { useMonitoringStore, useSystemStore } from "@/store";
import useSettingsStore from "@/store/settingsStore";
import { useEffect, useRef } from "react";

export const useBranchMonitoring = (branches) => {
  const { isMonitoring, setBranchStatus } = useMonitoringStore();
  const { systems } = useSystemStore();
  const { routerPingInterval } = useSettingsStore();
  const timerRef = useRef(null);

  useEffect(() => {
    if (isMonitoring && branches.length > 0) {
      checkRouters();
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => clearTimeout(timerRef.current);
  }, [isMonitoring, branches, systems]);

  const checkRouters = async () => {
    for (const branch of branches) {
      // Find Router IP
      const routerSystem = systems.find(
        (s) => s.branch === branch.name && s.type === "Router",
      );
      const targetIp = branch.routerIp || routerSystem?.ip;

      if (!targetIp) {
        setBranchStatus(branch.id, "local", "unknown");
        continue;
      }

      // Simple Ping Check
      const localRes = await window.electron.exec(`ping -n 1 ${targetIp}`);
      const isOnline =
        localRes.success &&
        !localRes.output.includes("Unreachable") &&
        !localRes.output.includes("timed out");

      setBranchStatus(branch.id, "local", isOnline ? "online" : "offline");
    }

    if (useMonitoringStore.getState().isMonitoring) {
      timerRef.current = setTimeout(checkRouters, routerPingInterval || 60000);
    }
  };
};
