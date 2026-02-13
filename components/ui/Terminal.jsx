'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

const Terminal = ({ logs = [], className }) => {
  const scrollRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div 
      className={cn(
        "bg-terminal rounded-lg border border-border overflow-hidden flex flex-col font-mono text-sm",
        className
      )}
    >
      {/* Terminal Header */}
      <div className="bg-bg-tertiary px-4 py-1.5 flex items-center justify-between border-b border-border/30">
        <span className="text-xs text-text-muted">Command Prompt - Administrator</span>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-warning/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-success/50" />
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-1 min-h-[300px] max-h-[400px]"
      >
        <div className="text-text-muted mb-4">
          Microsoft Windows [Version 10.0.19045.3693]<br/>
          (c) Microsoft Corporation. All rights reserved.<br/>
          <br/>
          C:\HyperFamily\NetworkManager{'>'} _Initialize Operation...
        </div>

        {logs.map((log, index) => (
          <div 
            key={index} 
            className={cn(
              "terminal-line break-all",
              log.type === 'success' && "text-success",
              log.type === 'error' && "text-error",
              log.type === 'warning' && "text-warning",
              log.type === 'info' && "text-info",
              log.type === 'default' && "text-terminal-text"
            )}
          >
            <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString()}]</span>
            {log.message}
          </div>
        ))}
        
        {/* Blinking Cursor */}
        <div className="animate-pulse inline-block w-2 h-4 bg-terminal-text ml-1 align-middle" />
      </div>
    </div>
  );
};

export default Terminal;