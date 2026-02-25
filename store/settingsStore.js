import { create } from "zustand";
import { persist } from "zustand/middleware";

const useSettingsStore = create(
  persist(
    (set, get) => ({
      // General
      theme: "dark",
      minimizeToTray: true,

      // Network
      pingInterval: 5000,
      pingTimeout: 2000,
      autoStartMonitoring: false,

      // Paths
      paths: {
        winbox: "C:\\Tools\\winbox.exe",
        putty: "C:\\Program Files\\PuTTY\\putty.exe",
        teamviewer: "C:\\Program Files\\TeamViewer\\TeamViewer.exe",
      },

      // Actions
      setTheme: (theme) => set({ theme }),
      setPingInterval: (val) => set({ pingInterval: parseInt(val) || 5000 }),
      setAppPath: (app, path) =>
        set((state) => ({
          paths: { ...state.paths, [app]: path },
        })),
      toggleAutoStart: () =>
        set((state) => ({ autoStartMonitoring: !state.autoStartMonitoring })),

      // Data Management
      exportData: async () => {
        // Call API to get all data and save as JSON
        try {
          const systems = await (await fetch("/api/systems")).json();
          const destinations = await (await fetch("/api/destinations")).json();
          const equipments = await (await fetch("/api/equipments")).json();

          const backup = {
            systems,
            destinations,
            equipments,
            date: new Date(),
          };

          // Trigger download
          const blob = new Blob([JSON.stringify(backup, null, 2)], {
            type: "application/json",
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `HF_Backup_${new Date().toISOString().split("T")[0]}.json`;
          a.click();
          return true;
        } catch (e) {
          console.error(e);
          return false;
        }
      },
    }),
    {
      name: "app-settings", // Save to LocalStorage
    },
  ),
);

export default useSettingsStore;
