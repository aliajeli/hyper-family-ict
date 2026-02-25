import { create } from "zustand";

const useEquipmentStore = create((set, get) => ({
  equipments: [],
  isLoading: false,

  fetchEquipments: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/equipments?t=${Date.now()}`);
      const data = await res.json();
      set({ equipments: data || [], isLoading: false });
    } catch (error) {
      set({ equipments: [], isLoading: false });
    }
  },

  addEquipment: async (item) => {
    const res = await fetch("/api/equipments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    const newItem = await res.json();
    set((state) => ({ equipments: [...state.equipments, newItem] }));
    return newItem;
  },

  deleteEquipment: async (id) => {
    await fetch(`/api/equipments/${id}`, { method: "DELETE" });
    set((state) => ({
      equipments: state.equipments.filter((e) => e.id !== id),
    }));
  },

  updateEquipment: async (id, updates) => {
    const res = await fetch(`/api/equipments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Update failed");
    const updated = await res.json();
    set((state) => ({
      equipments: state.equipments.map((e) => (e.id === id ? updated : e)),
    }));
  },
}));

export default useEquipmentStore;
