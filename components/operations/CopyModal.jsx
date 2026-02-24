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
  FilePlus,
  FolderOpen,
  FolderPlus,
  Monitor,
  Play,
  Server,
  Square,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast"; // 👈 اضافه کنید

const CopyModal = ({ isOpen, onClose }) => {
  const {
    logs,
    isRunning,
    startOperation,
    stopOperation,
    reportData,
    clearLogs,
  } = useFileOperations();
  const { destinations, fetchDestinations } = useDestinationStore();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [targetIds, setTargetIds] = useState([]);

  // Browser States
  const [showFileBrowser, setShowFileBrowser] = useState(false);
  const [browserMode, setBrowserMode] = useState("file"); // 'file' or 'folder'
  const [showDestBrowser, setShowDestBrowser] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  //---------------------------------------

  //---------------------------------------

  useEffect(() => {
    if (isOpen) {
      setSelectedFiles([]);
      setTargetIds([]);
      clearLogs();

      // 👇 این خط حیاتی است: هر بار مودال باز شد، لیست مقصدها را رفرش کن
      fetchDestinations();
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

  const handleFilesSelected = (files) => {
    // 1. دسترسی به مقدار فعلی استیت بدون انتظار برای تابع callback
    // (چون ما داخل یک ایونت هندلر هستیم، selectedFiles مقدارش معتبر است)

    const newFiles = files.filter(
      (newFile) =>
        !selectedFiles.some((existing) => existing.path === newFile.path),
    );

    // 2. نمایش پیام اگر تکراری وجود داشت
    if (newFiles.length < files.length) {
      toast.error("Duplicate files skipped");
    }

    // 3. آپدیت استیت فقط با فایل‌های جدید
    if (newFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDestSelected = (ids) => {
    setTargetIds((prev) => {
      // استفاده از Set برای حذف تکراری‌ها به طور خودکار
      return [...new Set([...prev, ...ids])];
    });
  };
  const removeFile = (path) =>
    setSelectedFiles((prev) => prev.filter((f) => f.path !== path));
  const removeDest = (id) =>
    setTargetIds((prev) => prev.filter((i) => i !== id));

  // Clear Handlers
  const clearFiles = () => setSelectedFiles([]);
  const clearTargets = () => setTargetIds([]);

  // Open Browser Helper
  const openBrowser = (mode) => {
    setBrowserMode(mode);
    setShowFileBrowser(true);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="File Transfer Operation"
        size="full"
        className="w-[90vw] max-w-[1400px] h-[85vh] p-0 overflow-hidden flex flex-col bg-[#0f172a] border border-slate-700 shadow-2xl rounded-2xl"
      >
        <div className="flex-1 grid grid-cols-12 gap-4 p-4 h-full min-h-0 bg-gradient-to-b from-[#0f172a] to-[#1e293b] overflow-hidden">
          {/* --- LEFT COLUMN --- */}
          <div className="col-span-4 grid grid-rows-2 gap-4 h-full min-h-0">
            {/* 1. SOURCE SECTION */}
            <div className="h-full flex flex-col bg-[#1e293b]/50 border border-slate-700/50 rounded-xl overflow-hidden shadow-sm backdrop-blur-sm transition-all hover:border-slate-600 min-h-0">
              {/* Header */}
              <div className="px-3 py-2 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30 shrink-0 h-12">
                <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs">
                  <div className="p-1.5 bg-blue-500/10 rounded-md">
                    <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  Source
                  <span className="text-[10px] font-normal text-slate-500 ml-1">
                    ({selectedFiles.length})
                  </span>
                </div>

                {/* Action Buttons */}
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

              {/* List */}
              <div className="flex-1 overflow-y-auto p-1.5 space-y-1 custom-scrollbar h-full">
                {selectedFiles.map((file, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-1.5 rounded-lg bg-slate-800/40 border border-transparent hover:border-slate-600 hover:bg-slate-800 transition-all group"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {file.type === "folder" ? (
                        <FolderOpen
                          className="w-5 h-5 text-amber-400 shrink-0"
                          strokeWidth={1.5}
                        />
                      ) : (
                        <File
                          className="w-5 h-5 text-blue-400 shrink-0"
                          strokeWidth={1.5}
                        />
                      )}
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
                    <FolderOpen className="w-8 h-8" strokeWidth={1} />
                    <span className="text-[10px]">No source selected</span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. TARGET SECTION */}
            <div className="h-full flex flex-col bg-[#1e293b]/50 border border-slate-700/50 rounded-xl overflow-hidden shadow-sm backdrop-blur-sm transition-all hover:border-slate-600 min-h-0">
              {/* Header */}
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

              {/* List */}
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
          <div className="col-span-8 grid grid-rows-[1fr_auto] gap-4 h-full min-h-0">
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
                  {isRunning ? "STATUS: RUNNING" : "STATUS: IDLE"}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={onClose}
                  disabled={isRunning}
                  className="h-8 px-4 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg text-xs"
                >
                  Cancel
                </Button>
                {isRunning ? (
                  <Button
                    onClick={stopOperation}
                    variant="danger"
                    leftIcon={<Square className="w-3.5 h-3.5 fill-current" />}
                    className="h-8 px-4 text-xs bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20"
                  >
                    Stop
                  </Button>
                ) : (
                  <Button
                    onClick={handleStart}
                    className={cn(
                      "h-8 px-6 text-white text-xs font-semibold tracking-wide rounded-lg border border-emerald-500/30",
                      "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500",
                      "shadow-[0_0_10px_rgba(16,185,129,0.3)] hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]",
                      (selectedFiles.length === 0 ||
                        selectedTargets.length === 0) &&
                        "opacity-50 grayscale cursor-not-allowed pointer-events-none shadow-none",
                    )}
                  >
                    <Play className="w-3 h-3 mr-1.5 fill-current" /> START
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* File Browser Modal with Dynamic Mode */}
      <FileBrowserModal
        isOpen={showFileBrowser}
        onClose={() => setShowFileBrowser(false)}
        onSelect={handleFilesSelected}
        mode={browserMode} // 👈 'file' or 'folder'
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
