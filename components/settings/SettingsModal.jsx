"use client";

import { Button, Input, Modal } from "@/components/ui";
import { cn } from "@/lib/utils";
import useSettingsStore from "@/store/settingsStore";
import {
  AlertTriangle,
  CheckCircle,
  Database,
  Download,
  FolderOpen,
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
import { useState } from "react";
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

const TABS = [
  { id: "general", label: "General", icon: Settings },
  { id: "network", label: "Network", icon: Network },
  { id: "paths", label: "App Paths", icon: FolderOpen },
  { id: "data", label: "Data & Backup", icon: Database },
];

const SettingsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("general");
  const settings = useSettingsStore();

  const [localPaths, setLocalPaths] = useState(settings.paths || {});
  const [localInterval, setLocalInterval] = useState(settings.pingInterval);

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
      className="bg-[#0f172a] border-slate-700 h-[550px] flex flex-col p-0 overflow-hidden shadow-2xl rounded-2xl"
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
                  label="Ping Interval (ms)"
                  placeholder="5000"
                  value={localInterval}
                  onChange={(e) => setLocalInterval(e.target.value)}
                  className="bg-[#0b1120] border-slate-600 text-slate-200"
                />
                <Input
                  label="Timeout (ms)"
                  placeholder="2000"
                  className="bg-[#0b1120] border-slate-600 text-slate-200 opacity-50"
                  disabled
                  value="2000"
                />
              </div>
              <div className="flex items-center gap-3 mt-2 bg-slate-800/30 p-3 rounded border border-slate-700">
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
