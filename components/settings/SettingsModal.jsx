"use client";

import { Button, Input, Modal } from "@/components/ui";
import { cn } from "@/lib/utils";
import useBranchStore from "@/store/branchStore"; // 👈 Import Branch Store
import useSettingsStore from "@/store/settingsStore";
import {
  AlertTriangle,
  CheckCircle,
  Database,
  Download,
  FolderOpen,
  MapPin,
  Monitor,
  Moon,
  Network,
  Palette,
  Save,
  Settings,
  Sun,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const THEMES = [
  { id: "dark", label: "Dark Professional", icon: Moon, color: "bg-slate-700" },
  {
    id: "light",
    label: "Light Clean",
    icon: Sun,
    color: "bg-slate-200 text-slate-800",
  },
  { id: "ocean", label: "Ocean Blue", icon: Monitor, color: "bg-blue-900" },
  {
    id: "forest",
    label: "Forest Green",
    icon: Palette,
    color: "bg-emerald-900",
  },
];

const IR_SERVERS = [
  { label: "AsiaTech", ip: "94.183.172.110" },
  { label: "Pars Online", ip: "91.98.31.1" },
  { label: "Respina", ip: "5.202.100.1" },
  { label: "Shatel", ip: "85.15.1.14" },
  { label: "MCI", ip: "151.232.0.1" },
  { label: "MTN", ip: "5.213.233.1" },
  { label: "Custom", ip: "custom" },
];

const GLOBAL_SERVERS = [
  { label: "Google DNS 1", ip: "8.8.8.8" },
  { label: "Google DNS 2", ip: "8.8.4.4" },
  { label: "Cloudflare 1", ip: "1.1.1.1" },
  { label: "Cloudflare 2", ip: "1.0.0.1" },
  { label: "OpenDNS", ip: "208.67.222.222" },
  { label: "Quad9", ip: "9.9.9.9" },
  { label: "Google.com", ip: "google.com" },
  { label: "Hetzner", ip: "hetzner.de" },
  { label: "Custom", ip: "custom" },
];

const TABS = [
  { id: "general", label: "General", icon: Settings },
  { id: "network", label: "Network", icon: Network },
  { id: "branches", label: "Locations", icon: MapPin }, // 👈 Branch Tab
  { id: "paths", label: "App Paths", icon: FolderOpen },
  { id: "data", label: "Data & Backup", icon: Database },
];

const SettingsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("general");
  const settings = useSettingsStore();

  // Branch Store
  const { branches, addBranch, updateBranch, deleteBranch, fetchBranches } =
    useBranchStore();

  const [localPaths, setLocalPaths] = useState(settings.paths || {});
  const [localInterval, setLocalInterval] = useState(settings.pingInterval);

  // Fetch branches when tab opens
  useEffect(() => {
    if (isOpen && activeTab === "branches") fetchBranches();
  }, [isOpen, activeTab]);

  const handleSave = () => {
    Object.keys(localPaths).forEach((key) =>
      settings.setAppPath(key, localPaths[key]),
    );
    settings.setPingInterval(localInterval);
    toast.success("Settings Saved");
    onClose();
  };

  const handleExport = async () => {
    toast.loading("Exporting data...");
    const success = await settings.exportData();
    toast.dismiss();
    if (success) toast.success("Backup downloaded");
    else toast.error("Export failed");
  };

  const handleClearLogs = async () => {
    if (confirm("Are you sure? This will delete operation history.")) {
      if (window.electron) {
        await window.electron.exec("del operation_history.log");
        toast.success("Logs cleared");
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Settings"
      size="lg"
      className="bg-[#0f172a] border-slate-700 h-[600px] flex flex-col p-0 overflow-hidden shadow-2xl rounded-2xl"
    >
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-48 bg-[#0b1120] border-r border-slate-800 p-3 flex flex-col gap-1 shrink-0">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2 mt-1">
            Configuration
          </div>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group",
                activeTab === tab.id
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-sm"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200",
              )}
            >
              <tab.icon
                className={cn(
                  "w-4 h-4",
                  activeTab === tab.id
                    ? "text-blue-400"
                    : "text-slate-500 group-hover:text-slate-300",
                )}
              />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
          {/* GENERAL TAB */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-blue-400" /> Appearance
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {THEMES.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => settings.setTheme(t.id)}
                      className={cn(
                        "cursor-pointer border rounded-xl p-3 flex items-center gap-3 transition-all hover:-translate-y-0.5",
                        settings.theme === t.id
                          ? "bg-blue-600/10 border-blue-500 ring-1 ring-blue-500"
                          : "bg-slate-800/30 border-slate-700 hover:bg-slate-800",
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shadow-inner shrink-0",
                          t.color,
                        )}
                      >
                        <t.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div
                          className={cn(
                            "text-xs font-bold truncate",
                            settings.theme === t.id
                              ? "text-blue-400"
                              : "text-slate-300",
                          )}
                        >
                          {t.label}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          Select to apply
                        </div>
                      </div>
                      {settings.theme === t.id && (
                        <CheckCircle className="w-4 h-4 text-blue-500 ml-auto shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-4 border-b border-slate-700 pb-2">
                  Behavior
                </h3>
                <div className="flex items-center gap-2 bg-slate-800/30 p-3 rounded border border-slate-700">
                  <input
                    type="checkbox"
                    className="accent-blue-500 w-4 h-4"
                    checked={settings.minimizeToTray}
                    onChange={() =>
                      settings.setMinimizeToTray(!settings.minimizeToTray)
                    }
                  />
                  <div>
                    <div className="text-xs text-slate-200 font-medium">
                      Minimize to System Tray
                    </div>
                    <div className="text-[10px] text-slate-500">
                      App keeps running in background when closed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NETWORK TAB */}
          {activeTab === "network" && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-white border-b border-slate-700 pb-2">
                Monitoring Configuration
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="System Ping Interval (ms)"
                  value={localInterval}
                  onChange={(e) => setLocalInterval(e.target.value)}
                  className="bg-[#0b1120] border-slate-600 text-slate-200"
                />
                <Input
                  label="Router Check Interval (ms)"
                  value={settings.routerPingInterval}
                  onChange={(e) =>
                    settings.setRouterPingInterval(e.target.value)
                  }
                  className="bg-[#0b1120] border-slate-600 text-slate-200"
                />
              </div>

              {/* IR Target */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold ml-1">
                  Internet Check (IR)
                </label>
                <select
                  className="w-full h-9 bg-[#0b1120] border border-slate-700 rounded-lg text-xs text-white px-2 focus:border-blue-500 focus:outline-none"
                  value={
                    IR_SERVERS.find((s) => s.ip === settings.irTarget)
                      ? settings.irTarget
                      : "custom"
                  }
                  onChange={(e) => {
                    if (e.target.value === "custom") settings.setIrTarget("");
                    else settings.setIrTarget(e.target.value);
                  }}
                >
                  {IR_SERVERS.map((s) => (
                    <option key={s.ip} value={s.ip}>
                      {s.label} ({s.ip})
                    </option>
                  ))}
                </select>
                {(!IR_SERVERS.find((s) => s.ip === settings.irTarget) ||
                  settings.irTarget === "") && (
                  <Input
                    placeholder="Enter Custom IP..."
                    value={settings.irTarget}
                    onChange={(e) => settings.setIrTarget(e.target.value)}
                  />
                )}
              </div>

              {/* Global Target */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold ml-1">
                  Internet Check (Global)
                </label>
                <select
                  className="w-full h-9 bg-[#0b1120] border border-slate-700 rounded-lg text-xs text-white px-2 focus:border-blue-500 focus:outline-none"
                  value={
                    GLOBAL_SERVERS.find((s) => s.ip === settings.globalTarget)
                      ? settings.globalTarget
                      : "custom"
                  }
                  onChange={(e) => {
                    if (e.target.value === "custom")
                      settings.setGlobalTarget("");
                    else settings.setGlobalTarget(e.target.value);
                  }}
                >
                  {GLOBAL_SERVERS.map((s) => (
                    <option key={s.ip} value={s.ip}>
                      {s.label} ({s.ip})
                    </option>
                  ))}
                </select>
                {(!GLOBAL_SERVERS.find((s) => s.ip === settings.globalTarget) ||
                  settings.globalTarget === "") && (
                  <Input
                    placeholder="Enter Custom IP..."
                    value={settings.globalTarget}
                    onChange={(e) => settings.setGlobalTarget(e.target.value)}
                  />
                )}
              </div>

              <div className="flex items-center gap-3 mt-4 bg-slate-800/30 p-3 rounded border border-slate-700">
                <input
                  type="checkbox"
                  className="accent-emerald-500 w-4 h-4"
                  checked={settings.autoStartMonitoring}
                  onChange={settings.toggleAutoStart}
                />
                <div>
                  <div className="text-xs text-slate-200 font-medium">
                    Auto-start Monitoring
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Start pinging automatically when app launches
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BRANCHES TAB */}
          {activeTab === "branches" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-4">
                <h3 className="text-sm font-bold text-white">
                  Branch Management
                </h3>
                <Button
                  size="sm"
                  onClick={() => addBranch()}
                  className="h-7 text-[10px] px-3 bg-emerald-600 hover:bg-emerald-500"
                >
                  + Add Branch
                </Button>
              </div>

              <div className="space-y-3">
                {branches.map((b) => (
                  <div
                    key={b.id}
                    className="grid grid-cols-12 gap-2 items-center bg-slate-800/30 p-2 rounded border border-slate-700 group"
                  >
                    <div className="col-span-5">
                      <Input
                        label="Name"
                        value={b.name}
                        onChange={(e) =>
                          updateBranch(b.id, "name", e.target.value)
                        }
                        className="h-8 text-xs bg-[#0b1120]"
                      />
                    </div>
                    <div className="col-span-6">
                      <Input
                        label="Router IP"
                        value={b.routerIp}
                        onChange={(e) =>
                          updateBranch(b.id, "routerIp", e.target.value)
                        }
                        className="h-8 text-xs bg-[#0b1120] font-mono"
                        placeholder="192.168.x.1"
                      />
                    </div>
                    <div className="col-span-1 flex justify-center pt-4">
                      <button
                        onClick={() => deleteBranch(b.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors opacity-60 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {branches.length === 0 && (
                  <div className="text-center text-xs text-slate-500 py-8">
                    No branches defined.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PATHS TAB */}
          {activeTab === "paths" && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-white border-b border-slate-700 pb-2">
                External Tool Paths
              </h3>
              <div className="space-y-4">
                <Input
                  label="Winbox Executable"
                  value={localPaths.winbox || ""}
                  onChange={(e) =>
                    setLocalPaths({ ...localPaths, winbox: e.target.value })
                  }
                  className="bg-[#0b1120] border-slate-600 text-slate-200 font-mono text-[11px]"
                  placeholder="C:\Tools\winbox.exe"
                />
                <Input
                  label="Putty / Termius"
                  value={localPaths.putty || ""}
                  onChange={(e) =>
                    setLocalPaths({ ...localPaths, putty: e.target.value })
                  }
                  className="bg-[#0b1120] border-slate-600 text-slate-200 font-mono text-[11px]"
                  placeholder="C:\Program Files\PuTTY\putty.exe"
                />
                <Input
                  label="TeamViewer"
                  value={localPaths.teamviewer || ""}
                  onChange={(e) =>
                    setLocalPaths({ ...localPaths, teamviewer: e.target.value })
                  }
                  className="bg-[#0b1120] border-slate-600 text-slate-200 font-mono text-[11px]"
                  placeholder="C:\Program Files\TeamViewer\TeamViewer.exe"
                />
              </div>
              <div className="text-[10px] text-amber-400/80 bg-amber-500/10 p-2 rounded border border-amber-500/20 flex gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                Ensure paths are correct. Incorrect paths will cause context
                menu actions to fail.
              </div>
            </div>
          )}

          {/* DATA TAB */}
          {activeTab === "data" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white border-b border-slate-700 pb-2 mb-4">
                  Backup & Restore
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={handleExport}
                    variant="outline"
                    className="h-24 flex flex-col gap-2 border-slate-600 hover:bg-slate-800 hover:text-white hover:border-slate-500 bg-slate-800/30"
                  >
                    <div className="p-2 bg-blue-500/10 rounded-full">
                      <Download className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold">Export JSON</div>
                      <div className="text-[9px] text-slate-500 mt-1">
                        Backup systems & settings
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col gap-2 border-slate-600 hover:bg-slate-800 hover:text-white hover:border-slate-500 bg-slate-800/30 opacity-50 cursor-not-allowed"
                  >
                    <div className="p-2 bg-slate-500/10 rounded-full">
                      <Upload className="w-6 h-6 text-slate-500" />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold">Import Backup</div>
                      <div className="text-[9px] text-slate-500 mt-1">
                        Coming Soon
                      </div>
                    </div>
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white border-b border-slate-700 pb-2 mb-4">
                  Maintenance
                </h3>
                <div className="flex items-center justify-between bg-slate-800/30 p-4 rounded-xl border border-slate-700">
                  <div>
                    <div className="text-xs font-bold text-slate-200">
                      Operation Logs
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Clear history to free up space
                    </div>
                  </div>
                  <Button
                    onClick={handleClearLogs}
                    size="sm"
                    className="bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-2" /> Clear Logs
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 bg-[#1e293b] flex justify-end gap-3 shrink-0">
        <Button
          variant="ghost"
          onClick={onClose}
          className="text-slate-400 hover:text-white text-xs"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 shadow-lg shadow-blue-500/20 text-xs h-9"
        >
          <Save className="w-4 h-4 mr-2" /> Save Changes
        </Button>
      </div>
    </Modal>
  );
};

export default SettingsModal;
