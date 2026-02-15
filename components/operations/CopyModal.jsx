"use client";

import DestinationBrowserModal from "@/components/destinations/DestinationBrowserModal";
import FileBrowserModal from "@/components/file-browser/FileBrowserModal";
import SummaryModal from "@/components/operations/SummaryModal";
import { Button, Modal } from "@/components/ui";
import Terminal from "@/components/ui/Terminal";
import { useFileOperations } from "@/hooks/useFileOperations";
import { cn } from "@/lib/utils";
import { useDestinationStore } from "@/store";
import {
  ArrowRight,
  File,
  FolderOpen,
  Monitor,
  Play,
  Server,
  Square,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const CopyModal = ({ isOpen, onClose }) => {
  const {
    logs,
    isRunning,
    startOperation,
    stopOperation,
    reportData,
    clearLogs,
  } = useFileOperations();
  const { destinations } = useDestinationStore();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [targetIds, setTargetIds] = useState([]);
  const [showFileBrowser, setShowFileBrowser] = useState(false);
  const [showDestBrowser, setShowDestBrowser] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedFiles([]);
      setTargetIds([]);
      clearLogs();
    }
  }, [isOpen]);

  const selectedTargets = destinations.filter((d) => targetIds.includes(d.id));

  const handleStart = async () => {
    if (selectedFiles.length > 0 && selectedTargets.length > 0) {
      const completed = await startOperation("copy", {
        files: selectedFiles,
        targets: selectedTargets,
      });
      if (completed) setShowSummary(true);
    }
  };

  const handleFilesSelected = (files) =>
    setSelectedFiles((prev) => [...prev, ...files]);
  const handleDestSelected = (ids) =>
    setTargetIds((prev) => [...new Set([...prev, ...ids])]);
  const removeFile = (path) =>
    setSelectedFiles((prev) => prev.filter((f) => f.path !== path));
  const removeDest = (id) =>
    setTargetIds((prev) => prev.filter((i) => i !== id));

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="File Transfer Operation"
        size="full"
        // کانتینر اصلی مودال با حاشیه و سایه مدرن
        className="w-[90vw] max-w-[1400px] h-[85vh] p-0 overflow-hidden flex flex-col bg-[#0f172a] border border-slate-700 shadow-2xl rounded-2xl"
      >
        {/* بدنه اصلی با پدینگ مناسب */}
        <div className="flex-1 grid grid-cols-12 gap-6 p-6 min-h-0 bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
          {/* --- LEFT COLUMN: CONFIGURATION --- */}
          <div className="col-span-4 flex flex-col gap-6 h-full min-h-0">
            {/* 1. SOURCE SECTION */}
            <div className="flex-1 flex flex-col bg-[#1e293b]/50 border border-slate-700/50 rounded-xl overflow-hidden shadow-sm backdrop-blur-sm transition-all hover:border-slate-600">
              {/* Header */}
              <div className="px-4 py-3 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
                <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
                  <div className="p-1.5 bg-blue-500/10 rounded-md">
                    <FolderOpen className="w-4 h-4 text-blue-400" />
                  </div>
                  Source Files
                  <span className="text-xs font-normal text-slate-500 ml-1">
                    ({selectedFiles.length})
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowFileBrowser(true)}
                  className="h-7 text-xs bg-blue-600 hover:bg-blue-500 text-white border-0"
                >
                  + Add Files
                </Button>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {selectedFiles.map((file, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-2.5 rounded-lg bg-slate-800/40 border border-transparent hover:border-slate-600 hover:bg-slate-800 transition-all group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <File
                        className="w-8 h-8 text-slate-500 group-hover:text-blue-400 transition-colors"
                        strokeWidth={1.5}
                      />
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm text-slate-200 truncate font-medium">
                          {file.name}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate">
                          {file.path}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(file.path)}
                      className="p-1.5 rounded-md hover:bg-red-500/10 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {selectedFiles.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50 gap-2">
                    <FolderOpen className="w-10 h-10" strokeWidth={1} />
                    <span className="text-xs">No files selected</span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. TARGET SECTION */}
            <div className="flex-1 flex flex-col bg-[#1e293b]/50 border border-slate-700/50 rounded-xl overflow-hidden shadow-sm backdrop-blur-sm transition-all hover:border-slate-600">
              <div className="px-4 py-3 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
                <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
                  <div className="p-1.5 bg-emerald-500/10 rounded-md">
                    <Monitor className="w-4 h-4 text-emerald-400" />
                  </div>
                  Destinations
                  <span className="text-xs font-normal text-slate-500 ml-1">
                    ({selectedTargets.length})
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowDestBrowser(true)}
                  className="h-7 text-xs bg-emerald-600 hover:bg-emerald-500 text-white border-0"
                >
                  + Add Targets
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {selectedTargets.map((dest, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-2.5 rounded-lg bg-slate-800/40 border border-transparent hover:border-slate-600 hover:bg-slate-800 transition-all group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <Server
                        className="w-8 h-8 text-slate-500 group-hover:text-emerald-400 transition-colors"
                        strokeWidth={1.5}
                      />
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm text-slate-200 truncate font-medium">
                          {dest.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {dest.ip}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeDest(dest.id)}
                      className="p-1.5 rounded-md hover:bg-red-500/10 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {selectedTargets.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50 gap-2">
                    <Monitor className="w-10 h-10" strokeWidth={1} />
                    <span className="text-xs">No targets selected</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: EXECUTION --- */}
          <div className="col-span-8 flex flex-col h-full gap-4 min-h-0">
            {/* TERMINAL WINDOW */}
            <div className="flex-1 flex flex-col bg-[#0B1120] rounded-xl border border-slate-700 shadow-inner overflow-hidden relative">
              {/* Terminal Header */}
              <div className="h-9 bg-[#1E293B] border-b border-slate-700 flex items-center px-4 justify-between select-none">
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"></span>
                  admin@hyper-family:~/operations
                </span>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                </div>
              </div>

              {/* Terminal Body */}
              <div className="flex-1 relative">
                <Terminal
                  logs={logs}
                  className="absolute inset-0 w-full h-full border-0 rounded-none bg-transparent p-4"
                />
              </div>
            </div>

            {/* CONTROL PANEL (FOOTER) */}
            <div className="h-20 bg-[#1e293b] border border-slate-700 rounded-xl p-4 flex justify-between items-center shadow-lg">
              {/* Status Indicator */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-slate-200 font-bold">
                    {selectedFiles.length}
                  </span>{" "}
                  Files
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  <span className="text-slate-200 font-bold">
                    {selectedTargets.length}
                  </span>{" "}
                  Targets
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {isRunning ? "Status: RUNNING..." : "Status: IDLE"}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={onClose}
                  disabled={isRunning}
                  className="h-10 px-6 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg text-xs"
                >
                  Cancel
                </Button>

                {isRunning ? (
                  <Button
                    onClick={stopOperation}
                    variant="danger"
                    leftIcon={<Square className="w-4 h-4 fill-current" />}
                    className="h-10 px-6 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all duration-300"
                  >
                    Stop Operation
                  </Button>
                ) : (
                  <Button
                    onClick={handleStart}
                    // Custom Gradient Button
                    className={cn(
                      "h-10 px-8 text-white text-xs font-semibold tracking-wide rounded-lg border border-emerald-500/30",
                      "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500",
                      "shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]",
                      "transform hover:-translate-y-0.5 transition-all duration-300",
                      (selectedFiles.length === 0 ||
                        selectedTargets.length === 0) &&
                        "opacity-50 grayscale cursor-not-allowed pointer-events-none shadow-none translate-y-0",
                    )}
                  >
                    <Play className="w-3.5 h-3.5 mr-2 fill-current" />
                    START COPY
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <FileBrowserModal
        isOpen={showFileBrowser}
        onClose={() => setShowFileBrowser(false)}
        onSelect={handleFilesSelected}
        mode="mixed"
      />
      <DestinationBrowserModal
        isOpen={showDestBrowser}
        onClose={() => setShowDestBrowser(false)}
        onSelect={handleDestSelected}
      />
      <SummaryModal
        isOpen={showSummary}
        onClose={() => setShowSummary(false)}
        results={reportData}
      />
    </>
  );
};

export default CopyModal;
