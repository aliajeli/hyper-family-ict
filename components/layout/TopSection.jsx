"use client";

import TargetSelectorModal from "@/components/operations/TargetSelectorModal";
import { Button } from "@/components/ui";
import { useSystemOperations } from "@/hooks/useSystemOperations";
import { cn } from "@/lib/utils";
import { useMonitoringStore, useOperationStore } from "@/store";
import {
  Activity,
  Copy,
  FileEdit,
  FolderInput,
  Info,
  Lock,
  Package,
  Play,
  Plus,
  RefreshCw,
  Send,
  Settings,
  Shield,
  ShieldCheck,
  Square,
  Target,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const TopSection = ({
  onAddSystem,
  onAddDestination,
  onCopy,
  onDelete,
  onRename,
  onReplace,
  onEquipments,
  onAbout,
  onSettings,
}) => {
  // Store State
  const {
    destinationPath,
    setDestinationPath,
    services,
    setServices,
    message,
    setMessage,
    stopBefore,
    setStopBefore,
    startAfter,
    setStartAfter,
    sendAfter,
    setSendAfter,
    authMode,
    setAuthMode,
    username,
    setUsername,
    password,
    setPassword,
  } = useOperationStore();

  const { isMonitoring, startMonitoring, stopMonitoring } =
    useMonitoringStore();
  const { manageService, sendMessage } = useSystemOperations();

  // Local State for Modal
  const [showSelector, setShowSelector] = useState(false);
  const [actionType, setActionType] = useState(null); // 'start', 'stop', 'message'

  // --- Handlers ---
  const handleToggleMonitoring = () => {
    if (isMonitoring) {
      stopMonitoring();
      toast("Monitoring Stopped", { icon: "🛑" });
    } else {
      startMonitoring([]);
      toast.success("Monitoring Started");
    }
  };

  // Button Click Handlers
  const handleStartClick = () => {
    if (!services) return toast.error("Enter service name first");
    setActionType("start");
    setShowSelector(true);
  };

  const handleStopClick = () => {
    if (!services) return toast.error("Enter service name first");
    setActionType("stop");
    setShowSelector(true);
  };

  const handleMessageClick = () => {
    if (!message) return toast.error("Enter message text first");
    setActionType("message");
    setShowSelector(true);
  };

  // Execution Logic (Callback from Modal)
  const handleExecute = async (targets) => {
    const serviceList = services
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);

    for (const target of targets) {
      try {
        if (actionType === "start") {
          for (const srv of serviceList) {
            toast.loading(`Starting ${srv} on ${target.ip}...`, { id: "exec" });
            await manageService(target.ip, srv, "start");
          }
        } else if (actionType === "stop") {
          for (const srv of serviceList) {
            toast.loading(`Stopping ${srv} on ${target.ip}...`, { id: "exec" });
            await manageService(target.ip, srv, "stop");
          }
        } else if (actionType === "message") {
          toast.loading(`Sending to ${target.ip}...`, { id: "exec" });
          await sendMessage(target.ip, message);
        }
      } catch (e) {
        console.error(e);
      }
    }
    toast.dismiss("exec");
    toast.success("Operation Cycle Completed");
  };

  return (
    <>
      <div className="flex flex-col gap-2 p-3 bg-[#0f172a] border-b border-slate-700 shadow-xl z-10 select-none">
        {/* ================= ROW 1: AUTHENTICATION ================= */}
        <div className="flex items-center gap-4 bg-[#1e293b]/50 p-2 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-4 px-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div
                className={cn(
                  "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                  authMode === "this"
                    ? "border-emerald-500 bg-emerald-500/20"
                    : "border-slate-500 bg-transparent",
                )}
              >
                {authMode === "this" && (
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={authMode === "this"}
                onChange={() => setAuthMode("this")}
              />
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
                  authMode === "this"
                    ? "text-emerald-400"
                    : "text-slate-400 group-hover:text-slate-200",
                )}
              >
                This Credential
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <div
                className={cn(
                  "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                  authMode === "current"
                    ? "border-blue-500 bg-blue-500/20"
                    : "border-slate-500 bg-transparent",
                )}
              >
                {authMode === "current" && (
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                )}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={authMode === "current"}
                onChange={() => setAuthMode("current")}
              />
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
                  authMode === "current"
                    ? "text-blue-400"
                    : "text-slate-400 group-hover:text-slate-200",
                )}
              >
                Login Credential
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <div
                className={cn(
                  "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                  authMode === "anonymous"
                    ? "border-amber-500 bg-amber-500/20"
                    : "border-slate-500 bg-transparent",
                )}
              >
                {authMode === "anonymous" && (
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                )}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={authMode === "anonymous"}
                onChange={() => setAuthMode("anonymous")}
              />
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
                  authMode === "anonymous"
                    ? "text-amber-400"
                    : "text-slate-400 group-hover:text-slate-200",
                )}
              >
                Anonymous
              </span>
            </label>
          </div>

          <div className="flex-1 flex gap-3 border-l border-slate-700 pl-4">
            <div className="relative flex-1 group">
              <User
                className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors",
                  authMode === "this"
                    ? "text-slate-400 group-focus-within:text-emerald-400"
                    : "text-slate-600",
                )}
              />
              <input
                disabled={authMode !== "this"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className={cn(
                  "w-full h-8 pl-9 pr-3 text-xs rounded-lg bg-[#0f172a] border transition-all focus:outline-none",
                  authMode === "this"
                    ? "border-slate-600 text-slate-200 focus:border-emerald-500"
                    : "border-slate-800 text-slate-600 cursor-not-allowed",
                )}
              />
            </div>
            <div className="relative flex-1 group">
              <Lock
                className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors",
                  authMode === "this"
                    ? "text-slate-400 group-focus-within:text-emerald-400"
                    : "text-slate-600",
                )}
              />
              <input
                type="password"
                disabled={authMode !== "this"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={cn(
                  "w-full h-8 pl-9 pr-3 text-xs rounded-lg bg-[#0f172a] border transition-all focus:outline-none",
                  authMode === "this"
                    ? "border-slate-600 text-slate-200 focus:border-emerald-500"
                    : "border-slate-800 text-slate-600 cursor-not-allowed",
                )}
              />
            </div>
          </div>
        </div>

        {/* ================= ROW 2: PATH & SYSTEM ================= */}
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <Button
              onClick={onAddSystem}
              className="h-9 bg-indigo-600 hover:bg-indigo-500 text-white text-xs border border-indigo-400/20 shadow-lg shadow-indigo-500/10 px-4"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Add System
            </Button>
            <Button
              onClick={onAddDestination}
              className="h-9 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs border border-slate-600 px-4"
            >
              <Target className="w-3.5 h-3.5 mr-1.5" /> Add Dest
            </Button>
          </div>

          <div className="flex-1 relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-700/50 p-1 rounded">
              <FolderInput className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <input
              value={destinationPath}
              onChange={(e) => setDestinationPath(e.target.value)}
              placeholder="Remote Destination Path (e.g., C:\HyperFamily\Updates)"
              className="w-full h-9 pl-11 pr-4 text-xs rounded-lg bg-[#1e293b] border border-slate-600 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono shadow-inner"
            />
          </div>

          <Button
            onClick={onSettings}
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* ================= ROW 3: OPERATIONS BAR ================= */}
        <div className="grid grid-cols-12 gap-3">
          {/* Services Control */}
          <div className="col-span-7 flex items-center gap-2 bg-[#1e293b]/30 p-1.5 rounded-lg border border-slate-700/50">
            <div className="relative flex-1">
              <input
                value={services}
                onChange={(e) => setServices(e.target.value)}
                placeholder="Service Name (e.g., Spooler)"
                className="w-full h-8 px-3 text-xs rounded bg-[#0f172a] border border-slate-700 text-slate-300 focus:border-amber-500 focus:outline-none placeholder:text-slate-600"
              />
            </div>
            <div className="flex items-center gap-3 px-2">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={stopBefore}
                  onChange={(e) => setStopBefore(e.target.checked)}
                  className="accent-amber-500 w-3 h-3"
                />
                <span className="text-[10px] text-slate-400">Stop First</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={startAfter}
                  onChange={(e) => setStartAfter(e.target.checked)}
                  className="accent-emerald-500 w-3 h-3"
                />
                <span className="text-[10px] text-slate-400">Start After</span>
              </label>
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                onClick={handleStartClick}
                className="h-7 text-[10px] px-3 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-600/30"
              >
                Start
              </Button>
              <Button
                size="sm"
                onClick={handleStopClick}
                className="h-7 text-[10px] px-3 bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white border border-rose-600/30"
              >
                Stop
              </Button>
            </div>
          </div>

          {/* Message Control */}
          <div className="col-span-5 flex items-center gap-2 bg-[#1e293b]/30 p-1.5 rounded-lg border border-slate-700/50">
            <div className="relative flex-1">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message to User..."
                className="w-full h-8 px-3 text-xs rounded bg-[#0f172a] border border-slate-700 text-slate-300 focus:border-blue-500 focus:outline-none placeholder:text-slate-600"
              />
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap px-1">
              <input
                type="checkbox"
                checked={sendAfter}
                onChange={(e) => setSendAfter(e.target.checked)}
                className="accent-blue-500 w-3 h-3"
              />
              <span className="text-[10px] text-slate-400">Send After</span>
            </label>
            <Button
              size="sm"
              onClick={handleMessageClick}
              className="h-7 w-8 p-0 bg-blue-600 text-white rounded hover:bg-blue-500 flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* ================= ROW 4: MAIN ACTIONS ================= */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 mt-1">
          <div className="flex gap-2">
            <Button
              onClick={onCopy}
              className="h-10 px-5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs shadow-md hover:border-slate-500 transition-all group"
            >
              <Copy className="w-4 h-4 mr-2 text-blue-400 group-hover:text-blue-300" />{" "}
              Copy
            </Button>
            <Button
              onClick={onDelete}
              className="h-10 px-5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs shadow-md hover:border-slate-500 transition-all group"
            >
              <Trash2 className="w-4 h-4 mr-2 text-red-400 group-hover:text-red-300" />{" "}
              Delete
            </Button>
            <Button
              onClick={onRename}
              className="h-10 px-5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs shadow-md hover:border-slate-500 transition-all group"
            >
              <FileEdit className="w-4 h-4 mr-2 text-amber-400 group-hover:text-amber-300" />{" "}
              Rename
            </Button>
            <Button
              onClick={onReplace}
              className="h-10 px-5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs shadow-md hover:border-slate-500 transition-all group"
            >
              <RefreshCw className="w-4 h-4 mr-2 text-emerald-400 group-hover:text-emerald-300" />{" "}
              Replace
            </Button>
          </div>

          <div className="flex gap-2 border-l border-slate-700 pl-4">
            <Button
              onClick={onEquipments}
              className="h-10 px-4 bg-slate-800/50 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 hover:border-slate-600 transition-all"
            >
              <Package className="w-4 h-4 mr-2" /> Equipments
            </Button>
            <Button
              onClick={handleToggleMonitoring}
              className={cn(
                "h-10 px-4 text-xs font-semibold border transition-all shadow-lg",
                isMonitoring
                  ? "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500 hover:text-white"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500 hover:text-white",
              )}
            >
              <Activity
                className={cn("w-4 h-4 mr-2", isMonitoring && "animate-pulse")}
              />
              {isMonitoring ? "Stop Monitor" : "Start Monitor"}
            </Button>
            <Button
              onClick={onAbout}
              variant="ghost"
              className="h-10 px-3 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg"
            >
              <Info className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Target Selector Modal for Service/Message Operations */}
      <TargetSelectorModal
        isOpen={showSelector}
        onClose={() => setShowSelector(false)}
        onConfirm={handleExecute}
        actionType={actionType}
        title={
          actionType === "message"
            ? `Send Message`
            : actionType === "start"
              ? `Start Service`
              : `Stop Service`
        }
      />
    </>
  );
};

export default TopSection;
