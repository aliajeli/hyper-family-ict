"use client";

import { useBranchMonitoring } from "@/hooks/useBranchMonitoring"; // 👈 Import

import BranchDetailsModal from "@/components/monitoring/BranchDetailsModal"; // 👈 Import
import { useDashboardData } from "@/hooks/useDashboardData"; // 👈 New Hook
import { cn } from "@/lib/utils";
import { useMonitoringStore, useSystemStore } from "@/store";
import useBranchStore from "@/store/branchStore";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Globe,
  Radio,
  Router,
  Server,
  Wifi,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

// --- Net Status Indicator ---
const NetIndicator = ({ label, status }) => {
  const colors = {
    online: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]",
    offline: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]",
    checking: "bg-amber-500 animate-pulse",
    unknown: "bg-slate-700",
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={cn(
          "w-3 h-3 rounded-full transition-all duration-500",
          colors[status],
        )}
      />
      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
};

// --- Branch Card (Widget) ---
const BranchWidget = ({ data }) => {
  const { name, ip, stats, net } = data;

  // Health Color
  const healthColor =
    stats.health === 100
      ? "text-emerald-400"
      : stats.health > 50
        ? "text-amber-400"
        : "text-rose-400";
  const borderColor =
    stats.health === 100
      ? "border-emerald-500/20"
      : stats.health > 50
        ? "border-amber-500/20"
        : "border-rose-500/20";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className={cn(
        "bg-[#1e293b]/40 backdrop-blur-md border rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 hover:bg-[#1e293b]/60 hover:shadow-xl group cursor-pointer",
        borderColor,
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-blue-500 block"></span>
            {name}
          </h3>
          <span className="text-[10px] text-slate-500 font-mono ml-3.5 block mt-0.5">
            {ip || "No Router IP"}
          </span>
        </div>

        {/* Health Score (Big Number) */}
        <div className="text-right">
          <div
            className={cn(
              "text-2xl font-black font-mono tracking-tighter",
              healthColor,
            )}
          >
            {stats.health}%
          </div>
          <div className="text-[9px] text-slate-500 uppercase tracking-wide">
            Health
          </div>
        </div>
      </div>

      {/* Network Status Grid */}
      <div className="grid grid-cols-3 gap-2 bg-slate-900/50 rounded-xl p-3 border border-slate-800/50">
        <NetIndicator label="Local" status={net.local} />
        <NetIndicator label="Intranet" status={net.ir} />
        <NetIndicator label="Internet" status={net.global} />
      </div>

      {/* System Stats Footer */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-700/30">
        <div className="flex gap-3">
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-500" /> {stats.online}{" "}
            Online
          </span>
          <span className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-500" />{" "}
            {stats.total - stats.online} Offline
          </span>
        </div>
        <span className="font-bold text-slate-600">{stats.total} Total</span>
      </div>
    </motion.div>
  );
};

const BottomSection = () => {
  const { systems, fetchSystems } = useSystemStore();
  // 👇 این خط را اصلاح کنید
  const { branches, fetchBranches } = useBranchStore();
  const data = useDashboardData(); // 👈 Custom Hook Usage

  const [selectedBranch, setSelectedBranch] = useState(null);
  useBranchMonitoring(branches);

  useEffect(() => {
    fetchSystems();
    fetchBranches();
  }, []);

  return (
    <div className="flex-1 bg-[#020617] overflow-y-auto p-6 relative border-t border-slate-800">
      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {data.map((branch) => (
          <div key={branch.id} onClick={() => setSelectedBranch(branch)}>
            <BranchWidget data={branch} />
          </div>
        ))}

        {/* Empty State */}
        {data.length === 0 && (
          <div className="col-span-full h-64 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-3xl">
            <Server className="w-12 h-12 mb-4 opacity-20" />
            <p>No branches configured.</p>
            <p className="text-xs">
              Go to Settings &gt; Locations to add branches.
            </p>
          </div>
        )}
      </div>

      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Detail Modal - Ensure this is OUTSIDE the grid div */}
      {selectedBranch && (
        <BranchDetailsModal
          isOpen={!!selectedBranch}
          onClose={() => setSelectedBranch(null)}
          branchData={selectedBranch}
        />
      )}
    </div>
  );
};

export default BottomSection;
