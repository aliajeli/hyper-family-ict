"use client";

import { Badge, Button, Modal } from "@/components/ui";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { cn } from "@/lib/utils";
import useEquipmentStore from "@/store/equipmentStore";
import {
  ArrowLeft,
  Edit,
  Eye,
  MapPin,
  Monitor,
  Network,
  Plus,
  Printer,
  Scale,
  Search,
  ShoppingCart,
  Smartphone,
  Trash2,
  Video,
  Wifi,
} from "lucide-react";
import { useEffect, useState } from "react";
import AddEquipmentModal from "./AddEquipmentModal";
import ViewEquipmentModal from "./ViewEquipmentModal"; // 👈 Import View Modal

const EQUIPMENT_TYPES = [
  {
    id: "Checkout",
    label: "Checkouts",
    icon: ShoppingCart,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    id: "Client",
    label: "Workstations",
    icon: Monitor,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    id: "Scale",
    label: "Scales",
    icon: Scale,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    id: "Switch",
    label: "Network Switches",
    icon: Network,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    id: "AccessPoint",
    label: "Access Points",
    icon: Wifi,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    id: "PDA",
    label: "Handheld PDAs",
    icon: Smartphone,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
  },
  {
    id: "Printer",
    label: "Printers",
    icon: Printer,
    color: "text-slate-400",
    bg: "bg-slate-500/10",
  },
  {
    id: "NVR",
    label: "NVR / Cameras",
    icon: Video,
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
];

const BRANCHES = ["Lahijan", "Ramsar", "Nowshahr", "Royan"];

const EquipmentsModal = ({ isOpen, onClose }) => {
  const { equipments, fetchEquipments, deleteEquipment } = useEquipmentStore();

  const [selectedBranch, setSelectedBranch] = useState("Lahijan");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [deviceToEdit, setDeviceToEdit] = useState(null);
  const [deviceToDelete, setDeviceToDelete] = useState(null);
  const [deviceToView, setDeviceToView] = useState(null); // 👈 View State

  useEffect(() => {
    if (isOpen) fetchEquipments();
  }, [isOpen]);

  const branchEquipments = equipments.filter(
    (sys) => sys.branch === selectedBranch,
  );
  const getCount = (typeId) =>
    branchEquipments.filter((e) => e.type === typeId).length;

  const filteredList = selectedCategory
    ? branchEquipments.filter(
        (e) =>
          e.type === selectedCategory &&
          ((e.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
            (e.ip || "").includes(search)),
      )
    : [];

  // Handlers
  const handleAddDevice = () => {
    setDeviceToEdit(null);
    setShowAddModal(true);
  };

  const handleEditDevice = (device) => {
    setDeviceToEdit(device);
    setShowAddModal(true);
  };

  const handleViewDevice = (device) => {
    // 👈 View Handler
    setDeviceToView(device);
  };

  const handleDeleteClick = (device) => {
    setDeviceToDelete(device);
  };

  const confirmDelete = async () => {
    if (deviceToDelete) {
      await deleteEquipment(deviceToDelete.id);
      setDeviceToDelete(null);
    }
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setDeviceToEdit(null);
    fetchEquipments();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Equipment Inventory"
        size="full"
        className="bg-[#0f172a] border-slate-700 w-[95vw] h-[90vh] p-0 flex flex-col overflow-hidden shadow-2xl rounded-2xl"
      >
        <div className="flex flex-1 overflow-hidden">
          {/* --- SIDEBAR --- */}
          <div className="w-60 bg-[#0b1120] border-r border-slate-800 p-3 flex flex-col gap-2 shrink-0">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">
              Store Locations
            </div>
            {BRANCHES.map((branch) => (
              <button
                key={branch}
                onClick={() => {
                  setSelectedBranch(branch);
                  setSelectedCategory(null);
                  setSearch("");
                }}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group",
                  selectedBranch === branch
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200",
                )}
              >
                <span className="flex items-center gap-2.5">
                  <MapPin
                    className={cn(
                      "w-3.5 h-3.5",
                      selectedBranch === branch
                        ? "text-white"
                        : "text-slate-500",
                    )}
                  />
                  {branch}
                </span>
                <span
                  className={cn(
                    "text-[9px] px-1.5 py-0.5 rounded",
                    selectedBranch === branch
                      ? "bg-blue-500 text-white"
                      : "bg-slate-700 text-slate-500",
                  )}
                >
                  {equipments.filter((s) => s.branch === branch).length}
                </span>
              </button>
            ))}
          </div>

          {/* --- MAIN CONTENT --- */}
          <div className="flex-1 flex flex-col bg-[#0f172a] relative overflow-hidden min-w-0">
            {/* Header */}
            <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0f172a]/90 backdrop-blur-md z-10 shrink-0">
              <div className="flex items-center gap-4">
                {selectedCategory && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedCategory(null)}
                    className="h-8 w-8 text-slate-400 hover:text-white rounded-full bg-slate-800/50 hover:bg-slate-700"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                )}
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    {selectedCategory ? `${selectedCategory}s` : selectedBranch}
                    {!selectedCategory && (
                      <span className="text-slate-500 font-normal text-xs bg-slate-800/50 px-2 py-0.5 rounded">
                        Overview
                      </span>
                    )}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {selectedCategory && (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search devices..."
                      className="h-8 w-56 bg-[#1e293b] border border-slate-700 rounded-lg pl-9 pr-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                    />
                  </div>
                )}
                <Button
                  onClick={handleAddDevice}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-8 px-4 gap-1.5 shadow-lg shadow-blue-500/20"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Device
                </Button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
              {!selectedCategory ? (
                <div className="grid grid-cols-4 gap-4">
                  {EQUIPMENT_TYPES.map((type) => {
                    const count = getCount(type.id);
                    return (
                      <div
                        key={type.id}
                        onClick={() => setSelectedCategory(type.id)}
                        className={cn(
                          "flex flex-col p-4 rounded-xl border transition-all cursor-pointer group hover:-translate-y-1 hover:shadow-xl",
                          "bg-[#1e293b]/40 border-slate-800 hover:bg-[#1e293b] hover:border-slate-600",
                        )}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className={cn("p-2.5 rounded-lg", type.bg)}>
                            <type.icon className={cn("w-5 h-5", type.color)} />
                          </div>
                          <span
                            className={cn(
                              "text-xl font-bold font-mono",
                              count > 0 ? "text-white" : "text-slate-600",
                            )}
                          >
                            {count}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
                            {type.label}
                          </h3>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            Manage inventory &rarr;
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-[#1e293b]/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#0b1120]/80 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                      <tr>
                        <th className="px-5 py-3 border-b border-slate-700">
                          Device Name
                        </th>
                        <th className="px-5 py-3 border-b border-slate-700">
                          IP Address
                        </th>
                        <th className="px-5 py-3 border-b border-slate-700">
                          Model
                        </th>
                        <th className="px-5 py-3 border-b border-slate-700">
                          Status
                        </th>
                        <th className="px-5 py-3 border-b border-slate-700 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50 text-slate-300 text-xs">
                      {filteredList.map((device) => (
                        <tr
                          key={device.id}
                          className="hover:bg-slate-700/30 transition-colors group"
                        >
                          <td className="px-5 py-3 font-medium text-white flex items-center gap-3">
                            <div className="p-1.5 rounded bg-slate-800 border border-slate-700">
                              <DeviceIcon
                                type={device.type}
                                className="w-3.5 h-3.5 text-slate-400"
                              />
                            </div>
                            <div className="flex flex-col">
                              <span>{device.name || "Unnamed"}</span>
                              {device.hostname && (
                                <span className="text-[9px] text-slate-500">
                                  {device.hostname}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3 font-mono text-slate-400">
                            {device.ip}
                          </td>
                          <td className="px-5 py-3 text-slate-400">
                            {device.model || "-"}
                          </td>
                          <td className="px-5 py-3">
                            <Badge
                              variant="success"
                              className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] px-2 py-0.5 h-auto"
                            >
                              Active
                            </Badge>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                              {/* 👇 Action Buttons */}
                              <button
                                onClick={() => handleViewDevice(device)}
                                className="p-1.5 rounded hover:bg-blue-500/10 text-slate-400 hover:text-blue-400 transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleEditDevice(device)}
                                className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(device)}
                                className="p-1.5 rounded hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredList.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-12 text-center text-slate-500"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <Search className="w-8 h-8 opacity-20" />
                              <span>No devices found in this category.</span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Add / Edit Modal */}
      <AddEquipmentModal
        isOpen={showAddModal}
        onClose={handleCloseAddModal}
        defaultType={selectedCategory}
        editDevice={deviceToEdit}
      />

      {/* View Modal */}
      <ViewEquipmentModal
        isOpen={!!deviceToView}
        onClose={() => setDeviceToView(null)}
        device={deviceToView}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deviceToDelete}
        onClose={() => setDeviceToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Device"
        message={`Are you sure you want to delete ${deviceToDelete?.name}?`}
      />
    </>
  );
};

// Helper
const DeviceIcon = ({ type, className }) => {
  const item = EQUIPMENT_TYPES.find((t) => t.id === type);
  const Icon = item ? item.icon : Monitor;
  return <Icon className={className} />;
};

export default EquipmentsModal;
