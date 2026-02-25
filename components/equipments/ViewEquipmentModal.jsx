"use client";

import { Badge, Button, Modal } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  Calendar,
  CheckCircle,
  Cpu,
  Info,
  MapPin,
  Monitor,
  Network,
  ShoppingCart,
  Tag,
} from "lucide-react";

const ViewEquipmentModal = ({ isOpen, onClose, device }) => {
  if (!device) return null;

  const InfoRow = ({ label, value, icon: Icon, mono = false }) => (
    <div className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
      <span className="text-xs text-slate-400 flex items-center gap-2">
        {Icon && <Icon className="w-3.5 h-3.5 text-slate-500" />}
        {label}
      </span>
      <span
        className={cn(
          "text-sm text-slate-200 font-medium",
          mono && "font-mono",
        )}
      >
        {value || "-"}
      </span>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Device Details"
      size="md"
      className="bg-[#0f172a] border-slate-700 max-h-[85vh] flex flex-col"
    >
      <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
        {/* Header Card */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Info className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{device.name}</h3>
            <div className="flex gap-2 mt-1">
              <Badge
                variant="outline"
                className="text-[10px] border-slate-600 text-slate-400"
              >
                {device.type}
              </Badge>
              <Badge
                variant="success"
                className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              >
                Active
              </Badge>
            </div>
          </div>
        </div>

        {/* General Info */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            General Information
          </h4>
          <div className="bg-[#1e293b]/50 rounded-lg p-3 border border-slate-700/50">
            <InfoRow label="Hostname" value={device.hostname} icon={Monitor} />
            <InfoRow label="Model" value={device.model} icon={Cpu} />
            <InfoRow label="Serial Number" value={device.sn} icon={Tag} mono />
            <InfoRow
              label="Inventory ID"
              value={device.inventory}
              icon={Tag}
              mono
            />
            <InfoRow label="Branch" value={device.branch} icon={MapPin} />
            <InfoRow
              label="Created At"
              value={new Date(device.createdAt).toLocaleDateString()}
              icon={Calendar}
            />
          </div>
        </div>

        {/* Network Info */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Network Configuration
          </h4>
          <div className="bg-[#1e293b]/50 rounded-lg p-3 border border-slate-700/50">
            <InfoRow label="IP Address" value={device.ip} icon={Network} mono />
            <InfoRow
              label="Switch IP"
              value={device.swIp}
              icon={Network}
              mono
            />
            <InfoRow label="Switch Port" value={device.swPort} icon={Network} />
            {device.vlan && (
              <InfoRow label="VLAN" value={device.vlan} icon={Network} />
            )}
            {device.mac && (
              <InfoRow
                label="MAC Address"
                value={device.mac}
                icon={Network}
                mono
              />
            )}
          </div>
        </div>

        {/* Sub Items (POS / Ports) */}
        {device.subItems && device.subItems.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              {device.type === "Switch"
                ? "Connected Ports"
                : "Peripheral Devices"}
            </h4>
            <div className="space-y-2">
              {device.subItems.map((item, i) => (
                <div
                  key={i}
                  className="bg-[#1e293b]/30 rounded-lg p-3 border border-slate-700/50 text-xs"
                >
                  <div className="flex justify-between items-center mb-2 border-b border-slate-700/50 pb-1">
                    <span className="font-bold text-slate-300">
                      {item.subType || `Port ${item.port}`}
                    </span>
                    {item.status && (
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[9px]",
                          item.status === "Up"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-rose-500/20 text-rose-400",
                        )}
                      >
                        {item.status}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-400">
                    {Object.entries(item).map(
                      ([key, val]) =>
                        key !== "subType" &&
                        key !== "status" &&
                        val && (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize opacity-70">
                              {key}:
                            </span>
                            <span className="text-slate-200 font-mono">
                              {val}
                            </span>
                          </div>
                        ),
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-700 bg-[#1e293b] flex justify-end">
        <Button
          onClick={onClose}
          className="bg-slate-700 hover:bg-slate-600 text-white px-6"
        >
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default ViewEquipmentModal;
