import { useMonitoringStore } from "@/store";
import useSettingsStore from "@/store/settingsStore";
import { useEffect, useRef } from "react";

export const useBranchMonitoring = (branches) => {
  const { isMonitoring, setBranchStatus } = useMonitoringStore();
  const { routerPingInterval, irTarget, globalTarget } = useSettingsStore();
  const timerRef = useRef(null);

  const checkRouters = async () => {
    for (const branch of branches) {
      if (!branch.routerIp) continue;

      // 1. Local Check (Ping Router from Server)
      const localRes = await window.electron.exec(
        `ping -n 1 ${branch.routerIp}`,
      );
      const isLocalUp =
        localRes.success && !localRes.output.includes("Unreachable");

      setBranchStatus(branch.id, "local", isLocalUp ? "online" : "offline");

      // Only check internet if router is reachable
      if (isLocalUp) {
        // TODO: Get router credentials from secure store or settings
        const user = "admin";
        const pass = "password";

        // 2. Intranet Check
        const irRes = await window.electron.sshPing(
          branch.routerIp,
          irTarget,
          user,
          pass,
        );
        setBranchStatus(branch.id, "ir", irRes.success ? "online" : "offline");

        // 3. Internet Check
        const globalRes = await window.electron.sshPing(
          branch.routerIp,
          globalTarget,
          user,
          pass,
        );
        setBranchStatus(
          branch.id,
          "global",
          globalRes.success ? "online" : "offline",
        );
      } else {
        setBranchStatus(branch.id, "ir", "offline");
        setBranchStatus(branch.id, "global", "offline");
      }
    }

    if (isMonitoring) {
      timerRef.current = setTimeout(checkRouters, routerPingInterval);
    }
  };
  useEffect(() => {
    if (isMonitoring && branches.length > 0) {
      checkRouters();
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => clearTimeout(timerRef.current);
  }, [isMonitoring, branches]);
};
