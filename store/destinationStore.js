import { create } from "zustand";

const useDestinationStore = create((set, get) => ({
  destinations: [],
  selectedDestinations: [],
  isLoading: false,
  error: null,

  fetchDestinations: async () => {
    set({ isLoading: true });
    try {
      // Add timestamp to bypass browser cache
      const res = await fetch(`/api/destinations?t=${Date.now()}`);
      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      set({ destinations: data || [], isLoading: false });
    } catch (error) {
      console.error(error);
      set({ error: error.message, isLoading: false, destinations: [] });
    }
  },

  addDestination: async (destination) => {
    try {
      const res = await fetch("/api/destinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(destination),
      });

      if (!res.ok) throw new Error("Failed to add");

      const newDest = await res.json();

      // Update local state AND refresh from server to be sure
      set((state) => ({ destinations: [...state.destinations, newDest] }));

      return { success: true, data: newDest };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  deleteDestination: async (id) => {
    try {
      const res = await fetch(`/api/destinations/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      // Update local state
      set((state) => ({
        destinations: state.destinations.filter((d) => d.id !== id),
        selectedDestinations: state.selectedDestinations.filter(
          (sid) => sid !== id,
        ),
      }));

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Selection Logic
  toggleSelection: (id) =>
    set((state) => ({
      selectedDestinations: state.selectedDestinations.includes(id)
        ? state.selectedDestinations.filter((sid) => sid !== id)
        : [...state.selectedDestinations, id],
    })),

  selectAll: () =>
    set((state) => ({
      selectedDestinations: state.destinations.map((d) => d.id),
    })),

  clearSelection: () => set({ selectedDestinations: [] }),
}));

export default useDestinationStore;
