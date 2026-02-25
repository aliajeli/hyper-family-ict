import { create } from "zustand";

const useMonitoringStore = create((set, get) => ({
  isMonitoring: false,
  statuses: {}, // { systemId: { status: 'online' | 'offline' | 'checking' } }

  // متد ریست برای پاک کردن وضعیت‌ها
  resetMonitoring: () => {
    set({
      isMonitoring: false,
      statuses: {}, // خالی کردن وضعیت‌ها -> برگشت به حالت دیفالت (خاکستری)
    });
  },

  setStatus: (systemId, status) => {
    set((state) => ({
      statuses: {
        ...state.statuses,
        [systemId]: { status, lastCheck: new Date().toISOString() },
      },
    }));
  },

  startMonitoring: (systems) => {
    set({ isMonitoring: true });
  },

  stopMonitoring: () => {
    // به جای فقط false کردن، ریست کامل را صدا می‌زنیم
    get().resetMonitoring();
  },
}));

export default useMonitoringStore;
