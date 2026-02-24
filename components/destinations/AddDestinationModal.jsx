"use client";

import { Button, Modal } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useDestinationStore } from "@/store";
import {
  ChevronDown,
  ChevronRight,
  Globe,
  List,
  Map,
  PlusCircle,
  Save,
  Search,
  ShieldCheck,
  Target,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const branches = ["Lahijan", "Ramsar", "Nowshahr", "Royan"];

const AddDestinationModal = ({ isOpen, onClose }) => {
  const { destinations, addDestination, deleteDestination } =
    useDestinationStore();
  const [activeTab, setActiveTab] = useState("add");
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedBranches, setExpandedBranches] = useState(branches);

  const [formData, setFormData] = useState({
    district: "14",
    branch: "Lahijan",
    name: "",
    ip: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.ip) return toast.error("Required");
    setIsLoading(true);
    await addDestination(formData);
    setIsLoading(false);
    toast.success("Added");
    setFormData({ ...formData, name: "", ip: "" });
  };

  const toggleBranch = (b) =>
    setExpandedBranches((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b],
    );

  // ...
  const filtered = destinations.filter(
    (d) =>
      (d.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (d.ip || "").includes(search),
  );
  // ...
  const grouped = branches.reduce((acc, b) => {
    acc[b] = filtered.filter((d) => d.branch === b);
    return acc;
  }, {});

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Deployment Targets"
      size="lg"
      className="bg-[#0f172a] border-slate-700 h-[500px] flex flex-col p-0 overflow-hidden"
    >
      <div className="flex border-b border-slate-700 bg-[#1e293b]/50 px-3 pt-2">
        <button
          onClick={() => setActiveTab("add")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-xs font-medium border-b-2 transition-colors",
            activeTab === "add"
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-slate-400",
          )}
        >
          <PlusCircle className="w-3.5 h-3.5" /> Add Target
        </button>
        <button
          onClick={() => setActiveTab("manage")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-xs font-medium border-b-2 transition-colors",
            activeTab === "manage"
              ? "border-emerald-500 text-emerald-400"
              : "border-transparent text-slate-400",
          )}
        >
          <List className="w-3.5 h-3.5" /> Manage List{" "}
          <span className="bg-slate-700 text-slate-300 text-[9px] px-1.5 rounded-full ml-1">
            {destinations.length}
          </span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 min-h-0 bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
        {activeTab === "add" && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2 flex gap-2 items-center">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <div className="text-[10px] text-blue-200/80">
                Secure targets can receive files & commands.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Globe className="w-3 h-3" /> District
                </label>
                <select
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-md px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                >
                  <option value="14">District 14</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Map className="w-3 h-3" /> Branch
                </label>
                <select
                  value={formData.branch}
                  onChange={(e) =>
                    setFormData({ ...formData, branch: e.target.value })
                  }
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-md px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                >
                  {branches.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div className="relative group">
                <label className="absolute -top-1.5 left-2 px-1 bg-[#0f172a] text-[9px] font-bold text-slate-500 group-focus-within:text-blue-500">
                  Hostname
                </label>
                <input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  placeholder="SRV-01"
                />
              </div>
              <div className="relative group">
                <label className="absolute -top-1.5 left-2 px-1 bg-[#0f172a] text-[9px] font-bold text-slate-500 group-focus-within:text-emerald-500">
                  IP Address
                </label>
                <input
                  value={formData.ip}
                  onChange={(e) =>
                    setFormData({ ...formData, ip: e.target.value })
                  }
                  className="w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                  placeholder="192.168.x.x"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-700/50">
              <Button
                type="submit"
                isLoading={isLoading}
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 h-8 text-xs shadow-lg"
              >
                Add Target
              </Button>
            </div>
          </form>
        )}

        {activeTab === "manage" && (
          <div className="flex flex-col h-full gap-3">
            <div className="relative shrink-0">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0b1120] border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                placeholder="Search..."
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
              {branches.map((branch) => {
                const items = grouped[branch] || [];
                if (items.length === 0 && search) return null;
                const isExpanded = expandedBranches.includes(branch);

                return (
                  <div
                    key={branch}
                    className="border border-slate-700 rounded-lg bg-[#1e293b]/30 overflow-hidden"
                  >
                    <div
                      onClick={() => toggleBranch(branch)}
                      className="flex items-center justify-between px-3 py-2 bg-slate-800/50 cursor-pointer hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span className="text-xs font-bold text-slate-300">
                          {branch}
                        </span>
                        <span className="text-[9px] bg-slate-700 text-slate-400 px-1.5 rounded">
                          {items.length}
                        </span>
                      </div>
                    </div>

                    {isExpanded && items.length > 0 && (
                      <div className="divide-y divide-slate-700/50">
                        {items.map((sys) => (
                          <div
                            key={sys.id}
                            className="grid grid-cols-12 items-center px-3 py-2 hover:bg-slate-700/20 transition-colors group"
                          >
                            <div className="col-span-6 font-medium text-xs text-slate-200">
                              {sys.name}
                            </div>
                            <div className="col-span-5 text-[10px] text-slate-500 font-mono">
                              {sys.ip}
                            </div>
                            <div className="col-span-1 flex justify-end opacity-0 group-hover:opacity-100">
                              <button
                                onClick={() => deleteDestination(sys.id)}
                                className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {isExpanded && items.length === 0 && (
                      <div className="p-3 text-center text-[10px] text-slate-600">
                        No targets
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddDestinationModal;
