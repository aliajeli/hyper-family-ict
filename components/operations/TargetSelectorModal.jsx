"use client";

import { Button, Modal } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useDestinationStore } from "@/store";
import {
  CheckCircle,
  Circle,
  Monitor,
  Play,
  Search,
  Send,
  Square,
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

  const handleAction = () => {
    // Return selected full objects
    const targets = destinations.filter((d) => selectedIds.includes(d.id));
    onConfirm(targets);
    onClose();
  };

  const filtered = destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.ip.includes(search),
  );

  // Dynamic Button Config
  const getButtonConfig = () => {
    switch (actionType) {
      case "start":
        return {
          label: "Start Service",
          icon: Play,
          color: "bg-emerald-600 hover:bg-emerald-500",
        };
      case "stop":
        return {
          label: "Stop Service",
          icon: Square,
          color: "bg-rose-600 hover:bg-rose-500",
        };
      case "message":
        return {
          label: "Send Message",
          icon: Send,
          color: "bg-blue-600 hover:bg-blue-500",
        };
      default:
        return { label: "Confirm", icon: CheckCircle, color: "bg-slate-600" };
    }
  };
  const btnConfig = getButtonConfig();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
      className="bg-[#0f172a] border-slate-700 h-[600px] flex flex-col p-0 overflow-hidden"
    >
      <div className="flex flex-col h-full bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
        {/* Toolbar */}
        <div className="px-4 py-3 bg-[#1e293b]/50 border-b border-slate-700/50 flex gap-3 items-center shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              className="w-full bg-[#0b1120] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              placeholder="Search targets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 min-h-0 custom-scrollbar">
          {filtered.map((dest) => {
            const isSelected = selectedIds.includes(dest.id);
            return (
              <div
                key={dest.id}
                onClick={() => toggleSelect(dest.id)}
                className={cn(
                  "grid grid-cols-12 gap-4 items-center px-4 py-2.5 rounded-lg border text-sm cursor-pointer transition-all mb-1",
                  isSelected
                    ? "bg-blue-600/10 border-blue-500/30"
                    : "bg-transparent border-transparent hover:bg-slate-800",
                )}
              >
                <div className="col-span-1 flex justify-center">
                  <div
                    className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center",
                      isSelected
                        ? "bg-blue-500 border-blue-500"
                        : "border-slate-600",
                    )}
                  >
                    {isSelected && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
                <div className="col-span-5 font-medium text-slate-200">
                  {dest.name}
                </div>
                <div className="col-span-4 font-mono text-slate-400">
                  {dest.ip}
                </div>
                <div className="col-span-2 text-slate-500 text-xs">
                  {dest.branch}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="h-16 bg-[#0f172a] border-t border-slate-700 flex items-center justify-between px-6 shrink-0">
          <div className="text-sm text-slate-400">
            <span className="text-white font-bold">{selectedIds.length}</span>{" "}
            selected
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={onClose}
              className="h-10 text-slate-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={selectedIds.length === 0}
              className={cn(
                "h-10 px-6 text-white font-medium shadow-lg transition-all gap-2",
                btnConfig.color,
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
