import { create } from "zustand";

const useSystemStore = create((set, get) => ({
  systems: [],
  isLoading: false,
  error: null,

  fetchSystems: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/systems?t=${Date.now()}`);
      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      set({ systems: data || [], isLoading: false });
    } catch (error) {
      console.error(error);
      set({ error: error.message, isLoading: false, systems: [] });
    }
  },

  addSystem: async (system) => {
    try {
      const res = await fetch("/api/systems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(system),
      });

      if (!res.ok) throw new Error("Failed to add");

      const newSys = await res.json();
      set((state) => ({ systems: [...state.systems, newSys] }));
      return { success: true, data: newSys };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  deleteSystem: async (id) => {
    try {
      const res = await fetch(`/api/systems/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      set((state) => ({
        systems: state.systems.filter((s) => s.id !== id),
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  updateSystem: async (id, updates) => {
    try {
      const res = await fetch(`/api/systems/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Update failed");

      const updatedSys = await res.json();

      console.log("✅ Updated System from API:", updatedSys);

      set((state) => ({
        // جایگزینی آیتم قدیمی با جدید
        systems: state.systems.map((s) => (s.id === id ? updatedSys : s)),
      }));
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: error.message };
    }
  },
}));

export default useSystemStore;
