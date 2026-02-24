"use client";

import { Button, Modal } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  ArrowUp,
  CheckCircle,
  Circle,
  Download,
  File,
  FileText,
  Folder,
  HardDrive,
  Home,
  Image as ImageIcon,
  Loader2,
  Monitor,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";

// --- Icon Helper ---
const FileIcon = ({ type, className }) => {
  if (type === "drive")
    return <HardDrive className={cn("text-slate-400", className)} />;
  if (type === "folder")
    return (
      <Folder className={cn("text-amber-400 fill-amber-400/20", className)} />
    );
  return <File className={cn("text-blue-400 fill-blue-400/10", className)} />;
};

const QuickIcon = ({ icon, className }) => {
  const map = {
    desktop: Monitor,
    "file-text": FileText,
    download: Download,
    image: ImageIcon,
  };
  const Icon = map[icon] || Folder;
  return <Icon className={className} />;
};

const FileBrowserModal = ({ isOpen, onClose, onSelect, mode = "file" }) => {
  const [currentPath, setCurrentPath] = useState("root");
  const [items, setItems] = useState([]);
  const [drives, setDrives] = useState([]);
  const [quickAccess, setQuickAccess] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Initial Load (Drives & Quick Access)
  useEffect(() => {
    if (isOpen && window.electron) {
      const init = async () => {
        try {
          const drvs = await window.electron.readDir("root");
          setDrives(drvs);
          const quick = await window.electron.getQuickAccess();
          setQuickAccess(quick);
        } catch (e) {
          console.error("Init error:", e);
        }
      };
      init();
    }
  }, [isOpen]);

  // Content Load
  useEffect(() => {
    if (!isOpen) return;
    loadContent();
  }, [currentPath, isOpen]);

  const loadContent = async () => {
    setLoading(true);
    try {
      if (window.electron) {
        // If root, show drives again in main view
        if (currentPath === "root") {
          const drvs = await window.electron.readDir("root");
          setItems(drvs);
        } else {
          const files = await window.electron.readDir(currentPath);
          setItems(files);
        }
      } else {
        // Mock Data
        setItems([
          { name: "Windows", type: "folder", path: "C:/Windows" },
          { name: "Users", type: "folder", path: "C:/Users" },
          { name: "test.txt", type: "file", path: "C:/test.txt" },
        ]);
      }
    } catch (error) {
      console.error(error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (item) => {
    // Only navigate into drives or folders
    if (item.type === "drive" || item.type === "folder") {
      setCurrentPath(item.path);
      setSearchQuery("");
    }
  };

  const handleSelect = (item) => {
    if (mode === "file" && item.type !== "file") return;
    if (mode === "folder" && item.type === "file") return;

    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.path === item.path);
      // اگر وجود داشت حذف کن (Toggle)، اگر نبود اضافه کن
      return exists
        ? prev.filter((i) => i.path !== item.path)
        : [...prev, item];
    });
  };

  // 👇 تابع handleConfirm اینجاست 👇
  const handleConfirm = () => {
    if (onSelect) {
      onSelect(selectedItems);
    }
    setSelectedItems([]); // Clear selection
    onClose();
  };

  const handleGoUp = () => {
    if (currentPath === "root") return;
    if (currentPath.endsWith(":\\") || currentPath.endsWith(":/")) {
      setCurrentPath("root");
      return;
    }
    const parts = currentPath.split(/[/\\]/);
    // Remove empty parts
    const cleanParts = parts.filter((p) => p !== "");
    cleanParts.pop();

    if (cleanParts.length === 0) setCurrentPath("root");
    else if (cleanParts.length === 1 && cleanParts[0].includes(":"))
      setCurrentPath(cleanParts[0] + "\\");
    else setCurrentPath(cleanParts.join("\\"));
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "file" ? "Select Files" : "Select Folders"}
      size="lg"
      className="bg-[#0f172a] border-slate-700 h-[600px] flex flex-col"
    >
      <div className="flex flex-1 overflow-hidden h-full">
        {/* --- Sidebar (Quick Access & Drives) --- */}
        <div className="w-56 bg-[#0b1120] border-r border-slate-800 p-2 flex flex-col gap-4 overflow-y-auto shrink-0">
          {/* Quick Access */}
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">
              Quick Access
            </div>
            {quickAccess.map((qa, i) => (
              <button
                key={i}
                onClick={() => setCurrentPath(qa.path)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors",
                  currentPath === qa.path
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200",
                )}
              >
                <QuickIcon icon={qa.icon} className="w-4 h-4 opacity-70" />{" "}
                {qa.name}
              </button>
            ))}
          </div>

          {/* Drives */}
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">
              This PC
            </div>
            <button
              onClick={() => setCurrentPath("root")}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors",
                currentPath === "root"
                  ? "bg-blue-600/20 text-blue-400"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200",
              )}
            >
              <Home className="w-4 h-4" /> Overview
            </button>
            {drives.map((drive, i) => (
              <button
                key={i}
                onClick={() => setCurrentPath(drive.path)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors",
                  currentPath === drive.path
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200",
                )}
              >
                <HardDrive className="w-4 h-4" /> {drive.name}
              </button>
            ))}
          </div>
        </div>

        {/* --- Main Content --- */}
        <div className="flex-1 flex flex-col bg-[#1e293b]/30 min-w-0">
          {/* Navbar */}
          <div className="h-12 border-b border-slate-700 flex items-center px-3 gap-2 bg-[#0f172a] shrink-0">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleGoUp}
              disabled={currentPath === "root"}
              className="h-8 w-8 text-slate-400 hover:text-white"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>

            {/* Breadcrumb Path */}
            <div className="flex-1 h-8 bg-[#0b1120] border border-slate-700 rounded-md flex items-center px-3 overflow-hidden">
              <span className="text-xs font-mono text-slate-300 whitespace-nowrap overflow-hidden text-ellipsis">
                {currentPath === "root" ? "This PC" : currentPath}
              </span>
            </div>

            <div className="relative w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 bg-[#0b1120] border border-slate-700 rounded-md pl-8 pr-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                placeholder="Search..."
              />
            </div>
          </div>

          {/* File Grid */}
          <div
            className="flex-1 overflow-y-auto p-2"
            onDoubleClick={(e) => {
              if (e.target === e.currentTarget) setSelectedItems([]);
            }}
          >
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin mb-2 text-blue-500" />
                <span className="text-xs">Loading contents...</span>
              </div>
            ) : (
              <div className="flex flex-col">
                {/* Header Row */}
                <div className="grid grid-cols-12 px-3 py-2 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-700/50 mb-1 sticky top-0 bg-[#1e293b] z-10">
                  <div className="col-span-8">Name</div>
                  <div className="col-span-4">Type</div>
                </div>

                {filteredItems.map((item, i) => {
                  const isSelected = selectedItems.find(
                    (x) => x.path === item.path,
                  );
                  const isFolder =
                    item.type === "folder" || item.type === "drive";

                  // Disable selection logic
                  const canSelect =
                    (mode === "file" && !isFolder) ||
                    (mode === "folder" && isFolder && item.type !== "drive");

                  return (
                    <div
                      key={i}
                      onClick={() =>
                        canSelect ? handleSelect(item) : handleNavigate(item)
                      }
                      onDoubleClick={() => handleNavigate(item)}
                      className={cn(
                        "grid grid-cols-12 items-center px-3 py-2 rounded-md border text-xs cursor-pointer transition-all group select-none",
                        isSelected
                          ? "bg-blue-600/20 border-blue-500/50"
                          : "bg-transparent border-transparent hover:bg-slate-700/50",
                        !canSelect &&
                          !isFolder &&
                          "opacity-50 cursor-not-allowed", // Disabled files in folder mode
                      )}
                    >
                      <div className="col-span-8 flex items-center gap-3 overflow-hidden">
                        {/* Checkbox (Only if selectable) */}
                        {canSelect && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelect(item);
                            }}
                            className="shrink-0 cursor-pointer"
                          >
                            {isSelected ? (
                              <CheckCircle className="w-4 h-4 text-blue-400 fill-blue-400/20" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                            )}
                          </div>
                        )}

                        <FileIcon
                          type={item.type}
                          className="w-4 h-4 shrink-0"
                        />
                        <span
                          className={cn(
                            "truncate",
                            isSelected && "text-blue-300 font-medium",
                          )}
                        >
                          {item.name}
                        </span>
                      </div>
                      <div className="col-span-4 text-slate-500 text-[10px] capitalize">
                        {item.type}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="h-14 bg-[#0f172a] border-t border-slate-700 flex items-center justify-between px-4 shrink-0">
            <div className="text-xs text-slate-400">
              Selected:{" "}
              <span className="text-slate-200 font-bold">
                {selectedItems.length}
              </span>{" "}
              {mode === "file" ? "Files" : "Folders"}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={onClose}
                className="h-9 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={selectedItems.length === 0}
                className="h-9 px-6 bg-blue-600 hover:bg-blue-500 text-white text-xs shadow-lg shadow-blue-500/20"
              >
                Confirm Selection
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FileBrowserModal;
