'use client';

import { useAuthStore, useThemeStore } from '@/store';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import TitleBar from './TitleBar';

const MainLayout = ({ children }) => {
  const { initializeTheme } = useThemeStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return (
    <div className="h-screen flex flex-col bg-bg-primary overflow-hidden rounded-window">
      {/* Custom Title Bar */}
      <TitleBar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
          },
          success: {
            iconTheme: {
              primary: 'var(--success)',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--error)',
              secondary: 'white',
            },
          },
        }}
      />
    </div>
  );
};

export default MainLayout;