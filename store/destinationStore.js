import { create } from 'zustand';

const useDestinationStore = create((set, get) => ({
  // State
  destinations: [],
  selectedDestinations: [],
  isLoading: false,
  error: null,
  
  // Actions
  fetchDestinations: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/destinations');
      const data = await response.json();
      set({ destinations: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  addDestination: async (destination) => {
    try {
      const response = await fetch('/api/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(destination),
      });
      const newDestination = await response.json();
      set((state) => ({ destinations: [...state.destinations, newDestination] }));
      return { success: true, data: newDestination };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  updateDestination: async (id, updates) => {
    try {
      const response = await fetch(`/api/destinations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const updatedDestination = await response.json();
      set((state) => ({
        destinations: state.destinations.map((d) => (d.id === id ? updatedDestination : d)),
      }));
      return { success: true, data: updatedDestination };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  deleteDestination: async (id) => {
    try {
      await fetch(`/api/destinations/${id}`, { method: 'DELETE' });
      set((state) => ({
        destinations: state.destinations.filter((d) => d.id !== id),
        selectedDestinations: state.selectedDestinations.filter((sid) => sid !== id),
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Selection
  toggleSelection: (id) => {
    set((state) => ({
      selectedDestinations: state.selectedDestinations.includes(id)
        ? state.selectedDestinations.filter((sid) => sid !== id)
        : [...state.selectedDestinations, id],
    }));
  },
  
  selectAll: () => {
    set((state) => ({
      selectedDestinations: state.destinations.map((d) => d.id),
    }));
  },
  
  clearSelection: () => {
    set({ selectedDestinations: [] });
  },
  
  getSelectedDestinations: () => {
    const { destinations, selectedDestinations } = get();
    return destinations.filter((d) => selectedDestinations.includes(d.id));
  },
}));

export default useDestinationStore;