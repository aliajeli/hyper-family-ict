import { useBranchStore, useMonitoringStore, useSystemStore } from "@/store"; // فرض کنیم useBranchStore اکسپورت شده

export const useDashboardData = () => {
  const { systems } = useSystemStore();
  const { branches } = useBranchStore(); // 👈 دریافت شعبه‌ها از استور
  const { statuses, branchStatus } = useMonitoringStore(); // 👈 branchStatus برای پینگ روتر

  // تبدیل لیست شعبه‌ها به داده‌های داشبورد
  const dashboardData = branches.map((branch) => {
    // 1. Systems in Branch
    const branchSystems = systems.filter((s) => s.branch === branch.name);
    const total = branchSystems.length;
    const online = branchSystems.filter(
      (s) => statuses[s.id]?.status === "online",
    ).length;
    const health = total > 0 ? Math.round((online / total) * 100) : 0;

    // 2. Router Status (From monitoring store)
    // branchStatus ساختار: { "branchId": { local: 'online', ir: 'offline', global: 'checking' } }
    const status = branchStatus[branch.id] || {};

    return {
      id: branch.id,
      name: branch.name,
      ip: branch.routerIp,
      stats: { total, online, health },
      net: {
        local: status.local || "unknown",
        ir: status.ir || "unknown",
        global: status.global || "unknown",
      },
      systems: branchSystems,
    };
  });

  return dashboardData;
};
