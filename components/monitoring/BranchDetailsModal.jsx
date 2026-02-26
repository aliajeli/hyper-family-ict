"use client";

import { Badge, Modal } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useMonitoringStore } from "@/store";
import {
  Activity,
  Monitor,
  Network,
  Router,
  Server,
  ShoppingCart,
  Video,
} from "lucide-react";

// Helper Icon
const DeviceIcon = ({ type, className }) => {
  const icons = { Router, Server, Network, Video, Monitor, ShoppingCart };
  const Icon = icons[type] || Monitor;
  return <Icon className={className} />;
};

const BranchDetailsModal = ({ isOpen, onClose, branchData }) => {
  const { statuses, branchStatus } = useMonitoringStore();

  if (!branchData) return null;

  const { name, ip, systems, stats, id } = branchData;
  const netStatus = branchStatus[id] || {};

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${name} Overview`}
      size="lg"
      className="bg-[#0f172a] border-slate-700 h-[600px] flex flex-col p-0 overflow-hidden shadow-2xl rounded-2xl"
    >
      {/* --- HEADER STATS --- */}
      <div className="bg-[#1e293b]/80 backdrop-blur-md p-6 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-6">
          {/* Router Info */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Router className="w-4 h-4 text-blue-400" /> Primary Router
            </div>
            <div className="text-xl font-mono text-white tracking-tight">
              {ip || "Not Configured"}
            </div>

            {/* Router Status Badge */}
            <div className="flex mt-1">
              <Badge
                variant={netStatus.local === "online" ? "success" : "danger"}
                className={cn(
                  "text-[10px] h-5 px-2 font-mono uppercase tracking-wide",
                  netStatus.local === "online"
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : "bg-rose-500/20 text-rose-400 border-rose-500/30",
                )}
              >
                {netStatus.local === "online" ? "REACHABLE" : "UNREACHABLE"}
              </Badge>
            </div>
          </div>

          {/* Vertical Separator */}
          <div className="w-px h-12 bg-slate-700/50 hidden sm:block"></div>

          {/* Quick Stats */}
          <div className="flex flex-col justify-center">
            <span className="text-xs text-slate-500 font-medium uppercase">
              Total Devices
            </span>
            <span className="text-2xl font-bold text-slate-200">
              {systems.length}
            </span>
          </div>
        </div>

        {/* Health Score */}
        <div className="text-right">
          <div
            className={cn(
              "text-5xl font-black font-mono tracking-tighter drop-shadow-lg",
              stats.health === 100
                ? "text-emerald-400"
                : stats.health > 50
                  ? "text-amber-400"
                  : "text-rose-400",
            )}
          >
            {stats.health}%
          </div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wide font-bold mt-1">
            Uptime Health
          </div>
        </div>
      </div>

      {/* --- SYSTEMS LIST --- */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#020617] min-h-0 custom-scrollbar">
        <div className="grid grid-cols-1 gap-3">
          {systems.map((sys, i) => {
            const liveStatus = statuses[sys.id]?.status || "unknown";
            const isOnline = liveStatus === "online";

            return (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-[#1e293b]/40 border border-slate-800 rounded-xl hover:bg-[#1e293b] hover:border-slate-600 transition-all group"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <div
                    className={cn(
                      "p-2.5 rounded-xl transition-colors shadow-inner",
                      isOnline
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-slate-800 text-slate-500",
                    )}
                  >
                    <DeviceIcon type={sys.type} className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="text-sm font-bold text-slate-200 truncate">
                      {sys.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
                      {sys.ip}
                      <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                      <span className="opacity-70 text-slate-400 uppercase">
                        {sys.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pl-4 border-l border-slate-800/50">
                  {isOnline ? (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">
                        ONLINE
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                      <span className="text-[10px] font-bold text-rose-400 uppercase">
                        OFFLINE
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {systems.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50 gap-2 mt-10">
              <Server className="w-12 h-12 stroke-[1]" />
              <span className="text-xs">No devices found.</span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default BranchDetailsModal;
