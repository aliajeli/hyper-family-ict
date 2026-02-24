"use client";

import { Button, Input, Modal } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useSystemStore } from "@/store";
import {
  Activity,
  MapPin,
  Monitor,
  Network,
  Router,
  Save,
  Server,
  ShoppingCart,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const deviceTypes = [
  { value: "Router", label: "Router", icon: Router, color: "text-orange-400" },
  { value: "Switch", label: "Switch", icon: Network, color: "text-blue-400" },
  { value: "Server", label: "Server", icon: Server, color: "text-indigo-400" }, // Includes Kyan, ESXi, iLO
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

// Sub-types for Server
const serverSubTypes = ["Kyan", "ESXi", "iLO"];

const branches = [
  { value: "Lahijan", label: "Lahijan" },
  { value: "Ramsar", label: "Ramsar" },
  { value: "Nowshahr", label: "Nowshahr" },
  { value: "Royan", label: "Royan" },
];

const AddSystemModal = ({ isOpen, onClose }) => {
  const { addSystem } = useSystemStore();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    branch: "Lahijan",
    type: "Client",
    subType: "", // For servers
    name: "",
    ip: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.ip)
      return toast.error("Name & IP required");

    setIsLoading(true);
    const finalType =
      formData.type === "Server" && formData.subType
        ? formData.subType
        : formData.type;

    await addSystem({ ...formData, type: finalType, status: "unknown" });

    setIsLoading(false);
    toast.success("System Added");
    setFormData({ ...formData, name: "", ip: "" });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register New Node"
      size="lg"
      className="bg-[#0f172a] border-slate-700"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-2">
        {/* Branch Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
            Location
          </label>
          <div className="grid grid-cols-4 gap-2">
            {branches.map((b) => (
              <div
                key={b.value}
                onClick={() => setFormData({ ...formData, branch: b.value })}
                className={cn(
                  "cursor-pointer rounded-lg border p-3 flex flex-col items-center gap-2 transition-all",
                  formData.branch === b.value
                    ? "bg-blue-600/10 border-blue-500 text-blue-400"
                    : "bg-[#1e293b] border-slate-700 text-slate-400 hover:border-slate-500",
                )}
              >
                <MapPin className="w-5 h-5" />
                <span className="text-xs font-medium">{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Type Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
            Device Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {deviceTypes.map((t) => (
              <div
                key={t.value}
                onClick={() => setFormData({ ...formData, type: t.value })}
                className={cn(
                  "cursor-pointer rounded-lg border p-3 flex items-center gap-3 transition-all",
                  formData.type === t.value
                    ? `bg-slate-800 border-slate-500 ring-1 ring-slate-500`
                    : "bg-[#1e293b] border-slate-700 hover:bg-slate-800",
                )}
              >
                <div className={cn("p-2 rounded-md bg-[#0f172a]", t.color)}>
                  <t.icon className="w-5 h-5" />
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    formData.type === t.value ? "text-white" : "text-slate-400",
                  )}
                >
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Server Sub-Type (Conditional) */}
        {formData.type === "Server" && (
          <div className="flex gap-2 bg-indigo-500/10 p-2 rounded-lg border border-indigo-500/20">
            {serverSubTypes.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setFormData({ ...formData, subType: sub })}
                className={cn(
                  "flex-1 py-1.5 text-xs rounded-md transition-colors font-medium",
                  formData.subType === sub
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-indigo-300 hover:bg-indigo-600/20",
                )}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {/* Details Input */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-400 ml-1">System Name</label>
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
              placeholder="e.g. Checkout-01"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400 ml-1">IP Address</label>
            <input
              value={formData.ip}
              onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
              className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
              placeholder="192.168.x.x"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 shadow-lg shadow-emerald-500/20"
          >
            <Save className="w-4 h-4 mr-2" /> Register System
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddSystemModal;
