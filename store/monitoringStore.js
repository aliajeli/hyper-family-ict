import { create } from 'zustand';

const useMonitoringStore = create((set, get) => ({
  // State
  isMonitoring: false,
  statuses: {}, // { systemId: { status: 'online' | 'offline' | 'checking', lastCheck: Date } }
  intervalId: null,
  
  // Actions
  setStatus: (systemId, status) => {
    set((state) => ({
      statuses: {
        ...state.statuses,
        [systemId]: {
          status,
          lastCheck: new Date().toISOString(),
        },
      },
    }));
  },
  
  startMonitoring: (systems, interval = 5000) => {
    const { checkAllSystems } = get();
    
    // Initial check
    checkAllSystems(systems);
    
    // Set interval
    const id = setInterval(() => {
      checkAllSystems(systems);
    }, interval);
    
    set({ isMonitoring: true, intervalId: id });
  },
  
  stopMonitoring: () => {
    const { intervalId } = get();
    if (intervalId) {
      clearInterval(intervalId);
    }
    set({ isMonitoring: false, intervalId: null });
  },
  
  checkAllSystems: async (systems) => {
    const { setStatus } = get();
    
    for (const system of systems) {
      setStatus(system.id, 'checking');
      
      try {
        const response = await fetch('/api/ping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ip: system.ip }),
        });
        
        const data = await response.json();
        setStatus(system.id, data.alive ? 'online' : 'offline');
      } catch (error) {
        setStatus(system.id, 'offline');
      }
    }
  },
  
  getStatus: (systemId) => {
    return get().statuses[systemId] || { status: 'unknown', lastCheck: null };
  },
}));

export default useMonitoringStore;