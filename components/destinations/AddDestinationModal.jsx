"use client";

import { Button, Modal } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useDestinationStore } from "@/store";
import { Globe, Map, Save, ShieldCheck, Target } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const AddDestinationModal = ({ isOpen, onClose }) => {
  const { addDestination } = useDestinationStore();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    district: "14",
    branch: "Lahijan",
    name: "",
    ip: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.ip)
      return toast.error("Required fields missing");

    setIsLoading(true);
    await addDestination(formData);
    setIsLoading(false);
    toast.success("Destination Added");
    setFormData({ ...formData, name: "", ip: "" });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Deployment Target"
      size="md"
      className="bg-[#0f172a] border-slate-700"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-2">
        {/* Top Info Banner */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex gap-3 items-start">
          <ShieldCheck className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-blue-300">
              Secure Target Definition
            </h4>
            <p className="text-[10px] text-blue-200/60 leading-relaxed mt-1">
              Adding a target here allows it to receive files, scripts, and
              commands securely. Ensure IP accessibility.
            </p>
          </div>
        </div>

        {/* Location Config */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <Globe className="w-3 h-3" /> District
            </label>
            <select
              value={formData.district}
              onChange={(e) =>
                setFormData({ ...formData, district: e.target.value })
              }
              className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500 appearance-none"
            >
              <option value="14">District 14 (North)</option>
              <option value="1">District 1 (Central)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <Map className="w-3 h-3" /> Branch
            </label>
            <select
              value={formData.branch}
              onChange={(e) =>
                setFormData({ ...formData, branch: e.target.value })
              }
              className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500 appearance-none"
            >
              <option value="Lahijan">Lahijan</option>
              <option value="Ramsar">Ramsar</option>
              <option value="Nowshahr">Nowshahr</option>
              <option value="Royan">Royan</option>
            </select>
          </div>
        </div>

        {/* Target Details */}
        <div className="space-y-4 pt-2">
          <div className="relative group">
            <label className="absolute -top-2 left-2 px-1 bg-[#0f172a] text-[10px] font-bold text-slate-500 group-focus-within:text-blue-500 transition-colors">
              Target Hostname
            </label>
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-transparent border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-700"
              placeholder="SRV-BACKUP-01"
            />
            <Target className="absolute right-3 top-3 w-4 h-4 text-slate-600" />
          </div>

          <div className="relative group">
            <label className="absolute -top-2 left-2 px-1 bg-[#0f172a] text-[10px] font-bold text-slate-500 group-focus-within:text-emerald-500 transition-colors">
              IP Address (v4)
            </label>
            <input
              value={formData.ip}
              onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
              className="w-full bg-transparent border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-200 font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-700"
              placeholder="192.168.100.25"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-700/50 mt-2">
          <span className="text-[10px] text-slate-500">
            Auto-verification enabled
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-slate-400 hover:text-white text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 h-9 text-xs shadow-lg shadow-blue-500/20"
            >
              Add Target
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddDestinationModal;
