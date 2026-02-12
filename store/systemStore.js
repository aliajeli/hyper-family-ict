import { create } from 'zustand';

const useSystemStore = create((set, get) => ({
  // State
  systems: [],
  isLoading: false,
  error: null,
  
  // Actions
  fetchSystems: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/systems');
      const data = await response.json();
      set({ systems: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  addSystem: async (system) => {
    try {
      const response = await fetch('/api/systems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(system),
      });
      const newSystem = await response.json();
      set((state) => ({ systems: [...state.systems, newSystem] }));
      return { success: true, data: newSystem };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  updateSystem: async (id, updates) => {
    try {
      const response = await fetch(`/api/systems/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const updatedSystem = await response.json();
      set((state) => ({
        systems: state.systems.map((s) => (s.id === id ? updatedSystem : s)),
      }));
      return { success: true, data: updatedSystem };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  deleteSystem: async (id) => {
    try {
      await fetch(`/api/systems/${id}`, { method: 'DELETE' });
      set((state) => ({
        systems: state.systems.filter((s) => s.id !== id),
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  getSystemsByBranch: (branch) => {
    return get().systems.filter((s) => s.branch === branch);
  },
}));

export default useSystemStore;