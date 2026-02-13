import { create } from 'zustand';

const useAuthStore = create((set, get) => ({
  // State
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  // Actions
  login: async (username, password) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        set({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true };
      } else {
        set({
          isLoading: false,
          error: data.message || 'Login failed',
        });
        return { success: false, message: data.message };
      }
    } catch (error) {
      set({
        isLoading: false,
        error: 'Connection error',
      });
      return { success: false, message: 'Connection error' };
    }
  },
  
  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },
  
  clearError: () => {
    set({ error: null });
  },
}));

export default useAuthStore;