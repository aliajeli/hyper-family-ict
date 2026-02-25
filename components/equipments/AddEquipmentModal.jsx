"use client";

import { Button, Input, Modal } from "@/components/ui";
import { cn } from "@/lib/utils";
import useEquipmentStore from "@/store/equipmentStore";
import {
  Edit,
  Monitor,
  Network,
  Plus,
  Printer,
  Save,
  Scale,
  Scan,
  ShoppingCart,
  Smartphone,
  Trash2,
  Video,
  Wifi,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const EQUIPMENT_TYPES = [
  { id: "Checkout", label: "Checkout", icon: ShoppingCart },
  { id: "Scale", label: "Scale", icon: Scale },
  { id: "Client", label: "Client PC", icon: Monitor },
  { id: "AccessPoint", label: "Access Point", icon: Wifi },
  { id: "NVR", label: "NVR", icon: Video },
  { id: "Switch", label: "Switch", icon: Network },
  { id: "Printer", label: "Printer", icon: Printer },
  { id: "PDA", label: "PDA", icon: Smartphone },
];

const BRANCHES = ["Lahijan", "Ramsar", "Nowshahr", "Royan"];

const AddEquipmentModal = ({ isOpen, onClose, defaultType, editDevice }) => {
  const { addEquipment, updateEquipment } = useEquipmentStore();
  const [type, setType] = useState(defaultType || "Client");
  const [branch, setBranch] = useState("Lahijan");
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({});
  const [subItems, setSubItems] = useState([]); // POSs or Ports

  // Populate or Reset Form
  useEffect(() => {
    if (isOpen) {
      if (editDevice) {
        // Edit Mode
        setType(editDevice.type);
        setBranch(editDevice.branch);
        setFormData(editDevice); // Fill main fields
        setSubItems(editDevice.subItems || []); // Fill sub-items
      } else {
        // Add Mode
        setFormData({});
        setSubItems([]);
        if (defaultType) setType(defaultType);
      }
    }
  }, [isOpen, editDevice]);

  const handleSave = async () => {
    setIsLoading(true);
    const payload = {
      type,
      branch,
      ...formData,
      subItems,
    };

    try {
      if (editDevice) {
        await updateEquipment(editDevice.id, payload);
        toast.success(`${type} Updated`);
      } else {
        await addEquipment(payload);
        toast.success(`${type} Added`);
      }
      onClose();
    } catch (error) {
      toast.error("Operation Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  // --- Sub Items Handlers ---
  const addSubItemType = (subType) => setSubItems([...subItems, { subType }]); // For Checkouts
  const addSubItem = () => setSubItems([...subItems, {}]); // For Switches (generic)

  const updateSubItem = (index, key, value) => {
    const newItems = [...subItems];
    newItems[index] = { ...newItems[index], [key]: value };
    setSubItems(newItems);
  };

  const removeSubItem = (index) =>
    setSubItems(subItems.filter((_, i) => i !== index));

  // --- Dynamic Fields Renderer ---
  const renderFields = () => {
    switch (type) {
      case "Checkout":
        return (
          <>
            <Input
              label="Checkout Number"
              placeholder="1"
              value={formData.number || ""}
              onChange={(e) => updateField("number", e.target.value)}
            />
            <Input
              label="Hostname"
              placeholder="CHK-01"
              value={formData.hostname || ""}
              onChange={(e) => updateField("hostname", e.target.value)}
            />
            <Input
              label="IP Address"
              placeholder="192.168.x.x"
              value={formData.ip || ""}
              onChange={(e) => updateField("ip", e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Switch IP"
                value={formData.swIp || ""}
                onChange={(e) => updateField("swIp", e.target.value)}
              />
              <Input
                label="Switch Port"
                value={formData.swPort || ""}
                onChange={(e) => updateField("swPort", e.target.value)}
              />
            </div>
            <Input
              label="Model"
              value={formData.model || ""}
              onChange={(e) => updateField("model", e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Serial Number"
                value={formData.sn || ""}
                onChange={(e) => updateField("sn", e.target.value)}
              />
              <Input
                label="Inventory Count"
                value={formData.inventory || ""}
                onChange={(e) => updateField("inventory", e.target.value)}
              />
            </div>
          </>
        );
      case "Scale":
        return (
          <>
            <Input
              label="Scale Name"
              placeholder="Scale 1"
              value={formData.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
            />
            <Input
              label="Brand"
              placeholder="DIGI"
              value={formData.brand || ""}
              onChange={(e) => updateField("brand", e.target.value)}
            />
            <Input
              label="Model"
              placeholder="SM-100"
              value={formData.model || ""}
              onChange={(e) => updateField("model", e.target.value)}
            />
            <Input
              label="IP Address"
              value={formData.ip || ""}
              onChange={(e) => updateField("ip", e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Switch IP"
                value={formData.swIp || ""}
                onChange={(e) => updateField("swIp", e.target.value)}
              />
              <Input
                label="Switch Port"
                value={formData.swPort || ""}
                onChange={(e) => updateField("swPort", e.target.value)}
              />
            </div>
            <Input
              label="Serial Number"
              value={formData.sn || ""}
              onChange={(e) => updateField("sn", e.target.value)}
            />
            <Input
              label="Inventory Count"
              value={formData.inventory || ""}
              onChange={(e) => updateField("inventory", e.target.value)}
            />
          </>
        );
      case "Client":
        return (
          <>
            <Input
              label="Client Name"
              placeholder="Admin PC"
              value={formData.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
            />
            <Input
              label="Hostname"
              placeholder="PC-01"
              value={formData.hostname || ""}
              onChange={(e) => updateField("hostname", e.target.value)}
            />
            <Input
              label="IP Address"
              value={formData.ip || ""}
              onChange={(e) => updateField("ip", e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Switch IP"
                value={formData.swIp || ""}
                onChange={(e) => updateField("swIp", e.target.value)}
              />
              <Input
                label="Switch Port"
                value={formData.swPort || ""}
                onChange={(e) => updateField("swPort", e.target.value)}
              />
            </div>
          </>
        );
      case "AccessPoint":
        return (
          <>
            <Input
              label="AP Name"
              placeholder="Lobby AP"
              value={formData.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
            />
            <Input
              label="Model"
              placeholder="Unifi"
              value={formData.model || ""}
              onChange={(e) => updateField("model", e.target.value)}
            />
            <Input
              label="IP Address"
              value={formData.ip || ""}
              onChange={(e) => updateField("ip", e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Switch IP"
                value={formData.swIp || ""}
                onChange={(e) => updateField("swIp", e.target.value)}
              />
              <Input
                label="Switch Port"
                value={formData.swPort || ""}
                onChange={(e) => updateField("swPort", e.target.value)}
              />
            </div>
            <Input
              label="Serial Number"
              value={formData.sn || ""}
              onChange={(e) => updateField("sn", e.target.value)}
            />
            <Input
              label="Inventory Count"
              value={formData.inventory || ""}
              onChange={(e) => updateField("inventory", e.target.value)}
            />
          </>
        );
      case "NVR":
        return (
          <>
            <Input
              label="NVR Number"
              placeholder="1"
              value={formData.number || ""}
              onChange={(e) => updateField("number", e.target.value)}
            />
            <Input
              label="Model"
              placeholder="HikVision"
              value={formData.model || ""}
              onChange={(e) => updateField("model", e.target.value)}
            />
            <Input
              label="VLAN"
              placeholder="100"
              value={formData.vlan || ""}
              onChange={(e) => updateField("vlan", e.target.value)}
            />
            <Input
              label="IP Address"
              value={formData.ip || ""}
              onChange={(e) => updateField("ip", e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Switch IP"
                value={formData.swIp || ""}
                onChange={(e) => updateField("swIp", e.target.value)}
              />
              <Input
                label="Switch Port"
                value={formData.swPort || ""}
                onChange={(e) => updateField("swPort", e.target.value)}
              />
            </div>
            <Input
              label="Serial Number"
              value={formData.sn || ""}
              onChange={(e) => updateField("sn", e.target.value)}
            />
            <Input
              label="Inventory Count"
              value={formData.inventory || ""}
              onChange={(e) => updateField("inventory", e.target.value)}
            />
          </>
        );
      case "Switch":
        return (
          <>
            <Input
              label="Switch Name"
              placeholder="Core Switch"
              value={formData.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
            />
            <Input
              label="Location"
              placeholder="Server Room"
              value={formData.location || ""}
              onChange={(e) => updateField("location", e.target.value)}
            />
            <Input
              label="Model"
              placeholder="Cisco 2960"
              value={formData.model || ""}
              onChange={(e) => updateField("model", e.target.value)}
            />
            <Input
              label="IP Address"
              value={formData.ip || ""}
              onChange={(e) => updateField("ip", e.target.value)}
            />
            <Input
              label="Serial Number"
              value={formData.sn || ""}
              onChange={(e) => updateField("sn", e.target.value)}
            />
            <Input
              label="Inventory Count"
              value={formData.inventory || ""}
              onChange={(e) => updateField("inventory", e.target.value)}
            />
          </>
        );
      case "Printer":
        return (
          <>
            <Input
              label="Printer Type"
              placeholder="Laser / Thermal"
              value={formData.typeStr || ""}
              onChange={(e) => updateField("typeStr", e.target.value)}
            />
            <Input
              label="Model"
              placeholder="HP 2035"
              value={formData.model || ""}
              onChange={(e) => updateField("model", e.target.value)}
            />
            <Input
              label="IP Address"
              value={formData.ip || ""}
              onChange={(e) => updateField("ip", e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Switch IP"
                value={formData.swIp || ""}
                onChange={(e) => updateField("swIp", e.target.value)}
              />
              <Input
                label="Switch Port"
                value={formData.swPort || ""}
                onChange={(e) => updateField("swPort", e.target.value)}
              />
            </div>
            <Input
              label="Serial Number"
              value={formData.sn || ""}
              onChange={(e) => updateField("sn", e.target.value)}
            />
            <Input
              label="Inventory Count"
              value={formData.inventory || ""}
              onChange={(e) => updateField("inventory", e.target.value)}
            />
          </>
        );
      case "PDA":
        return (
          <>
            <Input
              label="PDA Station"
              placeholder="Station 1"
              value={formData.station || ""}
              onChange={(e) => updateField("station", e.target.value)}
            />
            <Input
              label="Model"
              placeholder="Chainway"
              value={formData.model || ""}
              onChange={(e) => updateField("model", e.target.value)}
            />
            <Input
              label="IP Address"
              value={formData.ip || ""}
              onChange={(e) => updateField("ip", e.target.value)}
            />
            <Input
              label="MAC Address"
              value={formData.mac || ""}
              onChange={(e) => updateField("mac", e.target.value)}
            />
            <Input
              label="Serial Number"
              value={formData.sn || ""}
              onChange={(e) => updateField("sn", e.target.value)}
            />
            <Input
              label="Inventory Count"
              value={formData.inventory || ""}
              onChange={(e) => updateField("inventory", e.target.value)}
            />
            <Input
              label="Details"
              value={formData.details || ""}
              onChange={(e) => updateField("details", e.target.value)}
            />
          </>
        );
      default:
        return (
          <div className="text-slate-500 text-sm">
            Please select a valid device type.
          </div>
        );
    }
  };

  const renderSubItems = () => {
    // --- CHECKOUT SUB-DEVICES ---
    if (type === "Checkout") {
      return (
        <div className="space-y-3 mt-4 border-t border-slate-700 pt-4">
          <div className="flex flex-col gap-2 mb-2">
            <h4 className="text-sm font-bold text-slate-300">
              Peripheral Devices
            </h4>

            {/* Device Selector Buttons */}
            <div className="flex flex-wrap gap-1 bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => addSubItemType("POS")}
                className="px-2 py-1 text-[10px] bg-slate-700 hover:bg-slate-600 rounded text-slate-200 border border-slate-600"
                title="POS Terminal"
              >
                POS
              </button>
              <button
                onClick={() => addSubItemType("Monitor 2")}
                className="px-2 py-1 text-[10px] bg-slate-700 hover:bg-slate-600 rounded text-slate-200 border border-slate-600"
                title="2nd Monitor"
              >
                Mon 2
              </button>
              <button
                onClick={() => addSubItemType("Printer")}
                className="px-2 py-1 text-[10px] bg-slate-700 hover:bg-slate-600 rounded text-slate-200 border border-slate-600"
                title="Printer"
              >
                Prn
              </button>
              <button
                onClick={() => addSubItemType("Scanner 3D")}
                className="px-2 py-1 text-[10px] bg-slate-700 hover:bg-slate-600 rounded text-slate-200 border border-slate-600"
                title="3D Scanner"
              >
                3D
              </button>
              <button
                onClick={() => addSubItemType("Gun Scanner")}
                className="px-2 py-1 text-[10px] bg-slate-700 hover:bg-slate-600 rounded text-slate-200 border border-slate-600"
                title="Gun Scanner"
              >
                Gun
              </button>
              <button
                onClick={() => addSubItemType("Deactivator")}
                className="px-2 py-1 text-[10px] bg-slate-700 hover:bg-slate-600 rounded text-slate-200 border border-slate-600"
                title="Deactivator"
              >
                Deact
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            {subItems.map((item, i) => (
              <div
                key={i}
                className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 space-y-2 relative"
              >
                <div className="flex justify-between items-center pb-2 border-b border-slate-700/50 mb-2">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    {item.subType === "POS" && (
                      <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    {item.subType === "Monitor 2" && (
                      <Monitor className="w-3.5 h-3.5 text-blue-400" />
                    )}
                    {item.subType === "Printer" && (
                      <Printer className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    {(item.subType === "Scanner 3D" ||
                      item.subType === "Gun Scanner") && (
                      <Scan className="w-3.5 h-3.5 text-green-400" />
                    )}
                    {item.subType === "Deactivator" && (
                      <Zap className="w-3.5 h-3.5 text-red-400" />
                    )}
                    {item.subType || "Device"} #{i + 1}
                  </span>
                  <button
                    onClick={() => removeSubItem(i)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Conditional Fields */}
                {item.subType === "POS" ? (
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      label="Brand"
                      className="h-7 text-xs"
                      value={item.brand || ""}
                      onChange={(e) =>
                        updateSubItem(i, "brand", e.target.value)
                      }
                    />
                    <Input
                      label="Model"
                      className="h-7 text-xs"
                      value={item.model || ""}
                      onChange={(e) =>
                        updateSubItem(i, "model", e.target.value)
                      }
                    />
                    <Input
                      label="Terminal"
                      className="h-7 text-xs"
                      value={item.terminal || ""}
                      onChange={(e) =>
                        updateSubItem(i, "terminal", e.target.value)
                      }
                    />
                    <Input
                      label="IP"
                      className="h-7 text-xs"
                      value={item.ip || ""}
                      onChange={(e) => updateSubItem(i, "ip", e.target.value)}
                    />
                    <Input
                      label="Serial"
                      className="h-7 text-xs"
                      value={item.sn || ""}
                      onChange={(e) => updateSubItem(i, "sn", e.target.value)}
                    />
                    <Input
                      label="Inventory"
                      className="h-7 text-xs"
                      value={item.inventory || ""}
                      onChange={(e) =>
                        updateSubItem(i, "inventory", e.target.value)
                      }
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Serial Number"
                      className="h-7 text-xs"
                      value={item.sn || ""}
                      onChange={(e) => updateSubItem(i, "sn", e.target.value)}
                    />
                    <Input
                      label="Inventory Count"
                      className="h-7 text-xs"
                      value={item.inventory || ""}
                      onChange={(e) =>
                        updateSubItem(i, "inventory", e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // --- SWITCH PORTS ---
    if (type === "Switch") {
      return (
        <div className="space-y-3 mt-4 border-t border-slate-700 pt-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-slate-300">Switch Ports</h4>
            <Button
              size="sm"
              onClick={addSubItem}
              variant="outline"
              className="h-7 text-xs"
            >
              + Add Port
            </Button>
          </div>
          <div className="space-y-2">
            {subItems.map((item, i) => (
              <div
                key={i}
                className="flex gap-2 items-end bg-slate-800/30 p-2 rounded border border-slate-700"
              >
                <div className="w-12">
                  <Input
                    label="No"
                    placeholder="1"
                    className="h-7 text-xs text-center"
                    value={item.port || ""}
                    onChange={(e) => updateSubItem(i, "port", e.target.value)}
                  />
                </div>

                <div className="w-24">
                  <label className="text-[9px] text-slate-500 block mb-0.5 ml-1">
                    Status
                  </label>
                  <select
                    className={cn(
                      "w-full h-7 border rounded text-xs focus:outline-none appearance-none px-2 font-medium cursor-pointer transition-colors",
                      item.status === "Up"
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                        : item.status === "Down"
                          ? "bg-rose-500/20 border-rose-500 text-rose-400"
                          : "bg-slate-700 border-slate-600 text-slate-400",
                    )}
                    value={item.status || "Empty"}
                    onChange={(e) => updateSubItem(i, "status", e.target.value)}
                  >
                    <option
                      value="Empty"
                      className="bg-slate-800 text-slate-400"
                    >
                      Empty
                    </option>
                    <option
                      value="Up"
                      className="bg-slate-800 text-emerald-400"
                    >
                      Up
                    </option>
                    <option value="Down" className="bg-slate-800 text-rose-400">
                      Down
                    </option>
                  </select>
                </div>

                <div className="w-14">
                  <Input
                    label="VLAN"
                    placeholder="10"
                    className="h-7 text-xs text-center"
                    value={item.vlan || ""}
                    onChange={(e) => updateSubItem(i, "vlan", e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label="Conn IP"
                    className="h-7 text-xs font-mono"
                    value={item.ip || ""}
                    onChange={(e) => updateSubItem(i, "ip", e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label="Details"
                    className="h-7 text-xs"
                    value={item.details || ""}
                    onChange={(e) =>
                      updateSubItem(i, "details", e.target.value)
                    }
                  />
                </div>
                <button
                  onClick={() => removeSubItem(i)}
                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded self-center mt-4"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editDevice ? `Edit ${type}` : `Add New ${type}`}
      size="lg"
      className="bg-[#0f172a] border-slate-700 max-h-[85vh] flex flex-col"
    >
      <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">
              Branch
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              {BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">
              Device Type
            </label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setFormData({});
                setSubItems([]);
              }}
              className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              disabled={!!editDevice}
            >
              {EQUIPMENT_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">{renderFields()}</div>

        {renderSubItems()}
      </div>

      <div className="p-4 border-t border-slate-700 bg-[#1e293b] flex justify-end gap-3 shrink-0">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          isLoading={isLoading}
          className={cn(
            "text-white px-6",
            editDevice
              ? "bg-amber-600 hover:bg-amber-500"
              : "bg-emerald-600 hover:bg-emerald-500",
          )}
        >
          <Save className="w-4 h-4 mr-2" />{" "}
          {editDevice ? "Update Device" : "Save Device"}
        </Button>
      </div>
    </Modal>
  );
};

export default AddEquipmentModal;
