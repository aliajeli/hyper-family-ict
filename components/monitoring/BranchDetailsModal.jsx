"use client";

import { Badge, Modal } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  Server,
  Monitor,
  Activity,
  CheckCircle,
  XCircle,
  Router,
} from "lucide-react";

const BranchDetailsModal = ({ isOpen, onClose, branchData }) => {
  if (!branchData) return null;

  const { name, ip, systems, stats, net } = branchData;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${name} Overview`}
      size="lg"
      className="bg-[#0f172a] border-slate-700 h-[600px] flex flex-col p-0 overflow-hidden"
    >
      {/* Header Stats */}
      <div className="bg-[#1e293b] p-4 border-b border-slate-700 flex justify-between items-center">
        <div className="flex gap-4">
          <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
            <div className="text-[10px] text-slate-400 uppercase font-bold">
              Router IP
            </div>
            <div className="text-sm font-mono text-white">{ip || "N/A"}</div>
          </div>
          <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
            <div className="text-[10px] text-slate-400 uppercase font-bold">
              Network Status
            </div>
            <div className="flex gap-2 mt-1">
              <Badge
                variant={net.local === "online" ? "success" : "danger"}
                className="text-[10px] h-4 px-1"
              >
                Local
              </Badge>
              <Badge
                variant={net.ir === "online" ? "success" : "danger"}
                className="text-[10px] h-4 px-1"
              >
                Intranet
              </Badge>
              <Badge
                variant={net.global === "online" ? "success" : "danger"}
                className="text-[10px] h-4 px-1"
              >
                Internet
              </Badge>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{stats.health}%</div>
          <div className="text-xs text-slate-500">System Health</div>
        </div>
      </div>

      {/* System List */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#0f172a]">
        <div className="grid grid-cols-1 gap-2">
          {systems.map((sys, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-[#1e293b]/50 border border-slate-700 rounded-xl hover:bg-[#1e293b] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2 rounded-lg bg-slate-800",
                    sys.status === "online"
                      ? "text-emerald-400"
                      : "text-slate-500",
                  )}
                >
                  {sys.type === "Router" ? (
                    <Router className="w-5 h-5" />
                  ) : (
                    <Monitor className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">
                    {sys.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {sys.ip}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Status Dot */}
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    sys.status === "online"
                      ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                      : "bg-rose-500",
                  )}
                />
                <span
                  className={cn(
                    "text-xs font-medium",
                    sys.status === "online"
                      ? "text-emerald-400"
                      : "text-rose-400",
                  )}
                >
                  {sys.status === "online" ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          ))}
          {systems.length === 0 && (
            <div className="text-center text-slate-500 py-10">
              No systems monitored in this branch.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default BranchDetailsModal;
