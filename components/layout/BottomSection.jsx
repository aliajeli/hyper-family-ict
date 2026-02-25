"use client";

import ContextMenu from "@/components/ui/ContextMenu";
import { cn } from "@/lib/utils";
import { useMonitoringStore, useSystemStore } from "@/store";
import useSettingsStore from "@/store/settingsStore"; // 👈 Import Settings
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Cpu,
  Info,
  MapPin,
  MessageSquare,
  Monitor,
  Network,
  Package,
  Power,
  Printer,
  RefreshCw,
  Router,
  Server,
  Settings,
  ShoppingCart,
  Terminal,
  Video,
  Wifi,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// --- Icon Helper ---
const DeviceIcon = ({ type, className }) => {
  const icons = {
    Router: Router,
    Kyan: Server,
    ESXi: Server,
    iLO: Server,
    Switch: Network,
    NVR: Video,
    Client: Monitor,
    Checkout: ShoppingCart,
  };
  const Icon = icons[type] || Monitor;
  return <Icon className={className} />;
};

// --- Status Dot ---
const StatusDot = ({ status }) => {
  const colors = {
    online: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]",
    offline: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]",
    checking: "bg-amber-500 animate-pulse",
    unknown: "bg-slate-700",
  };
  return (
    <div
      className={cn(
        "w-2 h-2 rounded-full transition-all duration-500 shrink-0",
        colors[status] || colors.unknown,
      )}
    />
  );
};

// --- Device Row ---
const DeviceItem = ({ device, status }) => {
  const { paths } = useSettingsStore(); // 👈 Get paths from settings

  // --- Actions ---
  const handleConnectRDP = () => {
    if (window.electron) {
      toast.loading(`RDP to ${device.ip}...`);
      window.electron.connectRDP(device.ip);
    } else toast.success(`[Mock] RDP ${device.ip}`);
  };

  const handleWinbox = () => {
    if (!paths.winbox)
      return toast.error("Winbox path not configured in Settings");

    if (window.electron) {
      toast.loading(`Launching Winbox for ${device.ip}...`);
      // Winbox args: ip user password
      window.electron.launchApp(paths.winbox, [device.ip]);
    } else {
      toast.success(`[Mock] Winbox ${device.ip}`);
    }
  };

  const handleSSH = () => {
    if (!paths.putty) return toast.error("SSH Client path not configured");

    if (window.electron) {
      toast.loading(`Opening SSH to ${device.ip}...`);
      window.electron.launchApp(paths.putty, ["-ssh", device.ip]);
    }
  };

  const handleTeamViewer = () => {
    if (!paths.teamviewer) return toast.error("TeamViewer path not configured");

    if (window.electron) {
      toast.loading("Opening TeamViewer...");
      window.electron.launchApp(paths.teamviewer, ["-i", device.ip]);
    }
  };

  const handlePing = async () => {
    toast("Pinging...", { icon: "🔍" });
    if (window.electron) {
      const res = await window.electron.exec(`ping -n 1 ${device.ip}`);
      if (res.success && !res.output.includes("Unreachable"))
        toast.success(`${device.ip} is Online`);
      else toast.error(`${device.ip} is Offline`);
    }
  };

  // --- Context Menu Logic ---
  const getContextMenuItems = (type) => {
    const common = [
      {
        label: "System Info",
        icon: <Info className="w-3.5 h-3.5" />,
        onClick: () => toast("Info coming soon"),
      },
      {
        label: "Ping Check",
        icon: <Activity className="w-3.5 h-3.5" />,
        onClick: handlePing,
      },
    ];

    if (type === "Client" || type === "Checkout")
      return [
        {
          label: "Remote Desktop",
          icon: <Monitor className="w-3.5 h-3.5" />,
          onClick: handleConnectRDP,
        },
        {
          label: "TeamViewer",
          icon: <Monitor className="w-3.5 h-3.5" />,
          onClick: handleTeamViewer,
        },
        { separator: true },
        { label: "Services", icon: <Settings className="w-3.5 h-3.5" /> },
        {
          label: "Restart",
          icon: <RefreshCw className="w-3.5 h-3.5" />,
          danger: true,
        },
        ...common,
      ];

    if (type === "Router")
      return [
        {
          label: "Winbox",
          icon: <Router className="w-3.5 h-3.5" />,
          onClick: handleWinbox,
        },
        {
          label: "SSH Terminal",
          icon: <Terminal className="w-3.5 h-3.5" />,
          onClick: handleSSH,
        },
        ...common,
      ];

    if (type === "Switch")
      return [
        {
          label: "SSH Terminal",
          icon: <Terminal className="w-3.5 h-3.5" />,
          onClick: handleSSH,
        },
        ...common,
      ];

    return common;
  };

  return (
    <ContextMenu items={getContextMenuItems(device.type)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ x: 4, backgroundColor: "rgba(30, 41, 59, 0.8)" }}
        className="group flex items-center gap-3 px-3 py-2 rounded-lg border border-transparent hover:border-slate-700/50 cursor-pointer transition-all duration-200"
      >
        <StatusDot status={status} />

        <div
          className={cn(
            "p-1.5 rounded-md transition-colors",
            status === "online"
              ? "bg-emerald-500/10 text-emerald-400"
              : status === "offline"
                ? "bg-rose-500/10 text-rose-400"
                : "bg-slate-700/30 text-slate-400",
          )}
        >
          <DeviceIcon type={device.type} className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-slate-200 truncate group-hover:text-white transition-colors">
            {device.name}
          </div>
          <div className="text-[10px] text-slate-500 font-mono truncate group-hover:text-slate-400">
            {device.ip}
          </div>
        </div>

        {status === "offline" && (
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </motion.div>
    </ContextMenu>
  );
};

// --- Branch Column ---
const BranchColumn = ({ branchName, systems, statuses }) => {
  const branchSystems = systems.filter((s) => s.branch === branchName);
  const onlineCount = branchSystems.filter(
    (s) => statuses[s.id]?.status === "online",
  ).length;
  const totalCount = branchSystems.length;

  const health =
    totalCount > 0 ? Math.round((onlineCount / totalCount) * 100) : 0;
  let healthColor = "bg-slate-700";
  if (totalCount > 0) {
    if (health === 100)
      healthColor = "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]";
    else if (health > 50) healthColor = "bg-amber-500";
    else healthColor = "bg-rose-500";
  }

  return (
    <div className="flex flex-col w-[260px] min-w-[260px] h-full bg-[#0f172a] border-r border-slate-800 last:border-r-0 relative group">
      <div className="p-4 border-b border-slate-800 bg-[#0f172a] sticky top-0 z-10">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-400" /> {branchName}
            </h3>
          </div>
          <div
            className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors duration-500",
              onlineCount === totalCount && totalCount > 0
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-slate-800 text-slate-400 border-slate-700",
            )}
          >
            {onlineCount}/{totalCount}
          </div>
        </div>
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-2">
          <div
            className={cn(
              "h-full transition-all duration-1000 ease-out rounded-r-full",
              healthColor,
            )}
            style={{ width: `${health}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar bg-[#0b1120]">
        {branchSystems.length > 0 ? (
          branchSystems.map((sys) => (
            <DeviceItem
              key={sys.id}
              device={sys}
              status={statuses[sys.id]?.status || "unknown"}
            />
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-40 gap-2">
            <Package className="w-8 h-8" strokeWidth={1} />
            <span className="text-[10px]">No Devices Configured</span>
          </div>
        )}
      </div>
    </div>
  );
};

const BottomSection = () => {
  const { systems, fetchSystems } = useSystemStore();
  const { statuses, isMonitoring } = useMonitoringStore();
  const branches = ["Lahijan", "Ramsar", "Nowshahr", "Royan"];

  useEffect(() => {
    fetchSystems();
  }, []);

  const totalDevices = systems.length;
  const onlineDevices = Object.values(statuses).filter(
    (s) => s.status === "online",
  ).length;
  const offlineDevices = Object.values(statuses).filter(
    (s) => s.status === "offline",
  ).length;

  return (
    <div className="flex-1 flex flex-col bg-[#020617] overflow-hidden relative border-t border-slate-800">
      <div className="h-9 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between px-4 shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" /> NETWORK OVERVIEW
          </span>
          <div className="h-4 w-px bg-slate-700"></div>
          <span className="text-[10px] text-slate-500">
            Total Nodes:{" "}
            <span className="text-slate-300 font-mono">{totalDevices}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          {isMonitoring && (
            <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-medium text-emerald-400 tracking-wide">
                LIVE MONITORING
              </span>
            </div>
          )}
          <div className="flex gap-2">
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 rounded border border-emerald-500/20">
              ON: {onlineDevices}
            </span>
            <span className="text-[10px] text-rose-400 font-mono bg-rose-500/10 px-1.5 rounded border border-rose-500/20">
              OFF: {offlineDevices}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden bg-[#020617]">
        <div className="flex h-full divide-x divide-slate-800 min-w-max">
          {branches.map((branchName) => (
            <BranchColumn
              key={branchName}
              branchName={branchName}
              systems={systems}
              statuses={statuses}
            />
          ))}
          <div className="w-[100px] h-full bg-[#0f172a]/20 flex items-center justify-center border-r border-slate-800/50">
            <MapPin className="w-6 h-6 text-slate-700 opacity-50" />
          </div>
        </div>
      </div>

      <div className="h-6 bg-[#0f172a] border-t border-slate-800 flex items-center justify-between px-3 text-[9px] text-slate-600 shrink-0 select-none">
        <span>Hyper Family Network Operations Center</span>
        <span className="font-mono">
          v1.2.0 • Last Sync: {new Date().toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default BottomSection;
