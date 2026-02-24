// store/operationStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useOperationStore = create(
  persist(
    (set) => ({
      destinationPath: "C:\\HyperFamily\\Downloads",
      services: "",
      message: "",
      stopBefore: false,
      startAfter: false,
      sendAfter: false,

      // 👇 New Auth Fields
      authMode: "this", // 'this', 'current', 'anonymous'
      username: "",
      password: "",

      setDestinationPath: (path) => set({ destinationPath: path }),
      setServices: (services) => set({ services }),
      setMessage: (message) => set({ message }),
      setStopBefore: (val) => set({ stopBefore: val }),
      setStartAfter: (val) => set({ startAfter: val }),
      setSendAfter: (val) => set({ sendAfter: val }),

      // 👇 New Setters
      setAuthMode: (mode) => set({ authMode: mode }),
      setUsername: (user) => set({ username: user }),
      setPassword: (pass) => set({ password: pass }),
    }),
    {
      name: "operation-storage",
    },
  ),
);

export default useOperationStore;
