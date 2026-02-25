"use client";

import { APP_NAME } from "@/lib/constants";
import { Maximize2, Minus, ShieldCheck, Square, X } from "lucide-react"; // Palette حذف شد
import { useState } from "react";

const TitleBar = () => {
  const [isMaximized, setIsMaximized] = useState(false);

  const handleMinimize = () => window.electron?.minimize();
  const handleMaximize = () => {
    window.electron?.maximize();
    setIsMaximized(!isMaximized);
  };
  const handleClose = () => window.electron?.close();

  return (
    <div className="titlebar-drag h-10 bg-[#0f172a] border-b border-slate-700 flex items-center justify-between px-3 select-none z-50">
      {/* Left: Logo & Title */}
      <div className="flex items-center gap-2 titlebar-no-drag">
        <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <ShieldCheck className="w-4 h-4 text-white" />
        </div>
        <span className="text-xs font-bold text-slate-200 tracking-wide">
          {APP_NAME}{" "}
          <span className="text-slate-500 font-normal ml-1">Enterprise</span>
        </span>
      </div>

      {/* Center: Drag Area */}
      <div className="flex-1" />

      {/* Right: Window Controls */}
      <div className="flex items-center gap-1 titlebar-no-drag">
        {/* Theme Button Removed Here */}

        <button
          onClick={handleMinimize}
          className="p-1.5 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>

        <button
          onClick={handleMaximize}
          className="p-1.5 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition-colors"
        >
          {isMaximized ? (
            <Maximize2 className="w-3.5 h-3.5" />
          ) : (
            <Square className="w-3.5 h-3.5" />
          )}
        </button>

        <button
          onClick={handleClose}
          className="p-1.5 hover:bg-red-500 rounded-md text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
