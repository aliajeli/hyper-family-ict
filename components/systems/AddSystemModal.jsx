"use client";

import { Button, Input, Modal } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useSystemStore } from "@/store";
import {
  ChevronDown,
  ChevronRight,
  Edit2,
  List,
  MapPin,
  Monitor,
  Network,
  PlusCircle,
  Router,
  Save,
  Search,
  Server,
  ShoppingCart,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const deviceTypes = [
  { value: "Router", label: "Router", icon: Router, color: "text-orange-400" },
  { value: "Switch", label: "Switch", icon: Network, color: "text-blue-400" },
  { value: "Server", label: "Server", icon: Server, color: "text-indigo-400" },
  { value: "NVR", label: "NVR", icon: Video, color: "text-rose-400" },
  {
    value: "Client",
    label: "Client PC",
    icon: Monitor,
    color: "text-emerald-400",
  },
  {
    value: "Checkout",
    label: "Checkout",
    icon: ShoppingCart,
    color: "text-amber-400",
  },
];

const serverSubTypes = ["Kyan", "ESXi", "iLO"];
const branches = ["Lahijan", "Ramsar", "Nowshahr", "Royan"];

const AddSystemModal = ({ isOpen, onClose }) => {
  const { systems, addSystem, deleteSystem } = useSystemStore();
  const [activeTab, setActiveTab] = useState("add");
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedBranches, setExpandedBranches] = useState(branches);

  const [formData, setFormData] = useState({
    branch: "Lahijan",
    type: "Client",
    subType: "",
    name: "",
    ip: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.ip) return toast.error("Required");
    setIsLoading(true);
    await addSystem({
      ...formData,
      type:
        formData.type === "Server" && formData.subType
          ? formData.subType
          : formData.type,
      status: "unknown",
    });
    setIsLoading(false);
    toast.success("System Added");
    setFormData({ ...formData, name: "", ip: "" });
  };

  const toggleBranch = (branch) => {
    setExpandedBranches((prev) =>
      prev.includes(branch)
        ? prev.filter((b) => b !== branch)
        : [...prev, branch],
    );
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this system?")) {
      await deleteSystem(id);
      toast.success("Deleted");
    }
  };

  // Safe Filtering Logic
  const filteredSystems = systems.filter(
    (sys) =>
      (sys.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (sys.ip || "").includes(search),
  );

  const groupedSystems = branches.reduce((acc, branch) => {
    acc[branch] = filteredSystems.filter((s) => s.branch === branch);
    return acc;
  }, {});

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="System Management"
      size="lg"
      className="bg-[#0f172a] border-slate-700 h-[550px] flex flex-col p-0 overflow-hidden"
    >
      {/* TABS */}
      <div className="flex border-b border-slate-700 bg-[#1e293b]/50 px-3 pt-2 shrink-0">
        <button
          onClick={() => setActiveTab("add")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-xs font-medium border-b-2 transition-colors",
            activeTab === "add"
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-slate-400",
          )}
        >
          <PlusCircle className="w-3.5 h-3.5" /> Register New
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
            {systems.length}
          </span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 min-h-0 bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
        {/* === TAB 1: ADD === */}
        {activeTab === "add" && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Location
              </label>
              <div className="grid grid-cols-4 gap-2">
                {branches.map((b) => (
                  <div
                    key={b}
                    onClick={() => setFormData({ ...formData, branch: b })}
                    className={cn(
                      "cursor-pointer rounded-lg border p-2 flex flex-col items-center gap-1 transition-all",
                      formData.branch === b
                        ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
                        : "bg-[#1e293b] border-slate-700 text-slate-400 hover:border-slate-500",
                    )}
                  >
                    <MapPin className="w-4 h-4" />
                    <span className="text-[10px] font-semibold">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {deviceTypes.map((t) => (
                  <div
                    key={t.value}
                    onClick={() => setFormData({ ...formData, type: t.value })}
                    className={cn(
                      "cursor-pointer rounded-lg border p-2 flex items-center gap-2 transition-all",
                      formData.type === t.value
                        ? "bg-slate-800 border-slate-500 ring-1 ring-slate-500"
                        : "bg-[#1e293b] border-slate-700 hover:bg-slate-800",
                    )}
                  >
                    <t.icon className={cn("w-4 h-4", t.color)} />
                    <span
                      className={cn(
                        "text-[11px] font-medium",
                        formData.type === t.value
                          ? "text-white"
                          : "text-slate-400",
                      )}
                    >
                      {t.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {formData.type === "Server" && (
              <div className="flex gap-2 bg-indigo-500/10 p-1.5 rounded-lg border border-indigo-500/20">
                {serverSubTypes.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setFormData({ ...formData, subType: sub })}
                    className={cn(
                      "flex-1 py-1 text-[10px] rounded transition-colors font-medium",
                      formData.subType === sub
                        ? "bg-indigo-600 text-white"
                        : "text-indigo-300 hover:bg-indigo-600/20",
                    )}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">
                  Name
                </label>
                <input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-[#0b1120] border border-slate-700 rounded-md px-3 py-2 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. Checkout-01"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">
                  IP
                </label>
                <input
                  value={formData.ip}
                  onChange={(e) =>
                    setFormData({ ...formData, ip: e.target.value })
                  }
                  className="w-full bg-[#0b1120] border border-slate-700 rounded-md px-3 py-2 text-xs text-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
                  placeholder="192.168.x.x"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-700/50">
              <Button
                type="submit"
                isLoading={isLoading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 h-8 text-xs shadow-lg"
              >
                <Save className="w-3.5 h-3.5 mr-1.5" /> Save
              </Button>
            </div>
          </form>
        )}

        {/* === TAB 2: MANAGE === */}
        {activeTab === "manage" && (
          <div className="flex flex-col h-full gap-3">
            <div className="relative shrink-0">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0b1120] border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                placeholder="Search systems..."
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
              {branches.map((branch) => {
                const items = groupedSystems[branch] || [];
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
                            <div className="col-span-5">
                              <div className="text-xs font-medium text-slate-200">
                                {sys.name}
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                {sys.ip}
                              </div>
                            </div>
                            <div className="col-span-5 flex items-center gap-1.5 text-[11px] text-slate-400">
                              <Server className="w-3 h-3" /> {sys.type}
                            </div>
                            <div className="col-span-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleDelete(sys.id)}
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
                        No systems
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

export default AddSystemModal;
