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
  FileEdit,
  FilePlus,
  FolderOpen,
  FolderPlus,
  Monitor,
  Server,
  Square,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const RenameModal = ({ isOpen, onClose }) => {
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

  // Rename Config
  const [renameText, setRenameText] = useState("");
  const [renameMode, setRenameMode] = useState("prefix"); // 'prefix' or 'suffix'

  // Browser States
  const [showFileBrowser, setShowFileBrowser] = useState(false);
  const [browserMode, setBrowserMode] = useState("file");
  const [showDestBrowser, setShowDestBrowser] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedFiles([]);
      setTargetIds([]);
      clearLogs();
      setRenameText("");
      setRenameMode("prefix");
    }
  }, [isOpen]);

  const selectedTargets = destinations.filter((d) => targetIds.includes(d.id));

  const handleStart = async () => {
    if (selectedFiles.length > 0 && selectedTargets.length > 0) {
      const completed = await startOperation("rename", {
        files: selectedFiles,
        targets: selectedTargets,
        renameConfig: { text: renameText, mode: renameMode },
      });
      if (completed) setShowSummary(true);
    }
  };

  const handleFilesSelected = (files) => {
    setSelectedFiles((prev) => {
      const newFiles = files.filter(
        (f) => !prev.some((p) => p.path === f.path),
      );
      return [...prev, ...newFiles];
    });
  };

  const handleDestSelected = (ids) =>
    setTargetIds((prev) => [...new Set([...prev, ...ids])]);
  const removeFile = (path) =>
    setSelectedFiles((prev) => prev.filter((f) => f.path !== path));
  const removeDest = (id) =>
    setTargetIds((prev) => prev.filter((i) => i !== id));

  const clearFiles = () => setSelectedFiles([]);
  const clearTargets = () => setTargetIds([]);

  const openBrowser = (mode) => {
    setBrowserMode(mode);
    setShowFileBrowser(true);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Rename Operation"
        size="full"
        className="w-[90vw] max-w-[1400px] h-[85vh] p-0 overflow-hidden flex flex-col bg-[#0f172a] border border-slate-700 shadow-2xl rounded-2xl"
      >
        <div className="flex-1 grid grid-cols-12 gap-6 p-6 h-full min-h-0 bg-gradient-to-b from-[#0f172a] to-[#1e293b] overflow-hidden">
          {/* --- LEFT COLUMN --- */}
          <div className="col-span-4 grid grid-rows-2 gap-6 h-full min-h-0">
            {/* 1. SOURCE SECTION */}
            <div className="h-full flex flex-col bg-[#1e293b]/50 border border-slate-700/50 rounded-xl overflow-hidden shadow-sm backdrop-blur-sm transition-all hover:border-slate-600 min-h-0">
              <div className="px-3 py-2 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30 shrink-0 h-12">
                <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs">
                  <div className="p-1.5 bg-amber-500/10 rounded-md">
                    <FileEdit className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  Files to Rename
                  <span className="text-[10px] font-normal text-slate-500 ml-1">
                    ({selectedFiles.length})
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={clearFiles}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                    title="Clear All"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-px h-4 bg-slate-700 mx-1"></div>
                  <Button
                    size="sm"
                    onClick={() => openBrowser("file")}
                    className="h-7 text-[10px] bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 px-2.5 gap-1.5"
                  >
                    <FilePlus className="w-3 h-3 text-blue-400" /> File
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => openBrowser("folder")}
                    className="h-7 text-[10px] bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 px-2.5 gap-1.5"
                  >
                    <FolderPlus className="w-3 h-3 text-amber-400" /> Folder
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-1.5 space-y-1 custom-scrollbar h-full">
                {selectedFiles.map((file, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-1.5 rounded-lg bg-slate-800/40 border border-transparent hover:border-slate-600 hover:bg-slate-800 transition-all group"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <File
                        className="w-5 h-5 text-amber-400 shrink-0"
                        strokeWidth={1.5}
                      />
                      <div className="flex flex-col overflow-hidden min-w-0">
                        <span className="text-xs text-slate-200 truncate font-medium">
                          {file.name}
                        </span>
                        <span className="text-[9px] text-slate-500 truncate">
                          {file.path}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(file.path)}
                      className="p-1 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {selectedFiles.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50 gap-1">
                    <FileEdit className="w-8 h-8" strokeWidth={1} />
                    <span className="text-[10px]">No items selected</span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. TARGET SECTION */}
            <div className="h-full flex flex-col bg-[#1e293b]/50 border border-slate-700/50 rounded-xl overflow-hidden shadow-sm backdrop-blur-sm transition-all hover:border-slate-600 min-h-0">
              <div className="px-3 py-2 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30 shrink-0 h-12">
                <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs">
                  <div className="p-1.5 bg-emerald-500/10 rounded-md">
                    <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  Destinations
                  <span className="text-[10px] font-normal text-slate-500 ml-1">
                    ({selectedTargets.length})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={clearTargets}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                    title="Clear All"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-px h-4 bg-slate-700 mx-1"></div>
                  <Button
                    size="sm"
                    onClick={() => setShowDestBrowser(true)}
                    className="h-7 text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white border-0 px-3"
                  >
                    + Add Targets
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-1.5 space-y-1 custom-scrollbar h-full">
                {selectedTargets.map((dest, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-1.5 rounded-lg bg-slate-800/40 border border-transparent hover:border-slate-600 hover:bg-slate-800 transition-all group"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Server
                        className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0"
                        strokeWidth={1.5}
                      />
                      <div className="flex flex-col overflow-hidden min-w-0">
                        <span className="text-xs text-slate-200 truncate font-medium">
                          {dest.name}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono truncate">
                          {dest.ip}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeDest(dest.id)}
                      className="p-1 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {selectedTargets.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50 gap-1">
                    <Monitor className="w-8 h-8" strokeWidth={1} />
                    <span className="text-[10px]">No targets selected</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="col-span-8 grid grid-rows-[auto_1fr_auto] gap-4 h-full min-h-0">
            {/* RENAME CONFIG */}
            <div className="bg-[#1e293b]/50 border border-slate-700/50 rounded-xl p-3 flex items-center gap-4 shrink-0">
              <div className="flex-1">
                <label className="text-[10px] text-slate-400 uppercase font-bold mb-1 block">
                  Rename Text / Tag
                </label>
                <input
                  value={renameText}
                  onChange={(e) => setRenameText(e.target.value)}
                  placeholder={
                    renameMode === "prefix" ? "Prefix_..." : "..._Suffix"
                  }
                  className="w-full h-9 bg-[#0b1120] border border-slate-700 rounded-lg px-3 text-xs text-slate-200 focus:border-amber-500 focus:outline-none placeholder:text-slate-600 font-mono"
                />
              </div>

              <div className="flex gap-4 px-2 pt-4">
                <label className="flex items-center gap-2 cursor-pointer group select-none">
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                      renameMode === "prefix"
                        ? "border-amber-500 bg-amber-500/20"
                        : "border-slate-500 bg-transparent",
                    )}
                  >
                    {renameMode === "prefix" && (
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={renameMode === "prefix"}
                    onChange={() => setRenameMode("prefix")}
                  />
                  <span
                    className={cn(
                      "text-xs font-medium transition-colors",
                      renameMode === "prefix"
                        ? "text-amber-400"
                        : "text-slate-400 group-hover:text-slate-200",
                    )}
                  >
                    Add as Prefix
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group select-none">
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                      renameMode === "suffix"
                        ? "border-amber-500 bg-amber-500/20"
                        : "border-slate-500 bg-transparent",
                    )}
                  >
                    {renameMode === "suffix" && (
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={renameMode === "suffix"}
                    onChange={() => setRenameMode("suffix")}
                  />
                  <span
                    className={cn(
                      "text-xs font-medium transition-colors",
                      renameMode === "suffix"
                        ? "text-amber-400"
                        : "text-slate-400 group-hover:text-slate-200",
                    )}
                  >
                    Add as Suffix
                  </span>
                </label>
              </div>
            </div>

            {/* TERMINAL */}
            <div className="flex flex-col bg-[#0B1120] rounded-xl border border-slate-700 shadow-inner overflow-hidden relative h-full min-h-0">
              <div className="h-8 bg-[#1E293B] border-b border-slate-700 flex items-center px-3 justify-between select-none shrink-0">
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse"></span>
                  root@hyper-family:~
                </span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                </div>
              </div>
              <div className="flex-1 relative min-h-0">
                <Terminal
                  logs={logs}
                  className="absolute inset-0 w-full h-full border-0 rounded-none bg-transparent p-3 text-[11px]"
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="h-16 bg-[#1e293b] border border-slate-700 rounded-xl px-4 flex justify-between items-center shadow-lg shrink-0">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-slate-200 font-bold">
                    {selectedFiles.length}
                  </span>{" "}
                  Items
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  <span className="text-slate-200 font-bold">
                    {selectedTargets.length}
                  </span>{" "}
                  Targets
                </div>
                <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                  {isRunning ? "STATUS: RENAMING..." : "STATUS: IDLE"}
                </div>
              </div>

              <div className="flex gap-2">
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
                    Stop
                  </Button>
                ) : (
                  <Button
                    onClick={handleStart}
                    className={cn(
                      "h-10 px-8 text-white text-xs font-semibold tracking-wide rounded-lg border border-amber-500/30",
                      "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500",
                      "shadow-[0_0_10px_rgba(245,158,11,0.3)] hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]",
                      (selectedFiles.length === 0 ||
                        selectedTargets.length === 0 ||
                        !renameText) &&
                        "opacity-50 grayscale cursor-not-allowed pointer-events-none shadow-none",
                    )}
                  >
                    <FileEdit className="w-3.5 h-3.5 mr-2" /> RENAME
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
        mode={browserMode}
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

export default RenameModal;
