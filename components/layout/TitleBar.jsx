'use client';

import { APP_NAME } from '@/lib/constants';
import { themes } from '@/lib/themes';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store';
import { AnimatePresence, motion } from 'framer-motion';
import {
   Globe,
   Maximize2,
   Minus,
   Monitor,
   Moon,
   Palette,
   Settings,
   Square,
   Sun,
   X
} from 'lucide-react';
import { useState } from 'react';

const TitleBar = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const { theme, setTheme, language, toggleLanguage } = useThemeStore();

  // Window controls (این‌ها در Electron کار می‌کنند)
  const handleMinimize = () => {
    if (window.electron) {
      window.electron.minimize();
    }
  };

  const handleMaximize = () => {
    if (window.electron) {
      window.electron.maximize();
      setIsMaximized(!isMaximized);
    }
  };

  const handleClose = () => {
    if (window.electron) {
      window.electron.close();
    }
  };

  const themeOptions = [
    { id: 'dark', name: 'Dark Professional', icon: <Moon className="w-4 h-4" /> },
    { id: 'light', name: 'Light Clean', icon: <Sun className="w-4 h-4" /> },
    { id: 'ocean', name: 'Ocean Blue', icon: <Monitor className="w-4 h-4" /> },
    { id: 'purple', name: 'Purple Night', icon: <Moon className="w-4 h-4" /> },
    { id: 'forest', name: 'Forest Green', icon: <Monitor className="w-4 h-4" /> },
  ];

  return (
    <div className="titlebar-drag h-10 bg-titlebar border-b border-border flex items-center justify-between px-3 select-none">
      {/* Left Section - App Logo & Name */}
      <div className="flex items-center gap-2 titlebar-no-drag">
        <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
          <span className="text-white text-xs font-bold">HF</span>
        </div>
        <span className="text-sm font-semibold text-text-primary">
          {APP_NAME}
        </span>
      </div>

      {/* Center Section - Drag Area */}
      <div className="flex-1" />

      {/* Right Section - Controls */}
      <div className="flex items-center gap-1 titlebar-no-drag">
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="p-1.5 hover:bg-bg-hover rounded-md transition-colors"
          title={language === 'en' ? 'Switch to Persian' : 'Switch to English'}
        >
          <Globe className="w-4 h-4 text-text-secondary" />
        </button>

        {/* Theme Selector */}
        <div className="relative">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="p-1.5 hover:bg-bg-hover rounded-md transition-colors"
            title="Change Theme"
          >
            <Palette className="w-4 h-4 text-text-secondary" />
          </button>

          <AnimatePresence>
            {showThemeMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowThemeMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-1 w-48 bg-bg-secondary border border-border rounded-lg shadow-lg z-50 overflow-hidden"
                >
                  {themeOptions.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setShowThemeMenu(false);
                      }}
                      className={cn(
                        'w-full px-3 py-2 text-left text-sm flex items-center gap-2',
                        'hover:bg-bg-hover transition-colors',
                        theme === t.id && 'bg-accent/10 text-accent'
                      )}
                    >
                      {t.icon}
                      <span>{t.name}</span>
                    </button>
                  ))}
                  
                  <div className="h-px bg-border my-1" />
                  
                  <button
                    onClick={() => {
                      // TODO: Open custom theme editor
                      setShowThemeMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-bg-hover transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Custom Theme</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-border mx-1" />

        {/* Window Controls */}
        <button
          onClick={handleMinimize}
          className="p-1.5 hover:bg-bg-hover rounded-md transition-colors"
          title="Minimize"
        >
          <Minus className="w-4 h-4 text-text-secondary" />
        </button>

        <button
          onClick={handleMaximize}
          className="p-1.5 hover:bg-bg-hover rounded-md transition-colors"
          title={isMaximized ? 'Restore' : 'Maximize'}
        >
          {isMaximized ? (
            <Maximize2 className="w-4 h-4 text-text-secondary" />
          ) : (
            <Square className="w-3.5 h-3.5 text-text-secondary" />
          )}
        </button>

        <button
          onClick={handleClose}
          className="p-1.5 hover:bg-error rounded-md transition-colors group"
          title="Close"
        >
          <X className="w-4 h-4 text-text-secondary group-hover:text-white" />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;