"use client";

import { Button, Modal } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useDestinationStore } from "@/store";
import {
  CheckCircle,
  CheckSquare,
  Monitor,
  Play,
  Search,
  Send,
  Square,
  XSquare,
} from "lucide-react";
import { useEffect, useState } from "react";

const TargetSelectorModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  actionType,
}) => {
  const { destinations, fetchDestinations } = useDestinationStore();
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch and Reset on Open
  useEffect(() => {
    if (isOpen) {
      fetchDestinations();
      setSelectedIds([]);
      setSearch("");
    }
  }, [isOpen]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filtered.length) setSelectedIds([]);
    else setSelectedIds(filtered.map((d) => d.id));
  };

  const handleConfirm = () => {
    const targets = destinations.filter((d) => selectedIds.includes(d.id));
    onConfirm(targets);
    onClose();
  };

  // Safe Filtering Logic
  const filtered = destinations.filter(
    (d) =>
      (d.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (d.ip || "").includes(search) ||
      (d.branch?.toLowerCase() || "").includes(search.toLowerCase()),
  );

  // Dynamic Button Config based on action
  const getButtonConfig = () => {
    switch (actionType) {
      case "start":
        return {
          label: "Start Service",
          icon: Play,
          color: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20",
        };
      case "stop":
        return {
          label: "Stop Service",
          icon: XSquare,
          color: "bg-rose-600 hover:bg-rose-500 shadow-rose-500/20",
        };
      case "message":
        return {
          label: "Send Message",
          icon: Send,
          color: "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20",
        };
      default:
        return {
          label: "Confirm Selection",
          icon: CheckCircle,
          color: "bg-slate-600 hover:bg-slate-500 shadow-slate-500/20",
        };
    }
  };
  const btnConfig = getButtonConfig();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
      className="bg-[#0f172a] border-slate-700 h-[600px] flex flex-col p-0 overflow-hidden shadow-2xl rounded-2xl"
    >
      <div className="flex flex-col h-full bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
        {/* --- Toolbar --- */}
        <div className="px-4 py-3 bg-[#1e293b]/50 border-b border-slate-700/50 flex gap-3 items-center shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              className="w-full bg-[#0b1120] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
              placeholder="Search targets by Name, IP, or Branch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="text-xs font-mono text-slate-500 bg-[#0b1120] px-3 py-2 rounded-lg border border-slate-700">
            Found: {filtered.length}
          </div>
        </div>

        {/* --- Table Header --- */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-[#1e293b] border-b border-slate-700 text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 select-none">
          <div className="col-span-1 flex justify-center">
            <button
              onClick={handleSelectAll}
              className="hover:text-white transition-colors p-1 rounded hover:bg-slate-800"
            >
              {filtered.length > 0 && selectedIds.length === filtered.length ? (
                <CheckSquare className="w-4 h-4 text-blue-500" />
              ) : (
                <Square className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="col-span-5">System Name</div>
          <div className="col-span-4">IP Address</div>
          <div className="col-span-2">Branch</div>
        </div>

        {/* --- List Content --- */}
        <div className="flex-1 overflow-y-auto p-2 min-h-0 custom-scrollbar">
          {filtered.length > 0 ? (
            <div className="flex flex-col gap-1">
              {filtered.map((dest) => {
                const isSelected = selectedIds.includes(dest.id);
                return (
                  <div
                    key={dest.id}
                    onClick={() => toggleSelect(dest.id)}
                    className={cn(
                      "grid grid-cols-12 gap-4 items-center px-4 py-2.5 rounded-lg border text-sm cursor-pointer transition-all duration-200 group select-none",
                      isSelected
                        ? "bg-blue-600/10 border-blue-500/30 shadow-sm"
                        : "bg-transparent border-transparent hover:bg-slate-800 hover:border-slate-700",
                    )}
                  >
                    {/* Checkbox */}
                    <div className="col-span-1 flex justify-center">
                      <div
                        className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                          isSelected
                            ? "bg-blue-500 border-blue-500"
                            : "border-slate-600 group-hover:border-slate-400",
                        )}
                      >
                        {isSelected && (
                          <CheckSquare className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>

                    {/* Name */}
                    <div className="col-span-5 flex items-center gap-3 overflow-hidden">
                      <div
                        className={cn(
                          "p-1.5 rounded-md",
                          isSelected
                            ? "bg-blue-500/20"
                            : "bg-slate-800 group-hover:bg-slate-700",
                        )}
                      >
                        <Monitor
                          className={cn(
                            "w-4 h-4",
                            isSelected ? "text-blue-400" : "text-slate-500",
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          "truncate font-medium",
                          isSelected ? "text-blue-200" : "text-slate-200",
                        )}
                      >
                        {dest.name}
                      </span>
                    </div>

                    {/* IP */}
                    <div className="col-span-4 font-mono text-slate-400 group-hover:text-slate-300">
                      {dest.ip}
                    </div>

                    {/* Branch */}
                    <div className="col-span-2 text-xs text-slate-500 group-hover:text-slate-400">
                      <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">
                        {dest.branch}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50 gap-3">
              <Search className="w-12 h-12 stroke-[1]" />
              <p className="text-sm">No targets match your search</p>
            </div>
          )}
        </div>

        {/* --- Footer --- */}
        <div className="h-16 bg-[#0f172a] border-t border-slate-700 flex items-center justify-between px-6 shrink-0 shadow-lg z-10">
          <div className="text-sm text-slate-400">
            <span className="text-white font-bold text-lg mr-1">
              {selectedIds.length}
            </span>
            systems selected
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={onClose}
              className="h-10 px-6 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedIds.length === 0}
              className={cn(
                "h-10 px-6 text-white font-medium rounded-lg shadow-lg transition-all flex items-center gap-2",
                selectedIds.length > 0
                  ? btnConfig.color
                  : "bg-slate-800 text-slate-500 cursor-not-allowed shadow-none",
              )}
            >
              <btnConfig.icon className="w-4 h-4" /> {btnConfig.label}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TargetSelectorModal;
