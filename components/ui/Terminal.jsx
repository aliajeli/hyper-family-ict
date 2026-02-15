'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

const Terminal = ({ logs = [], className }) => {
  const scrollRef = useRef(null);

  // Auto scroll to bottom whenever logs change
  useEffect(() => {
    if (scrollRef.current) {
      // استفاده از setTimeout برای اطمینان از رندر شدن DOM
      setTimeout(() => {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 10);
    }
  }, [logs]);

  return (
    <div className={cn("bg-terminal rounded border border-border overflow-hidden flex flex-col font-mono text-sm shadow-inner", className)}>
      <div className="bg-bg-tertiary px-3 py-1 flex items-center justify-between border-b border-border/30 shrink-0">
        <span className="text-[10px] text-text-muted">Process Log</span>
        <div className="flex gap-1.5">
           <div className="w-2 h-2 rounded-full bg-error/50" />
           <div className="w-2 h-2 rounded-full bg-warning/50" />
           <div className="w-2 h-2 rounded-full bg-success/50" />
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 p-3 overflow-y-auto space-y-0.5 custom-scrollbar"
      >
        <div className="text-text-muted mb-2 text-[10px]">
          HyperFamily System [Version 1.0]<br/>
          (c) ICT Department. All rights reserved.<br/>
          Initializing...<br/>
        </div>

        {logs.map((log, index) => (
          <div 
            key={index} 
            className={cn(
              "break-all leading-tight",
              log.type === 'success' && "text-success",
              log.type === 'error' && "text-error",
              log.type === 'warning' && "text-warning",
              log.type === 'info' && "text-info",
              log.type === 'default' && "text-terminal-text"
            )}
          >
            <span className="opacity-40 mr-2 text-[10px] select-none">[{new Date().toLocaleTimeString('en-GB', { hour12: false })}]</span>
            {log.message}
          </div>
        ))}
        
        <div className="animate-pulse inline-block w-1.5 h-3 bg-terminal-text ml-1 align-middle mt-1" />
      </div>
    </div>
  );
};

export default Terminal;