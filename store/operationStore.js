import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useOperationStore = create(
  persist(
    (set) => ({
      destinationPath: 'C:\\HyperFamily\\Downloads', // Default path
      services: '',
      message: '',
      
      setDestinationPath: (path) => set({ destinationPath: path }),
      setServices: (services) => set({ services }),
      setMessage: (message) => set({ message }),
    }),
    {
      name: 'operation-storage', // Save to local storage
    }
  )
);

export default useOperationStore;