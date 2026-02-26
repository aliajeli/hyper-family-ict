"use client";

import BranchDetailsModal from "@/components/monitoring/BranchDetailsModal";
import { useBranchMonitoring } from "@/hooks/useBranchMonitoring";
import { useDashboardData } from "@/hooks/useDashboardData";
import { cn } from "@/lib/utils";
import { useMonitoringStore, useSystemStore } from "@/store";
import useBranchStore from "@/store/branchStore";
import { motion } from "framer-motion";
import {
  Activity,
  CheckCircle,
  MapPin,
  Router,
  Server,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

// --- Branch Widget (Redesigned) ---
const BranchWidget = ({ data }) => {
  const { name, ip, stats, net } = data;

  // Color Logic
  const isHealthy = stats.health === 100;
  const isCritical = stats.health < 50;

  const statusColor = isHealthy
    ? "text-emerald-400"
    : isCritical
      ? "text-rose-400"
      : "text-amber-400";
  const ringColor = isHealthy
    ? "border-emerald-500"
    : isCritical
      ? "border-rose-500"
      : "border-amber-500";
  const shadowColor = isHealthy
    ? "shadow-emerald-500/20"
    : isCritical
      ? "shadow-rose-500/20"
      : "shadow-amber-500/20";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className={cn(
        "relative bg-[#1e293b]/40 backdrop-blur-md border rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:bg-[#1e293b]/60 hover:shadow-xl group cursor-pointer h-40",
        isHealthy
          ? "border-emerald-500/20"
          : isCritical
            ? "border-rose-500/20"
            : "border-amber-500/20",
        shadowColor,
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MapPin className={cn("w-4 h-4", statusColor)} />
            {name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                net.local === "online"
                  ? "bg-emerald-500 animate-pulse"
                  : "bg-slate-600",
              )}
            />
            <span className="text-[10px] text-slate-500 font-mono">
              {ip || "No Router"}
            </span>
          </div>
        </div>

        {/* Circular Health Gauge */}
        <div
          className={cn(
            "w-12 h-12 rounded-full border-4 flex items-center justify-center bg-[#0f172a]",
            ringColor,
          )}
        >
          <span className={cn("text-xs font-bold", statusColor)}>
            {stats.health}%
          </span>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-2 gap-2 mt-auto">
        <div className="bg-[#0f172a]/50 rounded-lg p-2 flex items-center gap-2 border border-slate-700/50">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Online</div>
            <div className="text-sm font-bold text-white">{stats.online}</div>
          </div>
        </div>
        <div className="bg-[#0f172a]/50 rounded-lg p-2 flex items-center gap-2 border border-slate-700/50">
          <XCircle className="w-3.5 h-3.5 text-rose-500" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Offline</div>
            <div className="text-sm font-bold text-white">
              {stats.total - stats.online}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const BottomSection = () => {
  const { fetchSystems } = useSystemStore();
  const { branches, fetchBranches } = useBranchStore();
  const { isMonitoring, statuses } = useMonitoringStore();
  const data = useDashboardData();
  const [selectedBranch, setSelectedBranch] = useState(null);

  useBranchMonitoring(branches);

  useEffect(() => {
    fetchSystems();
    fetchBranches();
  }, []);

  const totalDevices = data.reduce((acc, b) => acc + b.stats.total, 0);
  const onlineDevices = Object.values(statuses).filter(
    (s) => s.status === "online",
  ).length;

  return (
    <div className="flex-1 bg-[#020617] overflow-y-auto p-6 relative border-t border-slate-800">
      {/* Header Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-bold text-slate-200">
            Network Dashboard
          </h2>
          <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
            {totalDevices} Nodes
          </span>
        </div>
        {isMonitoring && (
          <span className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            System Monitoring Active
          </span>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 pb-10">
        {data.map((branch) => (
          <div key={branch.id} onClick={() => setSelectedBranch(branch)}>
            <BranchWidget data={branch} />
          </div>
        ))}

        {data.length === 0 && (
          <div className="col-span-full h-64 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-3xl">
            <Server className="w-12 h-12 mb-4 opacity-20" />
            <p>No branches configured.</p>
          </div>
        )}
      </div>

      <BranchDetailsModal
        isOpen={!!selectedBranch}
        onClose={() => setSelectedBranch(null)}
        branchData={selectedBranch}
      />
    </div>
  );
};

export default BottomSection;
