import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useOperationStore = create(
  persist(
    (set) => ({
      destinationPath: 'C:\\HyperFamily\\Downloads',
      services: '',
      message: '',
      stopBefore: false, // 👈 این‌ها باید باشند
      startAfter: false, // 👈
      sendAfter: false,  // 👈
      
      setDestinationPath: (path) => set({ destinationPath: path }),
      setServices: (services) => set({ services }),
      setMessage: (message) => set({ message }),
      setStopBefore: (val) => set({ stopBefore: val }), // 👈 ستترها
      setStartAfter: (val) => set({ startAfter: val }),
      setSendAfter: (val) => set({ sendAfter: val }),
    }),
    {
      name: 'operation-storage',
    }
  )
);

export default useOperationStore;