'use client';

import { Button, Checkbox } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useDestinationStore } from '@/store';
import { CheckSquare, Monitor, RefreshCw, Square } from 'lucide-react';
import { useEffect } from 'react';

const DestinationSelector = ({ className }) => {
  const { 
    destinations, 
    selectedDestinations, 
    fetchDestinations, 
    toggleSelection, 
    selectAll, 
    clearSelection 
  } = useDestinationStore();

  useEffect(() => {
    fetchDestinations();
  }, []);

  if (destinations.length === 0) {
    return (
      <div className={cn("bg-bg-tertiary rounded border border-border p-4 text-center text-xs text-text-muted", className)}>
        No destinations found. Please add destinations first.
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full bg-bg-tertiary rounded border border-border", className)}>
      {/* Header / Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-border bg-bg-secondary">
        <span className="text-xs font-medium text-text-secondary">Target Systems ({selectedDestinations.length})</span>
        <div className="flex gap-1">
          <Button size="icon" variant="ghost" onClick={selectAll} title="Select All" className="h-6 w-6">
            <CheckSquare className="w-3.5 h-3.5" />
          </Button>
          <Button size="icon" variant="ghost" onClick={clearSelection} title="Clear Selection" className="h-6 w-6">
            <Square className="w-3.5 h-3.5" />
          </Button>
          <Button size="icon" variant="ghost" onClick={fetchDestinations} title="Refresh" className="h-6 w-6">
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-1 space-y-1 custom-scrollbar">
        {destinations.map((dest) => {
          const isSelected = selectedDestinations.includes(dest.id);
          return (
            <div 
              key={dest.id}
              onClick={() => toggleSelection(dest.id)}
              className={cn(
                "flex items-center gap-2 p-1.5 rounded cursor-pointer text-xs transition-colors border",
                isSelected 
                  ? "bg-accent/10 border-accent/30" 
                  : "bg-bg-card border-transparent hover:bg-bg-hover hover:border-border"
              )}
            >
              <Checkbox 
                checked={isSelected} 
                readOnly 
                className="pointer-events-none"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-text-primary truncate">{dest.name}</span>
                  <span className="text-[10px] text-text-muted">{dest.branch}</span>
                </div>
                <div className="text-[10px] text-text-muted font-mono truncate">
                  {dest.ip}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DestinationSelector;