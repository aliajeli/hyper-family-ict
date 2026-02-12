import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set, get) => ({
      // State
      theme: 'dark',
      language: 'en',
      customColors: null,
      
      // Actions
      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
        }
      },
      
      setLanguage: (language) => {
        set({ language });
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('dir', language === 'fa' ? 'rtl' : 'ltr');
          document.documentElement.setAttribute('lang', language);
        }
      },
      
      setCustomColors: (colors) => {
        set({ customColors: colors });
      },
      
      toggleLanguage: () => {
        const newLang = get().language === 'en' ? 'fa' : 'en';
        get().setLanguage(newLang);
      },
      
      // Initialize theme on mount
      initializeTheme: () => {
        const { theme, language } = get();
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
          document.documentElement.setAttribute('dir', language === 'fa' ? 'rtl' : 'ltr');
          document.documentElement.setAttribute('lang', language);
        }
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        customColors: state.customColors,
      }),
    }
  )
);

export default useThemeStore;